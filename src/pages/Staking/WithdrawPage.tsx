import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Text } from '@koda-finance/summitswap-uikit'
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
import { KODA } from '../../constants'
import PenaltyWithdrawModal from './PenaltyWithdrawModal'

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

export default function WithdrawPage() {
  const { account, library } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [isLoading, setIsLoading] = useState(false)
  const [userDeposits, setUserDeposits] = useState<Deposit[]>()

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [depositSelected, setDepositSelected] = useState<Deposit>()

  const kodaToken = useToken(KODA.address)
  const [status, setStatus] = useState<BigNumber>()

  useEffect(() => {
    async function fetchStatus() {
      setStatus(undefined)

      if (!stakingContract || !account) {
        setStatus(BigNumber.from(0))
        return
      }

      setIsLoading(true)

      const fetchedStatus = (await stakingContract.statuses(account)) as BigNumber
      setStatus(fetchedStatus)

      setIsLoading(false)
    }

    fetchStatus()
  }, [account, stakingContract])

  const fetchUserDeposits = useCallback(async () => {
    setUserDeposits(undefined)

    if (!stakingContract || !account) {
      setUserDeposits([])
      return
    }

    setIsLoading(true)

    const userDepositIds = (await stakingContract.getUserDepositIds(account)) as BigNumber[]
    const deposits = (await Promise.all(
      userDepositIds.map(async (depositId) => {
        const fetchedDeposit = await stakingContract.deposits(depositId)

        const deposit = {
          ...fetchedDeposit,
          id: +depositId,
          penalty:
            (fetchedDeposit.depositAt + fetchedDeposit.lockFor) * 1000 > Date.now()
              ? +(await stakingContract.penalties(fetchedDeposit.lockFor))
              : 0,
        }

        setUserDeposits((prevDeposits) => [...(prevDeposits ?? []), deposit])
        return deposit
      })
    )) as Deposit[]

    const depositsWithBonuses = await Promise.all(
      deposits.map(async (deposit) => {
        if (!deposit.isWithdrawable) {
          return deposit
        }

        const fakeDepositId = (await stakingContract.correspondingFakeDepositId(deposit.id)) as BigNumber
        const fakeDeposit = deposits.find((d) => d.id === +fakeDepositId) as Deposit | undefined

        if (!fakeDeposit || fakeDeposit?.id === 0) {
          return deposit
        }

        return {
          ...deposit,
          bonus: fakeDeposit.amount,
        }
      })
    )

    setIsLoading(false)

    setUserDeposits(depositsWithBonuses)
  }, [account, stakingContract])

  const withdrawDirectly = useCallback(async () => {
    if (!stakingContract || !library || !depositSelected) {
      return
    }

    setIsLoading(true)
    setIsWarningModalOpen(false)
    try {
      const receipt = await stakingContract.withdrawDeposit(depositSelected.id, depositSelected.amount)
      await library.waitForTransaction(receipt.hash)
      fetchUserDeposits()
    } catch (err) {
      console.warn(err)
    }
    setIsLoading(false)
  }, [depositSelected, fetchUserDeposits, library, stakingContract])

  const withdraw = useCallback(
    async (deposit: Deposit) => {
      if (!stakingContract || !library) {
        return
      }

      setDepositSelected(deposit)

      if (deposit.penalty || deposit.bonus) {
        setIsWarningModalOpen(true)
        return
      }

      setIsLoading(true)
      try {
        const receipt = await stakingContract.withdrawDeposit(deposit.id, deposit.amount)
        await library.waitForTransaction(receipt.hash)
        fetchUserDeposits()
      } catch (err) {
        console.warn(err)
      }
      setIsLoading(false)
    },
    [stakingContract, library, fetchUserDeposits]
  )

  useEffect(() => {
    fetchUserDeposits()
  }, [fetchUserDeposits])

  return (
    <AppBody>
      <PenaltyWithdrawModal
        open={isWarningModalOpen}
        deposit={depositSelected}
        status={status}
        handleClose={() => setIsWarningModalOpen(false)}
        onConfirm={withdrawDirectly}
      />
      <br />
      <NavBar activeIndex={2} />
      {!isLoading && userDeposits?.length === 0 && <p>You dont have any deposits</p>}
      {userDeposits && userDeposits.length > 0 && (
        <>
          <p>Deposits</p>
          <div>
            {userDeposits
              ?.filter((o) => o.isWithdrawable)
              .sort((a, b) => b.depositAt - a.depositAt)
              .map((deposit) => (
                <DepositContainer key={deposit.id}>
                  <p>
                    Amount:&nbsp;
                    <b>
                      {utils.formatUnits(deposit.amount, KODA.decimals)}&nbsp;
                      <TokenInfo>
                        KODA&nbsp;
                        <CurrencyLogo currency={kodaToken ?? undefined} size="24px" />
                      </TokenInfo>
                    </b>
                  </p>
                  {deposit.bonus && (
                    <p>
                      Bonus:&nbsp;
                      <b>
                        {utils.formatUnits(deposit.bonus, KODA.decimals)}&nbsp;
                        <TokenInfo>
                          KODA&nbsp;
                          <CurrencyLogo currency={kodaToken ?? undefined} size="24px" />
                        </TokenInfo>
                      </b>
                    </p>
                  )}
                  {deposit.isWithdrawable && (
                    <>
                      {!!Number(deposit.lockFor) && (
                        <p>
                          Unlocks at:&nbsp;
                          <b>{format(new Date((deposit.depositAt + deposit.lockFor) * 1000), 'dd/MM/yyyy HH:mm')}</b>
                        </p>
                      )}
                      <p>
                        Deposited at:&nbsp;
                        <b>{format(new Date(deposit.depositAt * 1000), 'dd/MM/yyyy HH:mm')}</b>
                      </p>
                      {deposit.penalty !== 0 && (
                        <Text color="red">
                          If you withdraw early, you will lose <b> {deposit.penalty / 100}%</b> of you tokens
                        </Text>
                      )}
                      <Button disabled={isLoading} onClick={() => withdraw(deposit)}>
                        WITHDRAW
                      </Button>
                    </>
                  )}
                </DepositContainer>
              ))}
          </div>
        </>
      )}
      {!userDeposits && <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="45px" />}
    </AppBody>
  )
}
