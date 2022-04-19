/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Radio, Input, Progress, Button, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useStakingContract } from 'hooks/useContract'
import { BigNumber, utils } from 'ethers'
import './styles.css'
import { useTokenBalance } from 'state/wallet/hooks'
import { useToken } from 'hooks/Tokens'
import NavBar from './Navbar'

const RadioContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 30px;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

export default function Deposit() {
  const { account } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [amount, setAmount] = useState<number>()
  const [lockDuration, setLockDuration] = useState<string>('31556916')
  const [currentRatingScore, setCurrentRatingScore] = useState<string>('0')
  const [ratingScoreGained, setRatingScoreGained] = useState<number>(0)
  const [stakingTokenAddress, setStakingTokenAddress] = useState<string>()
  // const tokenAmount = useTokenBalance(account ?? undefined, stakingToken ?? undefined)
  
  const stakingToken = useToken(stakingTokenAddress)
  const [stakingTokenBalance, setStakingTokenBalance] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    async function fetchStakingTokenAddress() {
      if (!stakingContract) {
        setStakingTokenAddress(undefined)
        return
      }

      const fetchedStakingTokenAddress = await stakingContract.stakingToken() as string

      setStakingTokenAddress(fetchedStakingTokenAddress)
    }

    fetchStakingTokenAddress()
  }, [stakingContract])

  useEffect(() => {
    async function fetchCurrentRatingScore() {
      if (!stakingContract || !account) {
        setCurrentRatingScore('0')
        return
      }

      const fetchedRatingScore = (await stakingContract
        .accounts(account)
        .then((o) => o.rating)
        .then((o) => o.toString())) as string

      setCurrentRatingScore(fetchedRatingScore)
    }

    fetchCurrentRatingScore()
  }, [stakingContract, account])

  useEffect(() => {
    async function fetchRatingScoreGained() {
      if (!amount || !stakingContract) {
        setRatingScoreGained(0)
        return
      }

      const K = +utils.formatEther(await stakingContract.calculateK(+lockDuration))

      setRatingScoreGained((amount ?? 0) * K)
    }

    fetchRatingScoreGained()
  }, [amount, lockDuration, stakingContract])

  const deposit = useCallback(async () => {
    if (!account || !lockDuration || !amount) {
      return
    }

    console.log('a')
  }, [account, amount, lockDuration])

  return (
    <div className="main-content">
      <NavBar activeIndex={0} />

      <p>Amount</p>
      <Input placeholder="0.00" onChange={(o) => setAmount(+o.target.value)} />

      <RadioContainer onChange={(o: React.ChangeEvent<HTMLInputElement>) => setLockDuration(o.target.value)}>
        <label>
          <Radio id="name" name="locking-duration" value="0" checked={lockDuration === '0'} /> No locking
        </label>
        <label>
          <Radio id="name" name="locking-duration" value="7889229" checked={lockDuration === '7889229'} /> 3 Months
        </label>
        <label>
          <Radio id="name" name="locking-duration" value="15778458" checked={lockDuration === '15778458'} /> 6 Months
        </label>
        <label>
          <Radio id="name" name="locking-duration" value="31556916" checked={lockDuration === '31556916'} /> 12 Months
        </label>
      </RadioContainer>

      <InfoContainer>
        <p>Your current rating score: {currentRatingScore}</p>
        <p>Gained rating score: {ratingScoreGained}</p>
        <p>New rating score after deposit: {+currentRatingScore + ratingScoreGained}</p>

        <p>APY: 0-100%</p>

        <Button disabled={!amount || !lockDuration} onClick={deposit}>
          DEPOSIT
        </Button>
        {!amount && <Text color="red">Please enter positive amount</Text>}
        {!lockDuration && <Text color="red">Please select locking period</Text>}
      </InfoContainer>
    </div>
  )
}
