/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Radio, Input, Button, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useStakingContract, useTokenContract } from 'hooks/useContract'
import { BigNumber, utils } from 'ethers'
import { useToken } from 'hooks/Tokens'
import AppBody from 'pages/AppBody'
import CurrencyLogo from 'components/CurrencyLogo'
import useGetKapexPriceData from 'hooks/useGetKapexPriceData'
import useGetKodaPriceData from 'hooks/useGetKodaPriceData'
import { APYs, lockingPeriods, maximumKodaReward } from '../../constants/staking'
import NavBar from './Navbar'
import { DEAD_ADDRESS, KAPEX, KODA, MAX_UINT256, STAKING_ADDRESS, STAKING_POOL_ADDRESS } from '../../constants'
import './styles.css'

const RadioContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${(props) => props.theme.colors.card};
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
`

export default function Deposit() {
  const { account, library } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [amount, setAmount] = useState('')
  const [lockDuration, setLockDuration] = useState('31556916')
  const [currentKodaRatingScore, setCurrentKodaRatingScore] = useState(BigNumber.from(0))

  const kodaRatingScoreGained = useMemo(() => {
    if (!amount) {
      return BigNumber.from(0)
    }

    return utils.parseUnits(amount, KODA.decimals).mul(APYs[KODA.address][lockDuration])
  }, [amount, lockDuration])

  const [needsToApprove, setNeedsToApprove] = useState(true)
  const [isAmountValid, setIsAmountValid] = useState(false)
  const [amountError, setAmountError] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const kodaTokenContract = useTokenContract(KODA.address)
  const kodaToken = useToken(KODA.address)
  const [stakingTokenBalance, setStakingTokenBalance] = useState(BigNumber.from(0))

  const [noLockingStakedAmount, setNoLockingStakedAmount] = useState('...')
  const [threeMonthsStakedAmount, setThreeMonthsStakedAmount] = useState('...')
  const [sixMonthsStakedAmount, setSixMonthsStakedAmount] = useState('...')
  const [yearStakedAmount, setYearStakedAmount] = useState('...')

  const [apy, setApy] = useState('...')
  const [circulatingAmount, setCirculatingAmount] = useState('...')

  const [userNoLockingStakedAmount, setUserNoLockingStakedAmount] = useState('...')
  const [userThreeMonthsStakedAmount, setUserThreeMonthsStakedAmount] = useState('...')
  const [userSixMonthsStakedAmount, setUserSixMonthsStakedAmount] = useState('...')
  const [userYearStakedAmount, setUserYearStakedAmount] = useState('...')

  const [totalKodaEarned, setTotalKodaEarned] = useState('...')
  const [totalKapexEarned, setTotalKapexEarned] = useState('...')

  const kodaPriceData = useGetKodaPriceData()
  const kodaPrice = kodaPriceData ? Number(kodaPriceData['koda-finance'].usd) : NaN
  const kapexPrice = useGetKapexPriceData()

  const fetchCirculatingSupply = useCallback(async () => {
    if (!kodaTokenContract) {
      setCirculatingAmount('...')
      return
    }

    const totalSupply = (await kodaTokenContract.totalSupply()) as BigNumber
    const burnedAmount = (await kodaTokenContract.balanceOf(DEAD_ADDRESS)) as BigNumber
    const stakedAmount = (await kodaTokenContract.balanceOf(STAKING_ADDRESS)) as BigNumber
    const stakingPoolAmount = (await kodaTokenContract.balanceOf(STAKING_POOL_ADDRESS)) as BigNumber

    const circulatingSupply = totalSupply.sub(burnedAmount).sub(stakedAmount).sub(stakingPoolAmount)

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

  const fetchApy = useCallback(async () => {
    if (!stakingContract) {
      setApy('...')
      return
    }

    setIsLoading(true)
    try {
      const myRating = currentKodaRatingScore.add(kodaRatingScoreGained)
      const kodaTotalRating = kodaRatingScoreGained.add(await stakingContract.totalRatings(KODA.address))

      const totalRewards = kodaTotalRating.gt(maximumKodaReward) ? maximumKodaReward : kodaTotalRating

      const willEarn = totalRewards.mul(myRating).div(kodaTotalRating)

      const myStakedAmount = utils
        .parseUnits(amount || '0', KODA.decimals)
        .add(await stakingContract.userTotalDeposits(account ?? DEAD_ADDRESS)) as BigNumber

      const calculatedApy =
        +utils.formatUnits(willEarn, KODA.decimals) / +utils.formatUnits(myStakedAmount, KODA.decimals)

      setApy(calculatedApy.toFixed(2))
    } catch (err) {
      console.warn(err)
      setApy('...')
    }
    setIsLoading(false)
  }, [account, amount, currentKodaRatingScore, kodaRatingScoreGained, stakingContract])

  useEffect(() => {
    fetchApy()
  }, [fetchApy])

  const fetchStakedAmounts = useCallback(async () => {
    if (!stakingContract) {
      setNoLockingStakedAmount('...')
      setThreeMonthsStakedAmount('...')
      setSixMonthsStakedAmount('...')
      setYearStakedAmount('...')
      return
    }

    const fetchedNoLockingStakedAmount = (await stakingContract.lockAmounts(lockingPeriods._0Months)) as BigNumber
    setNoLockingStakedAmount(utils.formatUnits(fetchedNoLockingStakedAmount, KODA.decimals))

    const fetchedThreeMonthsStakedAmount = (await stakingContract.lockAmounts(lockingPeriods._3Months)) as BigNumber
    setThreeMonthsStakedAmount(utils.formatUnits(fetchedThreeMonthsStakedAmount, KODA.decimals))

    const fetchedSixMonthsStakedAmount = (await stakingContract.lockAmounts(lockingPeriods._6Months)) as BigNumber
    setSixMonthsStakedAmount(utils.formatUnits(fetchedSixMonthsStakedAmount, KODA.decimals))

    const fetchedYearStakedAmount = (await stakingContract.lockAmounts(lockingPeriods._12Months)) as BigNumber
    setYearStakedAmount(utils.formatUnits(fetchedYearStakedAmount, KODA.decimals))
  }, [stakingContract])

  useEffect(() => {
    fetchStakedAmounts()
  }, [fetchStakedAmounts])

  const fetchPersonalStakedAmounts = useCallback(async () => {
    if (!stakingContract || !account) {
      setUserNoLockingStakedAmount('...')
      setUserThreeMonthsStakedAmount('...')
      setUserSixMonthsStakedAmount('...')
      setUserYearStakedAmount('...')
      return
    }

    const fetchedNoLockingStakedAmount = (await stakingContract.userDeposits(
      account,
      lockingPeriods._0Months
    )) as BigNumber
    setUserNoLockingStakedAmount(utils.formatUnits(fetchedNoLockingStakedAmount, KODA.decimals))

    const fetchedThreeMonthsStakedAmount = (await stakingContract.userDeposits(
      account,
      lockingPeriods._3Months
    )) as BigNumber
    setUserThreeMonthsStakedAmount(utils.formatUnits(fetchedThreeMonthsStakedAmount, KODA.decimals))

    const fetchedSixMonthsStakedAmount = (await stakingContract.userDeposits(
      account,
      lockingPeriods._6Months
    )) as BigNumber
    setUserSixMonthsStakedAmount(utils.formatUnits(fetchedSixMonthsStakedAmount, KODA.decimals))

    const fetchedYearStakedAmount = (await stakingContract.userDeposits(account, lockingPeriods._12Months)) as BigNumber
    setUserYearStakedAmount(utils.formatUnits(fetchedYearStakedAmount, KODA.decimals))
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

  useEffect(() => {
    async function fetchCurrentRatingScore() {
      if (!stakingContract || !account) {
        setCurrentKodaRatingScore(BigNumber.from(0))
        return
      }

      setIsLoading(true)
      const fetchedKodaRatingScore = (await stakingContract.ratings(KODA.address, account)) as BigNumber
      setIsLoading(false)

      setCurrentKodaRatingScore(fetchedKodaRatingScore)
    }

    fetchCurrentRatingScore()
  }, [stakingContract, account])

  const deposit = useCallback(async () => {
    if (!account || !lockDuration || !amount || !stakingContract) {
      return
    }

    setIsLoading(true)
    try {
      const receipt = await stakingContract.putDeposit(utils.parseUnits(amount, KODA.decimals), lockDuration)
      await library.waitForTransaction(receipt.hash)
      fetchStakingTokenBalance()
      setCurrentKodaRatingScore(currentKodaRatingScore.add(kodaRatingScoreGained))
      fetchStakedAmounts()
      fetchPersonalStakedAmounts()
      fetchApy()
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
    currentKodaRatingScore,
    kodaRatingScoreGained,
    fetchStakedAmounts,
    fetchPersonalStakedAmounts,
    fetchApy,
  ])

  useEffect(() => {
    async function fetchTotalEarned() {
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

    setAmount(utils.formatUnits(stakingTokenBalance ?? BigNumber.from(0), KODA.decimals))
  }, [stakingTokenBalance])

  return (
    <AppBody>
      <br />
      <NavBar activeIndex={0} />
      <p>Amount</p>
      <Input
        placeholder="0.00"
        type="number"
        value={amount}
        onChange={(o) => setAmount(o.target.value)}
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
              value={lockingPeriods._0Months}
              checked={+lockDuration === lockingPeriods._0Months}
            />{' '}
            No locking (APY {APYs[KODA.address][lockingPeriods._0Months].toString()}%)
          </label>
          <label>
            <Radio
              id="name"
              name="locking-duration"
              value={lockingPeriods._3Months}
              checked={+lockDuration === lockingPeriods._3Months}
            />{' '}
            3 Months (APY {APYs[KODA.address][lockingPeriods._3Months].toString()}%)
          </label>
          <label>
            <Radio
              id="name"
              name="locking-duration"
              value={lockingPeriods._6Months}
              checked={+lockDuration === lockingPeriods._6Months}
            />{' '}
            6 Months (APY {APYs[KODA.address][lockingPeriods._6Months].toString()}%)
          </label>
          <label>
            <Radio
              id="name"
              name="locking-duration"
              value={lockingPeriods._12Months}
              checked={+lockDuration === lockingPeriods._12Months}
            />{' '}
            12 Months (APY {APYs[KODA.address][lockingPeriods._12Months].toString()}%)
          </label>
        </RadioContainer>
      </LockingPeriod>
      <InfoContainer>
        <p>
          Current rating score:&nbsp;
          <b>{utils.formatUnits(currentKodaRatingScore, KODA.decimals)}</b>
        </p>
        <p>
          Gained rating score:&nbsp;
          <b>{utils.formatUnits(kodaRatingScoreGained, KODA.decimals)}</b>
        </p>
        <p>
          New rating score:&nbsp;
          <b>{utils.formatUnits(currentKodaRatingScore.add(kodaRatingScoreGained), KODA.decimals)}</b>
        </p>

        <p>
          APY: <b>{apy} % + KAPEX BONUSES</b>
        </p>
      </InfoContainer>
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
          <p>My Statistics </p>
          <InfoContainer>
            <p>
              No locking (APY {APYs[KODA.address][lockingPeriods._0Months].toString()}%):{' '}
              <b>{userNoLockingStakedAmount} KODA</b>&nbsp;(
              {(+userNoLockingStakedAmount * kodaPrice).toFixed(2)}$)
            </p>
            <p>
              3 Months (APY {APYs[KODA.address][lockingPeriods._3Months].toString()}%):{' '}
              <b>{userThreeMonthsStakedAmount} KODA</b>&nbsp;(
              {(+userThreeMonthsStakedAmount * kodaPrice).toFixed(2)}$)
            </p>
            <p>
              6 Months (APY {APYs[KODA.address][lockingPeriods._6Months].toString()}%):{' '}
              <b>{userSixMonthsStakedAmount} KODA</b>&nbsp;(
              {(+userSixMonthsStakedAmount * kodaPrice).toFixed(2)}$)
            </p>
            <p>
              12 Months (APY {APYs[KODA.address][lockingPeriods._12Months].toString()}%):{' '}
              <b>{userYearStakedAmount} KODA</b>
              &nbsp;(
              {(+userYearStakedAmount * kodaPrice).toFixed(2)}$)
            </p>
            <p>
              Koda Earned: <b> {totalKodaEarned} KODA</b>&nbsp;({(+totalKodaEarned * kodaPrice).toFixed(2)}$)
            </p>
            <p>
              Kapex Earned: <b> {totalKapexEarned} KAPEX</b>&nbsp;({(+totalKapexEarned * kapexPrice).toFixed(2)}$)
            </p>
          </InfoContainer>
        </>
      )}
      <p>Statistics </p>
      <InfoContainer>
        <p>
          No locking (APY {APYs[KODA.address][lockingPeriods._0Months].toString()}%):{' '}
          <b>{noLockingStakedAmount} KODA</b>&nbsp;(
          {(+noLockingStakedAmount * kodaPrice).toFixed(2)}$)
        </p>
        <p>
          3 Months (APY {APYs[KODA.address][lockingPeriods._3Months].toString()}%):{' '}
          <b>{threeMonthsStakedAmount} KODA</b>&nbsp;(
          {(+threeMonthsStakedAmount * kodaPrice).toFixed(2)}$)
        </p>
        <p>
          6 Months (APY {APYs[KODA.address][lockingPeriods._6Months].toString()}%): <b>{sixMonthsStakedAmount} KODA</b>
          &nbsp;(
          {(+sixMonthsStakedAmount * kodaPrice).toFixed(2)}$)
        </p>
        <p>
          12 Months (APY {APYs[KODA.address][lockingPeriods._12Months].toString()}%): <b>{yearStakedAmount} KODA</b>
          &nbsp;(
          {(+yearStakedAmount * kodaPrice).toFixed(2)}$)
        </p>
        <p>
          Circulating: <b> {circulatingAmount} KODA</b>&nbsp;(
          {(+circulatingAmount * kodaPrice).toFixed(2)}$)
        </p>
      </InfoContainer>
    </AppBody>
  )
}
