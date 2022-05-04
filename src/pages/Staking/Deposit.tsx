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
import { APY, maximumKodaReward } from 'constants/staking'
import NavBar from './Navbar'
import { DEAD_ADDRESS, KODA, MAX_UINT256, STAKING_ADDRESS, STAKING_POOL_ADDRESS } from '../../constants'
import './styles.css'
import { Deposit as IDeposit } from './types'

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
  const [currentRatingScore, setCurrentRatingScore] = useState(BigNumber.from(0))
  const [ratingScoreGained, setRatingScoreGained] = useState(BigNumber.from(0))
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
    if (!kodaTokenContract || !kodaToken) {
      setCirculatingAmount('...')
      return
    }

    const totalSupply = (await kodaTokenContract.totalSupply()) as BigNumber
    const burnedAmount = (await kodaTokenContract.balanceOf(DEAD_ADDRESS)) as BigNumber
    const stakedAmount = (await kodaTokenContract.balanceOf(STAKING_ADDRESS)) as BigNumber
    const stakingPoolAmount = (await kodaTokenContract.balanceOf(STAKING_POOL_ADDRESS)) as BigNumber

    const circulatingSupply = totalSupply.sub(burnedAmount).sub(stakedAmount).sub(stakingPoolAmount)

    setCirculatingAmount(Math.floor(Number(utils.formatUnits(circulatingSupply, kodaToken.decimals))).toString())
  }, [kodaToken, kodaTokenContract])

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
    if (!stakingContract || !kodaToken) {
      setApy('...')
      return
    }

    async function getReward(lockFor: number) {
      let stakedAmount = (await stakingContract!.depositedAmounts(lockFor)) as BigNumber

      if (+lockDuration === lockFor) {
        stakedAmount = stakedAmount.add(utils.parseUnits(amount || '0', kodaToken?.decimals))
      }

      const reward = stakedAmount.mul(APY[lockFor]).div(100)

      return reward
    }

    try {
      const _0MonthsRewards = await getReward(0)
      const _3MonthsRewards = await getReward(7889229)
      const _6MonthsRewards = await getReward(15778458)
      const _1YearRewards = await getReward(31556916)

      let totalRewards = _0MonthsRewards.add(_3MonthsRewards).add(_6MonthsRewards).add(_1YearRewards)

      totalRewards = totalRewards.gt(maximumKodaReward) ? maximumKodaReward : totalRewards

      const myRating = currentRatingScore.add(ratingScoreGained)
      const totalRating = ratingScoreGained.add(await stakingContract.totalRating())

      const willEarn = totalRewards.mul(myRating).div(totalRating)

      const myStakedAmount = utils
        .parseUnits(amount || '0', kodaToken.decimals)
        .add(await stakingContract.accounts(account ?? DEAD_ADDRESS).then((o) => o.totalDepositAmount)) as BigNumber

      const calculatedApy =
        (+utils.formatUnits(willEarn, kodaToken.decimals) / +utils.formatUnits(myStakedAmount, kodaToken.decimals)) *
        100

      setApy(calculatedApy.toFixed(2))
    } catch (err) {
      console.warn(err)
      setApy('...')
    }
  }, [account, amount, currentRatingScore, lockDuration, ratingScoreGained, stakingContract, kodaToken])

  useEffect(() => {
    fetchApy()
  }, [fetchApy])

  const fetchStakedAmounts = useCallback(async () => {
    if (!stakingContract || !kodaToken) {
      setNoLockingStakedAmount('...')
      setThreeMonthsStakedAmount('...')
      setSixMonthsStakedAmount('...')
      setYearStakedAmount('...')
      return
    }

    const fetchedNoLockingStakedAmount = (await stakingContract.depositedAmounts(0)) as BigNumber
    setNoLockingStakedAmount(utils.formatUnits(fetchedNoLockingStakedAmount, kodaToken.decimals))

    const fetchedThreeMonthsStakedAmount = (await stakingContract.depositedAmounts(7889229)) as BigNumber
    setThreeMonthsStakedAmount(utils.formatUnits(fetchedThreeMonthsStakedAmount, kodaToken.decimals))

    const fetchedSixMonthsStakedAmount = (await stakingContract.depositedAmounts(15778458)) as BigNumber
    setSixMonthsStakedAmount(utils.formatUnits(fetchedSixMonthsStakedAmount, kodaToken.decimals))

    const fetchedYearStakedAmount = (await stakingContract.depositedAmounts(31556916)) as BigNumber
    setYearStakedAmount(utils.formatUnits(fetchedYearStakedAmount, kodaToken.decimals))
  }, [stakingContract, kodaToken])

  useEffect(() => {
    fetchStakedAmounts()
  }, [fetchStakedAmounts])

  useEffect(() => {
    if (!amount || !kodaToken || !stakingTokenBalance) {
      return
    }
    if (utils.parseUnits(amount, kodaToken.decimals).lte(BigNumber.from(0))) {
      setIsAmountValid(false)
      setAmountError('Please input a positive amount')
    } else if (utils.parseUnits(amount, kodaToken.decimals).gt(stakingTokenBalance)) {
      setIsAmountValid(false)
      setAmountError("You don't have enough tokens")
    } else {
      setIsAmountValid(true)
    }
  }, [amount, kodaToken, stakingTokenBalance])

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
        setCurrentRatingScore(BigNumber.from(0))
        return
      }

      setIsLoading(true)
      const fetchedRatingScore = (await stakingContract.accounts(account).then((o) => o.rating)) as BigNumber
      setIsLoading(false)

      setCurrentRatingScore(fetchedRatingScore)
    }

    fetchCurrentRatingScore()
  }, [stakingContract, account])

  useEffect(() => {
    async function fetchRatingScoreGained() {
      if (!amount || !stakingContract || !kodaToken || !kodaToken) {
        setRatingScoreGained(BigNumber.from(0))
        return
      }

      setIsLoading(true)
      const K = (await stakingContract.apys(KODA.address, lockDuration)) as BigNumber
      setIsLoading(false)

      setRatingScoreGained(utils.parseUnits(amount, kodaToken.decimals).mul(K))
    }

    fetchRatingScoreGained()
  }, [amount, lockDuration, stakingContract, kodaToken])

  const deposit = useCallback(async () => {
    if (!account || !lockDuration || !amount || !stakingContract || !kodaToken) {
      return
    }

    setIsLoading(true)
    try {
      const receipt = await stakingContract.putDeposit(utils.parseUnits(amount, kodaToken.decimals), lockDuration)
      await library.waitForTransaction(receipt.hash)
      fetchStakingTokenBalance()
      setCurrentRatingScore(currentRatingScore.add(ratingScoreGained))
      fetchStakedAmounts()
      fetchApy()
    } catch (err) {
      console.warn(err)
    }
    setIsLoading(false)
  }, [
    account,
    amount,
    currentRatingScore,
    fetchApy,
    fetchStakedAmounts,
    fetchStakingTokenBalance,
    library,
    lockDuration,
    ratingScoreGained,
    stakingContract,
    kodaToken,
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
    if (!stakingTokenBalance || !kodaToken) {
      return
    }

    setAmount(utils.formatUnits(stakingTokenBalance ?? BigNumber.from(0), kodaToken.decimals))
  }, [stakingTokenBalance, kodaToken])

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
          Balance: {utils.formatUnits(stakingTokenBalance ?? BigNumber.from(0), kodaToken?.decimals)}
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
          <b>{utils.formatUnits(currentRatingScore, kodaToken?.decimals)}</b>
        </p>
        <p>
          Gained rating score:&nbsp;
          <b>{utils.formatUnits(ratingScoreGained, kodaToken?.decimals)}</b>
        </p>
        <p>
          New rating score:&nbsp;
          <b>{utils.formatUnits(currentRatingScore.add(ratingScoreGained), kodaToken?.decimals)}</b>
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
