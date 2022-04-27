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
import NavBar from './Navbar'
import { DEAD_ADDRESS, MAX_UINT256, STAKING_ADDRESS, STAKING_POOL_ADDRESS } from '../../constants'
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

// TODO hide some stuff if not connected
export default function Deposit() {
  const { account, library } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [amount, setAmount] = useState('')
  const [lockDuration, setLockDuration] = useState('31556916')
  const [currentRatingScore, setCurrentRatingScore] = useState(BigNumber.from(0))
  const [ratingScoreGained, setRatingScoreGained] = useState(BigNumber.from(0))
  const [stakingTokenAddress, setStakingTokenAddress] = useState<string>()
  const [needsToApprove, setNeedsToApprove] = useState(true)
  const [isAmountValid, setIsAmountValid] = useState(false)
  const [amountError, setAmountError] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const stakingTokenContract = useTokenContract(stakingTokenAddress)
  const stakingToken = useToken(stakingTokenAddress)
  const [stakingTokenBalance, setStakingTokenBalance] = useState(BigNumber.from(0))
  // const stakingTokenBalance = useTokenBalanceBigNumber(account, stakingTokenContract)

  const [noLockingStakedAmount, setNoLockingStakedAmount] = useState('...')
  const [threeMonthsStakedAmount, setThreeMonthsStakedAmount] = useState('...')
  const [sixMonthsStakedAmount, setSixMonthsStakedAmount] = useState('...')
  const [yearStakedAmount, setYearStakedAmount] = useState('...')

  const [apy, setApy] = useState('...')
  const [circulatingAmount, setCirculatingAmount] = useState('...')

  const fetchCirculatingSupply = useCallback(async () => {
    if (!stakingTokenContract || !stakingToken) {
      setCirculatingAmount('...')
      return
    }

    const totalSupply = (await stakingTokenContract.totalSupply()) as BigNumber
    const burnedAmount = (await stakingTokenContract.balanceOf(DEAD_ADDRESS)) as BigNumber
    const stakedAmount = (await stakingTokenContract.balanceOf(STAKING_ADDRESS)) as BigNumber
    const stakingPoolAmount = (await stakingTokenContract.balanceOf(STAKING_POOL_ADDRESS)) as BigNumber

    const circulatingSupply = totalSupply.sub(burnedAmount).sub(stakedAmount).sub(stakingPoolAmount)

    setCirculatingAmount(utils.formatUnits(circulatingSupply, stakingToken.decimals))
  }, [stakingToken, stakingTokenContract])

  useEffect(() => {
    fetchCirculatingSupply()
  }, [fetchCirculatingSupply])

  const fetchStakingTokenBalance = useCallback(async () => {
    if (!account) return
    if (!stakingTokenContract) return

    const fetchedBalance = (await stakingTokenContract.balanceOf(account)) as BigNumber

    setStakingTokenBalance(fetchedBalance)
  }, [account, stakingTokenContract])

  useEffect(() => {
    fetchStakingTokenBalance()
  }, [fetchStakingTokenBalance])

  const fetchApy = useCallback(async () => {
    if (!stakingContract || !stakingToken) {
      setApy('...')
      return
    }

    const yearlyReward = utils.parseUnits(String(9 * 10 ** 9), 'gwei')
    const totalRating = (await stakingContract.totalRating()) as BigNumber
    const myRating = currentRatingScore.add(ratingScoreGained)
    const myYearlyReward = BigNumber.from(yearlyReward).mul(myRating).div(totalRating.add(myRating))
    let myStakedAmount = utils
      .parseUnits(amount || '0', stakingToken.decimals)
      .add(await stakingContract.accounts(account ?? DEAD_ADDRESS).then((o) => o.totalDepositAmount)) as BigNumber

    if (myStakedAmount.eq(BigNumber.from(0))) {
      myStakedAmount = utils.parseUnits('1', stakingToken.decimals)
    }

    setApy(myYearlyReward.mul(100).div(myStakedAmount).toString())
  }, [account, amount, currentRatingScore, ratingScoreGained, stakingContract, stakingToken])

  useEffect(() => {
    fetchApy()
  }, [fetchApy])

  const fetchStakedAmounts = useCallback(async () => {
    if (!stakingContract || !stakingToken) {
      setNoLockingStakedAmount('...')
      setThreeMonthsStakedAmount('...')
      setSixMonthsStakedAmount('...')
      setYearStakedAmount('...')
      return
    }

    const fetchedNoLockingStakedAmount = (await stakingContract.kCounter(0)) as BigNumber
    setNoLockingStakedAmount(utils.formatUnits(fetchedNoLockingStakedAmount, stakingToken.decimals))

    const fetchedThreeMonthsStakedAmount = (await stakingContract.kCounter(7889229)) as BigNumber
    setThreeMonthsStakedAmount(utils.formatUnits(fetchedThreeMonthsStakedAmount, stakingToken.decimals))

    const fetchedSixMonthsStakedAmount = (await stakingContract.kCounter(15778458)) as BigNumber
    setSixMonthsStakedAmount(utils.formatUnits(fetchedSixMonthsStakedAmount, stakingToken.decimals))

    const fetchedYearStakedAmount = (await stakingContract.kCounter(31556916)) as BigNumber
    setYearStakedAmount(utils.formatUnits(fetchedYearStakedAmount, stakingToken.decimals))
  }, [stakingContract, stakingToken])

  useEffect(() => {
    fetchStakedAmounts()
  }, [fetchStakedAmounts])

  useEffect(() => {
    if (!amount || !stakingToken || !stakingTokenBalance) {
      return
    }
    if (utils.parseUnits(amount, stakingToken.decimals).lte(BigNumber.from(0))) {
      setIsAmountValid(false)
      setAmountError('Please input a positive amount')
    } else if (utils.parseUnits(amount, stakingToken.decimals).gt(stakingTokenBalance)) {
      setIsAmountValid(false)
      setAmountError("You don't have enough tokens")
    } else {
      setIsAmountValid(true)
    }
  }, [amount, stakingToken, stakingTokenBalance])

  useEffect(() => {
    async function fetchAllowance() {
      if (!account || !amount || !stakingTokenContract || !stakingContract) {
        return
      }

      const allowance = (await stakingTokenContract.allowance(account, stakingContract.address)) as BigNumber

      setNeedsToApprove(allowance.lt(utils.parseUnits(amount, 'gwei')))
    }

    fetchAllowance()
  }, [account, amount, stakingTokenContract, stakingContract])

  useEffect(() => {
    async function fetchStakingTokenAddress() {
      if (!stakingContract) {
        setStakingTokenAddress(undefined)
        return
      }

      const fetchedStakingTokenAddress = (await stakingContract.stakingToken()) as string

      setStakingTokenAddress(fetchedStakingTokenAddress)
    }

    fetchStakingTokenAddress()
  }, [stakingContract])

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
      if (!amount || !stakingContract || !stakingToken) {
        setRatingScoreGained(BigNumber.from(0))
        return
      }

      setIsLoading(true)
      const K = (await stakingContract.k(+lockDuration)) as BigNumber
      const K_BASE = (await stakingContract.K_BASE()) as BigNumber
      setIsLoading(false)

      setRatingScoreGained(utils.parseUnits(amount, stakingToken.decimals).mul(K).div(K_BASE))
    }

    fetchRatingScoreGained()
  }, [amount, lockDuration, stakingContract, stakingToken])

  const deposit = useCallback(async () => {
    if (!account || !lockDuration || !amount || !stakingContract || !stakingToken) {
      return
    }

    setIsLoading(true)
    const receipt = await stakingContract.putDeposit(utils.parseUnits(amount, stakingToken.decimals), lockDuration)
    await library.waitForTransaction(receipt.hash)
    fetchStakingTokenBalance()
    setIsLoading(false)

    setCurrentRatingScore(currentRatingScore.add(ratingScoreGained))
    fetchStakedAmounts()
    fetchApy()
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
    stakingToken,
  ])

  const approve = useCallback(async () => {
    if (!account || !stakingTokenContract || !stakingContract) {
      return
    }

    setIsLoading(true)
    const receipt = await stakingTokenContract.approve(stakingContract.address, MAX_UINT256)
    await library.waitForTransaction(receipt.hash)
    setIsLoading(false)

    setNeedsToApprove(false)
  }, [account, stakingTokenContract, stakingContract, library])

  const onMax = useCallback(() => {
    if (!stakingTokenBalance || !stakingToken) {
      return
    }

    setAmount(utils.formatUnits(stakingTokenBalance ?? BigNumber.from(0), stakingToken.decimals))
  }, [stakingTokenBalance, stakingToken])

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
          <CurrencyLogo currency={stakingToken ?? undefined} size="24px" style={{ marginRight: '8px' }} />
          Balance: {utils.formatUnits(stakingTokenBalance ?? BigNumber.from(0), stakingToken?.decimals)}
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
          <b>{utils.formatUnits(currentRatingScore, stakingToken?.decimals)}</b>
        </p>
        <p>
          Gained rating score:&nbsp;
          <b>{utils.formatUnits(ratingScoreGained, stakingToken?.decimals)}</b>
        </p>
        <p>
          New rating score:&nbsp;
          <b>{utils.formatUnits(currentRatingScore.add(ratingScoreGained), stakingToken?.decimals)}</b>
        </p>

        <p>
          APY: <b>{apy}% + KAPEX BONUSES</b>
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
