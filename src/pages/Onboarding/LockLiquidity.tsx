import { Token } from '@koda-finance/summitswap-sdk'
import { DatePicker } from '@mui/lab'
import { useWeb3React } from '@web3-react/core'
import { addYears, subDays } from 'date-fns'
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { TextField } from '@mui/material'
import { Button, Text } from '@koda-finance/summitswap-uikit'
import { useLockerContract, useTokenContract } from 'hooks/useContract'
import { BigNumber } from 'ethers'
import { MAX_UINT256 } from '../../constants'

interface Props {
  token: Token | undefined
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  isEnoughLiquidity: boolean
  setIsLiquidityLocked: Dispatch<SetStateAction<boolean>>
  pairAddress: string | undefined
}

const minimumUnlockDate = subDays(addYears(Date.now(), 1), 1)

export default function LockLiquidity({
  isLoading,
  token,
  setIsLoading,
  isEnoughLiquidity,
  setIsLiquidityLocked,
  pairAddress,
}: Props) {
  const { account, library } = useWeb3React()

  const [isLiquidityApproved, setIsLiquidityApproved] = useState(false)
  const [selectedUnlockDate, setSelectedUnlockDate] = useState<Date | null>(addYears(Date.now(), 1))
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
      if (!lpContract || !account || !lockerContract || !library || !selectedUnlockDate) {
        setIsLiquidityLocked(false)
        return
      }

      const receipt = await lockerContract.lockTokens(
        lpContract.address,
        lpBalance,
        Math.floor(selectedUnlockDate.valueOf() / 1000),
        account,
        '2' // Fee type
      )

      setIsLoading(true)
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)

      setIsLiquidityLocked(true)
    }

    lock()
  }, [lpContract, account, lockerContract, library, selectedUnlockDate, lpBalance, setIsLoading, setIsLiquidityLocked])

  return (
    <article>
      <p>Lock your liquidity for minimum 1 year</p>
      {token && account && (
        <>
          <DatePicker
            label="Unlock date"
            disabled={!isEnoughLiquidity || isLoading}
            value={selectedUnlockDate}
            onChange={(newValue: Date | null) => {
              setSelectedUnlockDate(newValue)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          &nbsp;
          {!isLiquidityApproved && (
            <>
              <Button disabled={!isEnoughLiquidity || isLoading} onClick={approveLiquidity}>
                Approve Liquidity
              </Button>
              &nbsp;
            </>
          )}
          <Button
            disabled={
              !isEnoughLiquidity ||
              !isLiquidityApproved ||
              !isSelectedDateGood ||
              isLoading ||
              (lpBalance?.isZero() ?? true)
            }
            onClick={lockLiquidity}
          >
            Lock Liquidity
          </Button>
          <p>
            {(lpBalance?.isZero() ?? true) && isEnoughLiquidity && <Text color="red">You don&apos;t have enough liquidity tokens</Text>}
            {!isSelectedDateGood && <Text color="red">Please select unlock date minimum 1 year from now</Text>}
          </p>
        </>
      )}
    </article>
  )
}
