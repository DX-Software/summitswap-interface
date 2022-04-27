import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { Token } from '@koda-finance/summitswap-sdk'
import moment from 'moment'
import { useWeb3React } from '@web3-react/core'
import { useLockerContract, usePairContract } from '../../hooks/useContract'
import { usePair, PairState } from '../../data/Reserves'
import { useCurrency } from '../../hooks/Tokens'
import LockedPoolCard from '../../components/LockedPoolCard'
import Spinner from '../../components/CustomLightSpinner'

interface Props {
  token: Token | undefined
  isLoading: boolean
  pairAddress: string | undefined
  fetchUserLocked: any
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

// Token which have locked pairs with Koda(For testing)
const t2 = '0xDB80F77FcBC4AF4E45754Ce0D7C1533a6655b9E7'
const t3 = '0x0437B41fdE39a4C992f9646B0217b4D652A016d0'

export default function WithdrawLiquidity({ token, isLoading, setIsLoading, pairAddress, fetchUserLocked }: Props) {
  const { account, library } = useWeb3React()

  const [locks, setLocks] = useState<any>([])
  const [tokenAddress0, setTokenAddress0] = useState('')
  const [tokenAddress1, setTokenAddress1] = useState('')

  const pairContract = usePairContract(pairAddress)
  const lockerContract = useLockerContract(true)

  const currency0 = useCurrency(tokenAddress0)
  const currency1 = useCurrency(tokenAddress1)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)

  useEffect(() => {
    async function setTokensAddresses() {
      setTokenAddress0(await pairContract?.token0())
      setTokenAddress1(await pairContract?.token1())
    }
    if (pairContract) {
      setTokensAddresses()
    }
  }, [pairContract])

  useEffect(() => {
    async function fetch() {
      const { fetchedLpLocks } = await fetchUserLocked()
      setLocks(fetchedLpLocks)
    }
    if (token && pairAddress) {
      fetch()
    }
  }, [fetchUserLocked, token, pairAddress])

  const widthdarLiquidity = useCallback(
    (lockId, owner) => {
      async function widthdraw() {
        if (!lockerContract || !pairContract || !library || !(account === owner)) {
          return
        }
        const receipt = await lockerContract.withdraw(lockId)

        setIsLoading(true)
        await library.waitForTransaction(receipt.hash)
        setIsLoading(false)
      }
      widthdraw()
    },
    [lockerContract, pairContract, library, account, setIsLoading]
  )

  const timeLeft = useCallback((date: Date) => {
    const unlockMoment = moment(date)
    const presentMoment = moment()

    const months = unlockMoment.diff(presentMoment, 'months')
    presentMoment.add(months, 'months')
    const days = unlockMoment.diff(presentMoment, 'days')
    presentMoment.add(days, 'days')
    const hours = unlockMoment.diff(presentMoment, 'hours')
    presentMoment.add(hours, 'hours')
    const mins = unlockMoment.diff(presentMoment, 'minutes')

    return { months, days, hours, mins }
  }, [])

  return pairState === PairState.LOADING || pairState === PairState.EXISTS ? (
    locks && pair ? (
      locks.map((lk) => {
        const { lock, lockId } = lk
        return (
          <LockedPoolCard
            timeLeft={timeLeft}
            widthdarLiquidity={widthdarLiquidity}
            lock={lock}
            isLoading={isLoading}
            lockId={lockId}
            pair={pair}
          />
        )
      })
    ) : (
      <Spinner size="50px" />
    )
  ) : (
    <></>
  )
}
