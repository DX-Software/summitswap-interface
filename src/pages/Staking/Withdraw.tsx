/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Radio, Input, Progress, Button } from '@koda-finance/summitswap-uikit'
import AppBody from 'pages/AppBody'
import { useWeb3React } from '@web3-react/core'
import { useStakingContract } from 'hooks/useContract'
import { BigNumber } from 'ethers'
import { format } from 'date-fns'
import NavBar from './Navbar'

interface Deposit {
  id: number
  user: string
  depositAt: BigNumber
  lockFor: BigNumber
  amount: BigNumber
}

const Deposit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${(props) => props.theme.colors.card};
  border-radius: 10px;
  padding: 10px;
`

const DepositsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  gap: 20px;
`

export default function Withdraw() {
  const { account, library } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [premiumTokenAddress, setPremiumTokenAddress] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [pendingReward, setPendingReward] = useState(BigNumber.from(0))

  const [userDeposits, setUserDeposits] = useState<Deposit[]>([])

  const withdraw = useCallback(
    (deposit: Deposit) => {
      if (!stakingContract) {
        return
      }

      stakingContract.withdrawDeposit(deposit.id, deposit.amount)
    },
    [stakingContract]
  )

  useEffect(() => {
    async function fetchUserDeposits() {
      if (!stakingContract || !account) {
        setUserDeposits([])
        return
      }

      setIsLoading(true)

      const userDepositIds = (await stakingContract.getUserDepositIds(account)) as BigNumber[]
      const deposits = (await Promise.all(
        userDepositIds.map(async (depositId) => ({
          id: +depositId,
          ...(await stakingContract.deposits(depositId)),
        }))
      )) as Deposit[]

      setIsLoading(false)

      setUserDeposits(deposits)
    }

    fetchUserDeposits()
  }, [account, stakingContract])

  return (
    <AppBody>
      <br />
      <NavBar activeIndex={2} />
      <p>Your deposits:</p>
      <DepositsContainer>
        {userDeposits.map((deposit) => (
          <Deposit key={deposit.id}>
            <p>Amount: {deposit.amount.toString()}</p>
            {/* {!!Number(deposit.lockFor) && ( */}
              <p>Lock unlocks on: {format(new Date(+deposit.lockFor / 1000), 'dd/MM/yyyy HH:mm')}</p>
            {/* )} */}
            <p>Deposited at: {deposit.depositAt.toString()}</p>

            <Button disabled={isLoading || +deposit.lockFor / 1000 > Date.now()} onClick={() => withdraw(deposit)}>
              WITHDRAW
            </Button>
          </Deposit>
        ))}
      </DepositsContainer>
    </AppBody>
  )
}
