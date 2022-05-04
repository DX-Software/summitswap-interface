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
import { APYs, maximumKodaReward } from '../../constants/staking'
import NavBar from './Navbar'
import { DEAD_ADDRESS, KAPEX, KODA, MAX_UINT256, STAKING_ADDRESS, STAKING_POOL_ADDRESS } from '../../constants'
import './styles.css'

const RadioContainer = styled.div`
  display: flex;
  justify-content: space-around;
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

      let totalRewards = myRating.add(await stakingContract.totalRatings(KODA.address))

      totalRewards = totalRewards.gt(maximumKodaReward) ? maximumKodaReward : totalRewards

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

    const fetchedNoLockingStakedAmount = (await stakingContract.depositedAmounts(0)) as BigNumber
    setNoLockingStakedAmount(utils.formatUnits(fetchedNoLockingStakedAmount, KODA.decimals))

    const fetchedThreeMonthsStakedAmount = (await stakingContract.depositedAmounts(7889229)) as BigNumber
    setThreeMonthsStakedAmount(utils.formatUnits(fetchedThreeMonthsStakedAmount, KODA.decimals))

    const fetchedSixMonthsStakedAmount = (await stakingContract.depositedAmounts(15778458)) as BigNumber
    setSixMonthsStakedAmount(utils.formatUnits(fetchedSixMonthsStakedAmount, KODA.decimals))

    const fetchedYearStakedAmount = (await stakingContract.depositedAmounts(31556916)) as BigNumber
    setYearStakedAmount(utils.formatUnits(fetchedYearStakedAmount, KODA.decimals))
  }, [stakingContract])

  useEffect(() => {
    fetchStakedAmounts()
  }, [fetchStakedAmounts])

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
      fetchApy()
    } catch (err) {
      console.warn(err)
    }
    setIsLoading(false)
  }, [
    account,
    amount,
    currentKodaRatingScore,
    fetchApy,
    fetchStakedAmounts,
    fetchStakingTokenBalance,
    library,
    lockDuration,
    kodaRatingScoreGained,
    stakingContract,
  ])

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
            <Radio id="name" name="locking-duration" value="7889229" checked={lockDuration === '7889229'} /> 3 Months
          </label>
          <label>
            <Radio id="name" name="locking-duration" value="15778458" checked={lockDuration === '15778458'} /> 6 Months
          </label>
          <label>
            <Radio id="name" name="locking-duration" value="31556916" checked={lockDuration === '31556916'} /> 12 Months
          </label>
          <label>
            <Radio id="name" name="locking-duration" value="0" checked={lockDuration === '0'} /> No locking
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
      <p>Statistics </p>
      <InfoContainer>
        <p>
          No locking: <b>{noLockingStakedAmount} KODA</b>
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
      </InfoContainer>
    </AppBody>
  )
}
