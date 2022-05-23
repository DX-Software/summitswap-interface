/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Radio, Input, Button, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useStakingContract, useTokenContract } from 'hooks/useContract'
import { BigNumber, utils } from 'ethers'
import { useToken } from 'hooks/Tokens'
import AppBody from 'pages/AppBody'
import CurrencyLogo from 'components/CurrencyLogo'
import useKodaPrice from 'hooks/useKodaPrice'
import CustomLightSpinner from 'components/CustomLightSpinner'
import useDebounce from 'hooks/useDebounce'
import {
  APYS,
  LOCKING_PERIODS,
  maximumKodaYearlyReward,
  STAKING_ADDRESS,
  STAKING_DISTRIBUTOR_ADDRESS,
  STAKING_POOL_ADDRESS,
} from '../../constants/staking'
import NavBar from './Navbar'
import { DEAD_ADDRESS, KAPEX, KODA, MAX_UINT256 } from '../../constants'
import './styles.css'

const RadioContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
`

const LockingPeriod = styled.div`
  margin: 20px 0;
`

const Balance = styled.p`
  color: gray;
  display: flex;
  align-items: center;
`

const BalanceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
`

const InfoContainer = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${(props) => props.theme.colors.card};
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
`

export default function DepositPage() {
  const { account, library } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [inputAmount, setInputAmount] = useState('')
  const amount = useDebounce(inputAmount, 1000)

  const [lockDuration, setLockDuration] = useState(`${LOCKING_PERIODS._12Months}`)
  const [currentKodaRatingScore, setCurrentKodaRatingScore] = useState<BigNumber>()

  const [kodaRatingScoreGained, setKodaRatingScoreGained] = useState<BigNumber>()

  useEffect(() => {
    async function fetchKodaRatingScoreGained() {
      if (!account || !stakingContract) {
        setKodaRatingScoreGained(utils.parseUnits(amount || '1', KODA.decimals).mul(APYS[KODA.address][lockDuration]))
        return
      }

      const status = (await stakingContract.statuses(account)) as BigNumber
      const statusBoost = (await stakingContract.statusBoosts(status)) as BigNumber
      const totalAmount = utils
        .parseUnits(amount || '1', KODA.decimals)
        .mul(statusBoost.add(10000))
        .div(10000)

      setKodaRatingScoreGained(totalAmount.mul(APYS[KODA.address][lockDuration]))
    }

    fetchKodaRatingScoreGained()
  }, [account, amount, lockDuration, stakingContract])

  const [needsToApprove, setNeedsToApprove] = useState(true)
  const [isAmountValid, setIsAmountValid] = useState(false)
  const [amountError, setAmountError] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const kodaTokenContract = useTokenContract(KODA.address)
  const kodaToken = useToken(KODA.address)
  const [stakingTokenBalance, setStakingTokenBalance] = useState(BigNumber.from(0))

  // Statistics
  const [noLockingStakedAmount, setNoLockingStakedAmount] = useState<string>()
  const [threeMonthsStakedAmount, setThreeMonthsStakedAmount] = useState<string>()
  const [sixMonthsStakedAmount, setSixMonthsStakedAmount] = useState<string>()
  const [yearStakedAmount, setYearStakedAmount] = useState<string>()
  const [combinedApy, setCombinedApy] = useState<string>()
  const [currentApy, setCurrentApy] = useState<string>()
  const [circulatingAmount, setCirculatingAmount] = useState<string>()
  const [circulatingAmountWithStaking, setCirculatingAmountWithStaking] = useState<string>()

  // My statistics
  const [userNoLockingStakedAmount, setUserNoLockingStakedAmount] = useState<string>()
  const [userThreeMonthsStakedAmount, setUserThreeMonthsStakedAmount] = useState<string>()
  const [userSixMonthsStakedAmount, setUserSixMonthsStakedAmount] = useState<string>()
  const [userYearStakedAmount, setUserYearStakedAmount] = useState<string>()
  const [totalKodaEarned, setTotalKodaEarned] = useState<string>()
  const [totalKapexEarned, setTotalKapexEarned] = useState<string>()

  const kodaPrice = useKodaPrice()

  const fetchCirculatingSupply = useCallback(async () => {
    setCirculatingAmountWithStaking(undefined)
    setCirculatingAmount(undefined)

    if (!kodaTokenContract) {
      setCirculatingAmountWithStaking('0')
      setCirculatingAmount('...')
      return
    }

    const totalSupply = (await kodaTokenContract.totalSupply()) as BigNumber
    const burnedAmount = (await kodaTokenContract.balanceOf(DEAD_ADDRESS)) as BigNumber
    const stakedAmount = (await kodaTokenContract.balanceOf(STAKING_ADDRESS)) as BigNumber
    const stakingPoolAmount = (await kodaTokenContract.balanceOf(STAKING_POOL_ADDRESS)) as BigNumber
    const distributorAmount = (await kodaTokenContract.balanceOf(STAKING_DISTRIBUTOR_ADDRESS)) as BigNumber

    const circulatingSupply = totalSupply
      .sub(burnedAmount)
      .sub(stakedAmount)
      .sub(stakingPoolAmount)
      .sub(distributorAmount)
    const circulatingSupplyWithtStaking = circulatingSupply.add(stakedAmount)

    setCirculatingAmountWithStaking(utils.formatUnits(circulatingSupplyWithtStaking, KODA.decimals))
    setCirculatingAmount(Math.floor(Number(utils.formatUnits(circulatingSupply, KODA.decimals))).toString())
  }, [kodaTokenContract])

  useEffect(() => {
    fetchCirculatingSupply()
  }, [fetchCirculatingSupply])

  const fetchStakingTokenBalance = useCallback(async () => {
    if (!account || !kodaTokenContract) {
      setStakingTokenBalance(BigNumber.from(0))
      return
    }

    const fetchedBalance = (await kodaTokenContract.balanceOf(account)) as BigNumber

    setStakingTokenBalance(fetchedBalance)
  }, [account, kodaTokenContract])

  useEffect(() => {
    fetchStakingTokenBalance()
  }, [fetchStakingTokenBalance])

  useEffect(() => {
    async function fetchCurrentApy() {
      setCurrentApy(undefined)

      if (!stakingContract || !kodaRatingScoreGained) {
        setCurrentApy('...')
        return
      }

      setIsLoading(true)
      try {
        const myRating = kodaRatingScoreGained
        const kodaTotalRating = kodaRatingScoreGained.add(await stakingContract.totalRatings(KODA.address))

        let totalRewards = kodaTotalRating.div(100)
        totalRewards = totalRewards.gt(maximumKodaYearlyReward) ? maximumKodaYearlyReward : totalRewards

        const willEarn = totalRewards.mul(myRating).div(kodaTotalRating)
        const myStakedAmount = utils.parseUnits(amount || '1', KODA.decimals)
        const calculatedApy =
          (+utils.formatUnits(willEarn, KODA.decimals) / +utils.formatUnits(myStakedAmount, KODA.decimals)) * 100

        if (calculatedApy) {
          setCurrentApy(calculatedApy.toFixed(2))
        } else {
          setCurrentApy('...')
        }
      } catch (err) {
        console.warn(err)
        setCurrentApy('...')
      }
      setIsLoading(false)
    }

    fetchCurrentApy()
  }, [amount, kodaRatingScoreGained, stakingContract])

  const fetchCombinedApy = useCallback(async () => {
    setCombinedApy(undefined)

    if (!stakingContract || !currentKodaRatingScore) {
      setCombinedApy('...')
      return
    }

    setIsLoading(true)
    try {
      const myRating = currentKodaRatingScore
      const kodaTotalRating = await stakingContract.totalRatings(KODA.address)

      let totalRewards = kodaTotalRating.div(100)
      totalRewards = totalRewards.gt(maximumKodaYearlyReward) ? maximumKodaYearlyReward : totalRewards

      const willEarn = totalRewards.mul(myRating).div(kodaTotalRating)

      const myStakedAmount = await stakingContract.userTotalDeposits(account ?? DEAD_ADDRESS)

      const calculatedApy =
        (+utils.formatUnits(willEarn, KODA.decimals) / +utils.formatUnits(myStakedAmount, KODA.decimals)) * 100

      if (calculatedApy) {
        setCombinedApy(calculatedApy.toFixed(2))
      } else {
        setCombinedApy('...')
      }
    } catch (err) {
      console.warn(err)
      setCombinedApy('...')
    }
    setIsLoading(false)
  }, [account, currentKodaRatingScore, stakingContract])

  useEffect(() => {
    fetchCombinedApy()
  }, [fetchCombinedApy])

  const fetchStakedAmounts = useCallback(async () => {
    setNoLockingStakedAmount(undefined)
    setThreeMonthsStakedAmount(undefined)
    setSixMonthsStakedAmount(undefined)
    setYearStakedAmount(undefined)

    if (!stakingContract) {
      setNoLockingStakedAmount('...')
      setThreeMonthsStakedAmount('...')
      setSixMonthsStakedAmount('...')
      setYearStakedAmount('...')
      return
    }

    const fetchedNoLockingStakedAmount = (await stakingContract.lockAmounts(LOCKING_PERIODS._0Months)) as BigNumber
    setNoLockingStakedAmount(utils.formatUnits(fetchedNoLockingStakedAmount, KODA.decimals).split('.')[0])

    const fetchedThreeMonthsStakedAmount = (await stakingContract.lockAmounts(LOCKING_PERIODS._3Months)) as BigNumber
    setThreeMonthsStakedAmount(utils.formatUnits(fetchedThreeMonthsStakedAmount, KODA.decimals).split('.')[0])

    const fetchedSixMonthsStakedAmount = (await stakingContract.lockAmounts(LOCKING_PERIODS._6Months)) as BigNumber
    setSixMonthsStakedAmount(utils.formatUnits(fetchedSixMonthsStakedAmount, KODA.decimals).split('.')[0])

    const fetchedYearStakedAmount = (await stakingContract.lockAmounts(LOCKING_PERIODS._12Months)) as BigNumber
    setYearStakedAmount(utils.formatUnits(fetchedYearStakedAmount, KODA.decimals).split('.')[0])
  }, [stakingContract])

  useEffect(() => {
    fetchStakedAmounts()
  }, [fetchStakedAmounts])

  const fetchPersonalStakedAmounts = useCallback(async () => {
    setUserNoLockingStakedAmount(undefined)
    setUserThreeMonthsStakedAmount(undefined)
    setUserSixMonthsStakedAmount(undefined)
    setUserYearStakedAmount(undefined)

    if (!stakingContract || !account) {
      setUserNoLockingStakedAmount('...')
      setUserThreeMonthsStakedAmount('...')
      setUserSixMonthsStakedAmount('...')
      setUserYearStakedAmount('...')
      return
    }

    const fetchedNoLockingStakedAmount = (await stakingContract.userDeposits(
      account,
      LOCKING_PERIODS._0Months
    )) as BigNumber
    setUserNoLockingStakedAmount(utils.formatUnits(fetchedNoLockingStakedAmount, KODA.decimals).split('.')[0])

    const fetchedThreeMonthsStakedAmount = (await stakingContract.userDeposits(
      account,
      LOCKING_PERIODS._3Months
    )) as BigNumber
    setUserThreeMonthsStakedAmount(utils.formatUnits(fetchedThreeMonthsStakedAmount, KODA.decimals).split('.')[0])

    const fetchedSixMonthsStakedAmount = (await stakingContract.userDeposits(
      account,
      LOCKING_PERIODS._6Months
    )) as BigNumber
    setUserSixMonthsStakedAmount(utils.formatUnits(fetchedSixMonthsStakedAmount, KODA.decimals).split('.')[0])

    const fetchedYearStakedAmount = (await stakingContract.userDeposits(
      account,
      LOCKING_PERIODS._12Months
    )) as BigNumber
    setUserYearStakedAmount(utils.formatUnits(fetchedYearStakedAmount, KODA.decimals).split('.')[0])
  }, [stakingContract, account])

  useEffect(() => {
    fetchPersonalStakedAmounts()
  }, [fetchPersonalStakedAmounts])

  useEffect(() => {
    if (!amount || !stakingTokenBalance) {
      return
    }
    if (utils.parseUnits(amount, KODA.decimals).lte(BigNumber.from(0))) {
      setIsAmountValid(false)
      setAmountError('Please input a positive amount')
    } else if (utils.parseUnits(amount, KODA.decimals).gt(stakingTokenBalance)) {
      setIsAmountValid(false)
      setAmountError("You don't have enough tokens")
    } else {
      setIsAmountValid(true)
    }
  }, [amount, stakingTokenBalance])

  useEffect(() => {
    async function fetchAllowance() {
      if (!account || !amount || !kodaTokenContract || !stakingContract) {
        return
      }

      const allowance = (await kodaTokenContract.allowance(account, stakingContract.address)) as BigNumber

      setNeedsToApprove(allowance.lt(utils.parseUnits(amount, 'gwei')))
    }

    fetchAllowance()
  }, [account, amount, kodaTokenContract, stakingContract])

  const fetchCurrentKodaRatingScore = useCallback(async () => {
    setCurrentKodaRatingScore(undefined)

    if (!stakingContract || !account) {
      setCurrentKodaRatingScore(BigNumber.from(0))
      return
    }

    setIsLoading(true)
    const fetchedKodaRatingScore = (await stakingContract.ratings(KODA.address, account)) as BigNumber
    setIsLoading(false)

    setCurrentKodaRatingScore(fetchedKodaRatingScore)
  }, [account, stakingContract])

  useEffect(() => {
    fetchCurrentKodaRatingScore()
  }, [fetchCurrentKodaRatingScore])

  const deposit = useCallback(async () => {
    if (!account || !lockDuration || !amount || !stakingContract) {
      return
    }

    setIsLoading(true)
    try {
      const receipt = await stakingContract.putDeposit(utils.parseUnits(amount, KODA.decimals), lockDuration)
      await library.waitForTransaction(receipt.hash)
      setInputAmount('')
      fetchStakingTokenBalance()
      fetchCurrentKodaRatingScore()
      fetchStakedAmounts()
      fetchPersonalStakedAmounts()
      fetchCombinedApy()
    } catch (err) {
      console.warn(err)
    }
    setIsLoading(false)
  }, [
    account,
    lockDuration,
    amount,
    stakingContract,
    library,
    fetchStakingTokenBalance,
    fetchStakedAmounts,
    fetchPersonalStakedAmounts,
    fetchCombinedApy,
    fetchCurrentKodaRatingScore,
  ])

  useEffect(() => {
    async function fetchTotalEarned() {
      setTotalKodaEarned(undefined)
      setTotalKapexEarned(undefined)

      if (!stakingContract || !account) {
        setTotalKodaEarned('...')
        setTotalKapexEarned('...')
        return
      }

      const fetchedTotalKodaEarned = (await stakingContract.tokensEarned(KODA.address, account)) as BigNumber
      setTotalKodaEarned(utils.formatUnits(fetchedTotalKodaEarned, KODA.decimals))

      const fetchedTotalKapexEarned = (await stakingContract.tokensEarned(KAPEX.address, account)) as BigNumber
      setTotalKapexEarned(utils.formatUnits(fetchedTotalKapexEarned, KAPEX.decimals))
    }

    fetchTotalEarned()
  }, [stakingContract, account])

  const approve = useCallback(async () => {
    if (!account || !kodaTokenContract || !stakingContract) {
      return
    }

    setIsLoading(true)
    try {
      const receipt = await kodaTokenContract.approve(stakingContract.address, MAX_UINT256)
      await library.waitForTransaction(receipt.hash)
      setNeedsToApprove(false)
    } catch (err) {
      console.warn(err)
    }
    setIsLoading(false)
  }, [account, kodaTokenContract, stakingContract, library])

  const onMax = useCallback(() => {
    if (!stakingTokenBalance) {
      return
    }

    setInputAmount(utils.formatUnits(stakingTokenBalance ?? BigNumber.from(0), KODA.decimals))
  }, [stakingTokenBalance])

  return (
    <AppBody>
      <br />
      <NavBar activeIndex={0} />
      <p>Amount</p>
      <Input
        placeholder="0.00"
        type="number"
        value={inputAmount}
        onChange={(o) => setInputAmount(o.target.value)}
        style={{ margin: '10px 0' }}
      />
      {!isAmountValid && <Text color="red">{amountError}</Text>}
      <BalanceContainer>
        <Balance>
          <CurrencyLogo currency={kodaToken ?? undefined} size="24px" style={{ marginRight: '8px' }} />
          Balance: {utils.formatUnits(stakingTokenBalance ?? BigNumber.from(0), KODA.decimals)}
        </Balance>
        <Button onClick={onMax} scale="xxs" variant="tertiary">
          MAX
        </Button>
      </BalanceContainer>
      <LockingPeriod>
        <p>Locking period</p>
        <RadioContainer onChange={(o: React.ChangeEvent<HTMLInputElement>) => setLockDuration(o.target.value)}>
          <label>
            <Radio
              id="name"
              name="locking-duration"
              value={LOCKING_PERIODS._0Months}
              checked={+lockDuration === LOCKING_PERIODS._0Months}
            />{' '}
            No locking (Lowest APY)
          </label>
          <label>
            <Radio
              id="name"
              name="locking-duration"
              value={LOCKING_PERIODS._3Months}
              checked={+lockDuration === LOCKING_PERIODS._3Months}
            />{' '}
            92 Days (~3 Months)
          </label>
          <label>
            <Radio
              id="name"
              name="locking-duration"
              value={LOCKING_PERIODS._6Months}
              checked={+lockDuration === LOCKING_PERIODS._6Months}
            />{' '}
            183 Days (~6 Months)
          </label>
          <label>
            <Radio
              id="name"
              name="locking-duration"
              value={LOCKING_PERIODS._12Months}
              checked={+lockDuration === LOCKING_PERIODS._12Months}
            />{' '}
            365 Days (~12 Months) (Highest APY)
          </label>
        </RadioContainer>
      </LockingPeriod>
      <InfoContainer>
        <p>
          Current APY: <b>{currentApy}% + KAPEX BONUSES</b>
        </p>
        {!currentApy && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="35px" />
          </div>
        )}
      </InfoContainer>
      <Text fontSize="14px">*APY is variable and based on the overall staking statistics</Text>
      <Text fontSize="14px">*APY will reduce as more of the supply is staked</Text>
      <Text fontSize="14px">*Any rewards you have accrued will be claimed with deposit</Text>
      <ButtonsContainer>
        <Button disabled={!amount || isLoading || !needsToApprove || !isAmountValid} onClick={approve}>
          APPROVE
        </Button>
        <Button disabled={!amount || isLoading || needsToApprove || !isAmountValid} onClick={deposit}>
          DEPOSIT
        </Button>
      </ButtonsContainer>

      {account && (
        <>
          <p>My Staking Statistics </p>
          <InfoContainer>
            {userNoLockingStakedAmount &&
            userThreeMonthsStakedAmount &&
            userSixMonthsStakedAmount &&
            totalKodaEarned &&
            totalKapexEarned &&
            userYearStakedAmount &&
            combinedApy ? (
              <>
                <p>
                  No Lock: <b>{userNoLockingStakedAmount} KODA</b>&nbsp;($
                  {Math.floor(+userNoLockingStakedAmount * kodaPrice).toLocaleString('en')})
                </p>
                <p>
                  3 Months: <b>{userThreeMonthsStakedAmount} KODA</b>&nbsp;($
                  {Math.floor(+userThreeMonthsStakedAmount * kodaPrice).toLocaleString('en')})
                </p>
                <p>
                  6 Months: <b>{userSixMonthsStakedAmount} KODA</b>&nbsp;($
                  {Math.floor(+userSixMonthsStakedAmount * kodaPrice).toLocaleString('en')})
                </p>
                <p>
                  12 Months: <b>{userYearStakedAmount} KODA</b>&nbsp;($
                  {Math.floor(+userYearStakedAmount * kodaPrice).toLocaleString('en')})
                </p>
                <p>
                  Combined APY: <b>{combinedApy}%</b>
                </p>
                <p>
                  KODA Earned: <b> {totalKodaEarned?.split('.')[0]} KODA</b>
                </p>
                <p>
                  KAPEX Earned: <b> {totalKapexEarned?.split('.')[0]} KAPEX</b>
                </p>
              </>
            ) : (
              <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="45px" />
            )}
          </InfoContainer>
        </>
      )}

      <p>Overall Staking Statistics</p>
      <InfoContainer>
        {noLockingStakedAmount &&
        threeMonthsStakedAmount &&
        sixMonthsStakedAmount &&
        yearStakedAmount &&
        circulatingAmount &&
        circulatingAmountWithStaking ? (
          <>
            <p>
              No Lock: <b>{noLockingStakedAmount} KODA</b>
            </p>
            <p>
              3 Months: <b>{threeMonthsStakedAmount} KODA</b>
            </p>
            <p>
              6 Months: <b>{sixMonthsStakedAmount} KODA</b>
            </p>
            <p>
              12 Months: <b>{yearStakedAmount} KODA</b>
            </p>
            <p>
              Circulating: <b> {circulatingAmount} KODA</b>
            </p>
            <p>
              Total staked:{' '}
              <b>
                {(
                  ((+noLockingStakedAmount + +threeMonthsStakedAmount + +sixMonthsStakedAmount + +yearStakedAmount) *
                    100) /
                  +circulatingAmountWithStaking
                ).toFixed(3)}
                %
              </b>
            </p>
            <p>
              Total locked staked:{' '}
              <b>
                {(
                  ((+threeMonthsStakedAmount + +sixMonthsStakedAmount + +yearStakedAmount) * 100) /
                  +circulatingAmountWithStaking
                ).toFixed(3)}
                %
              </b>
            </p>
          </>
        ) : (
          <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="45px" />
        )}
      </InfoContainer>
    </AppBody>
  )
}
