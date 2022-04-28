/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Text, useModal } from '@koda-finance/summitswap-uikit'
import AppBody from 'pages/AppBody'
import { useWeb3React } from '@web3-react/core'
import { useStakingContract } from 'hooks/useContract'
import { BigNumber, utils } from 'ethers'
import { format } from 'date-fns'
import CurrencyLogo from 'components/CurrencyLogo'
import { useToken } from 'hooks/Tokens'
import CustomLightSpinner from 'components/CustomLightSpinner'
import NavBar from './Navbar'
import { Deposit } from './types'

const DepositContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${(props) => props.theme.colors.card};
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
`

const TokenInfo = styled.div`
  display: inline-flex;
  align-items: center;
`

export default function Withdraw() {
  const { account, library } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [stakingTokenAddress, setStakingTokenAddress] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [userDeposits, setUserDeposits] = useState<Deposit[]>()

  const premiumToken = useToken(stakingTokenAddress)

  const [selectedDeposit, setSelectedDeposit] = useState<Deposit>()
  const [penalty, setPenalty] = useState(0)

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

  const fetchUserDeposits = useCallback(async () => {
    if (!stakingContract || !account) {
      setUserDeposits([])
      return
    }

    setIsLoading(true)

    const userDepositIds = (await stakingContract.getUserDepositIds(account)) as BigNumber[]
    const deposits = (await Promise.all(
      userDepositIds.map(async (depositId) => {
        const fetchedDeposit = await stakingContract.deposits(depositId)

        return {
          id: +depositId,
          penalty:
            (fetchedDeposit.depositAt + fetchedDeposit.lockFor) * 1000 > Date.now()
              ? +(await stakingContract.penalties(fetchedDeposit.lockFor))
              : 0,
          ...fetchedDeposit,
        }
      })
    )) as Deposit[]

    setIsLoading(false)

    setUserDeposits(deposits)
  }, [account, stakingContract])

  const withdraw = useCallback(
    async (deposit: Deposit) => {
      if (!stakingContract || !library) {
        return
      }

      setIsLoading(true)
      try {
        const receipt = await stakingContract.withdrawDeposit(deposit.id, deposit.amount)
        await library.waitForTransaction(receipt.hash)
      } catch (err) {
        console.warn(err)
      }
      setIsLoading(false)

      fetchUserDeposits()
    },
    [stakingContract, library, fetchUserDeposits]
  )

  useEffect(() => {
    fetchUserDeposits()
  }, [fetchUserDeposits])

  return (
    <AppBody>
      <br />
      <NavBar activeIndex={2} />
      {!userDeposits && <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="45px" />}
      {userDeposits?.length === 0 && <p>You dont have any deposits</p>}
      {userDeposits && userDeposits.length > 0 && (
        <>
          <p>Deposits</p>
          <div>
            {userDeposits?.map((deposit) => (
              <DepositContainer key={deposit.id}>
                <p>
                  Amount:&nbsp;
                  <b>
                    {utils.formatUnits(deposit.amount, premiumToken?.decimals)}&nbsp;
                    <TokenInfo>
                      KODA&nbsp;
                      <CurrencyLogo currency={premiumToken ?? undefined} size="24px" />
                    </TokenInfo>
                  </b>
                </p>
                {!!Number(deposit.lockFor) && (
                  <p>
                    Unlocks at:&nbsp;
                    <b>{format(new Date((deposit.depositAt + deposit.lockFor) * 1000), 'dd/MM/yyyy')}</b>
                  </p>
                )}
                <p>
                  Deposited at:&nbsp;
                  <b>{format(new Date(deposit.depositAt * 1000), 'dd/MM/yyyy HH:mm')}</b>
                </p>
                {deposit.penalty !== 0 && (
                  <Text color="red">
                    If you claim early, you will lose <b> {deposit.penalty / 100}%</b> of you tokens
                  </Text>
                )}
                <Button disabled={isLoading} onClick={() => withdraw(deposit)}>
                  WITHDRAW
                </Button>
              </DepositContainer>
            ))}
          </div>
        </>
      )}
    </AppBody>
  )
}
