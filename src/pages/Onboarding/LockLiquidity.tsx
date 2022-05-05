import { Token } from '@koda-finance/summitswap-sdk'
import { DatePicker } from '@mui/lab'
import { useWeb3React } from '@web3-react/core'
import { addYears, subDays } from 'date-fns'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { TextField } from '@mui/material'
import { Button, Text, Input } from '@koda-finance/summitswap-uikit'
import { useLockerContract, useTokenContract } from 'hooks/useContract'
import { BigNumber, ethers } from 'ethers'
import { LOCKER_ADDRESS, MAX_UINT256 } from '../../constants'

interface Props {
  token: Token | undefined
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  isEnoughLiquidity: boolean
  setIsLiquidityLocked: Dispatch<SetStateAction<boolean>>
  pairAddress: string | undefined
  selectedUnlockDate: Date | null
  setSelectedUnlockDate: Dispatch<SetStateAction<Date | null>>
}

const minimumUnlockDate = subDays(addYears(Date.now(), 1), 1)

export default function LockLiquidity({
  isLoading,
  token,
  setIsLoading,
  isEnoughLiquidity,
  setIsLiquidityLocked,
  pairAddress,
  selectedUnlockDate,
  setSelectedUnlockDate
}: Props) {
  const { account, library } = useWeb3React()

  const [recipient, setRecipient] = useState('')

  const [isLiquidityApproved, setIsLiquidityApproved] = useState(false)
  const [lpBalance, setLpBalance] = useState<BigNumber | undefined>()

  const lpContract = useTokenContract(pairAddress)
  const lockerContract = useLockerContract(true)

  const isSelectedDateGood = useMemo(() => {
    if (!selectedUnlockDate) return false

    return selectedUnlockDate > minimumUnlockDate
  }, [selectedUnlockDate])

  const approveLiquidity = useCallback(() => {
    async function approve() {
      if (!lpContract || !account || !lockerContract || !library) {
        setIsLiquidityApproved(false)
        return
      }

      const receipt = await lpContract.approve(lockerContract.address, MAX_UINT256)

      setIsLoading(true)
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)

      setIsLiquidityApproved(true)
    }

    approve()
  }, [lpContract, account, lockerContract, library, setIsLoading])

  const lockLiquidity = useCallback(() => {
    async function lock() {
      if (!lpContract || !recipient || !lockerContract || !library || !selectedUnlockDate) {
        setIsLiquidityLocked(false)
        return
      }

      const receipt = await lockerContract.lockTokens(
        lpContract.address,
        lpBalance,
        Math.floor(selectedUnlockDate.valueOf() / 1000),
        recipient,
        '2' // Fee type
      )

      setIsLoading(true)
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)

      setIsLiquidityLocked(true)
    }

    lock()
  }, [
    lpContract,
    lockerContract,
    library,
    selectedUnlockDate,
    lpBalance,
    recipient,
    setIsLoading,
    setIsLiquidityLocked,
  ])

  useEffect(() => {
    async function fetchLpBalance() {
      if (!account || !lpContract) {
        setLpBalance(undefined)
        return
      }

      const fetchedLpBalance = (await lpContract.balanceOf(account)) as BigNumber
      setLpBalance(fetchedLpBalance)
    }

    fetchLpBalance()
  }, [account, lpContract])

  useEffect(() => {
    async function fetchUserApproved() {
      if (!lpContract || !account) return

      const userBalance = (await lpContract.balanceOf(account)) as BigNumber

      const userApprovedAlready = (await lpContract.allowance(account, LOCKER_ADDRESS)) as BigNumber

      setIsLiquidityApproved(userApprovedAlready.gte(userBalance))
    }

    fetchUserApproved()
  }, [account, lpContract])

  return (
    <article>
      <p>Lock liquidity for minimum 1 year</p>

      {token && account && (
        <p>
          <Input
            disabled={!isEnoughLiquidity || !isLiquidityApproved || isLoading || (lpBalance?.isZero() ?? true)}
            type="text"
            placeholder="Recipient"
            onChange={(o) => setRecipient(o.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <DatePicker
            label="Unlock date"
            disabled={
              !isEnoughLiquidity ||
              !isLiquidityApproved ||
              isLoading ||
              (lpBalance?.isZero() ?? true) ||
              !ethers.utils.isAddress(recipient)
            }
            value={selectedUnlockDate}
            onChange={(newValue: Date | null) => {
              setSelectedUnlockDate(newValue)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          &nbsp;
          <p>
            {(lpBalance?.isZero() ?? true) && isEnoughLiquidity && (
              <Text color="red">You don&apos;t have enough liquidity tokens</Text>
            )}
            {!isSelectedDateGood && <Text color="red">Please select unlock date minimum 1 year from now</Text>}
            {!ethers.utils.isAddress(recipient) && <Text color="red">Please use valid recipient</Text>}
          </p>
        </p>
      )}
    </article>
  )
}
