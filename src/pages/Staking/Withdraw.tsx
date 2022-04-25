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
import CurrencyLogo from 'components/CurrencyLogo'
import { useToken } from 'hooks/Tokens'
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

const TokenInfo = styled.div`
  display: inline-flex;
  align-items: center;
`

const DepositsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  gap: 20px;
`

export default function Withdraw() {
  const { account, library } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [stakingTokenAddress, setStakingTokenAddress] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [userDeposits, setUserDeposits] = useState<Deposit[]>([])

  const premiumToken = useToken(stakingTokenAddress)

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
            <p>
              Amount:&nbsp;
              <b>
                {deposit.amount.toString()}&nbsp;
                <TokenInfo>
                  KODA&nbsp;
                  <CurrencyLogo currency={premiumToken ?? undefined} size="24px" />
                </TokenInfo>
              </b>
            </p>
            {!!Number(deposit.lockFor) && (
              <p>
                Unlocks at:&nbsp;
                <b>{format(new Date(+deposit.lockFor * 1000), 'dd/MM/yyyy HH:mm')}</b>
              </p>
            )}
            <p>
              Deposited at:&nbsp;
              <b>{format(new Date(+deposit.depositAt * 1000), 'dd/MM/yyyy HH:mm')}</b>
            </p>
            <Button disabled={isLoading || +deposit.lockFor / 1000 > Date.now()} onClick={() => withdraw(deposit)}>
              WITHDRAW
            </Button>
          </Deposit>
        ))}
      </DepositsContainer>
    </AppBody>
  )
}
