import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { Token } from '@koda-finance/summitswap-sdk'
import { useModal } from '@koda-finance/summitswap-uikit'
import intervalToDuration from 'date-fns/intervalToDuration'
import { useWeb3React } from '@web3-react/core'
import { useLockerContract, usePairContract } from '../../hooks/useContract'
import { usePair, PairState } from '../../data/Reserves'
import { useCurrency } from '../../hooks/Tokens'
import LockedPoolCard from '../../components/LockedPoolCard'
import CustomLightSpinner from '../../components/CustomLightSpinner'
import Modal from './SuccessModal'

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
  const [isLockPairsFetched, setIsLockPairsFetched] = useState(false)

  const [displaySucessModal] = useModal(<Modal text="Withdrawal was Successful" title="Success" />)
  const [displayFailureModal] = useModal(<Modal text="Withdrawal was not Successful" title="Failed" />)

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
      setIsLockPairsFetched(true)
    }
    if (token && pairAddress) {
      fetch()
    }
  }, [fetchUserLocked, token, pairAddress])

  const withdrawLiquidity = useCallback(
    (lockId, owner) => {
      async function withdraw() {
        if (!lockerContract || !pairContract || !library || !(account === owner)) {
          return
        }
        try {
          const receipt = await lockerContract.withdraw(lockId)
          setIsLoading(true)
          await library.waitForTransaction(receipt.hash)

          const { fetchedLpLocks } = await fetchUserLocked()
          setLocks(fetchedLpLocks)
          setIsLoading(false)
          displaySucessModal()
        } catch (err) {
          setIsLoading(false)
          displayFailureModal()
        }
      }
      withdraw()
    },
    [
      lockerContract,
      pairContract,
      library,
      account,
      setIsLoading,
      fetchUserLocked,
      displaySucessModal,
      displayFailureModal,
    ]
  )

  const timeLeftToUnLock = useCallback((date: Date) => {
    const { years, months, days, hours, minutes } = intervalToDuration({
      start: new Date(),
      end: date,
    })
    const monthWithYears = years ? Number(months) + years * 12 : months
    return { monthWithYears, days, hours, minutes }
  }, [])

  return account && token ? (
    locks && pair ? (
      locks.map((lk) => {
        const { lock, lockId } = lk
        return (
          <LockedPoolCard
            timeLeftToUnLock={timeLeftToUnLock}
            withdrawLiquidity={withdrawLiquidity}
            lock={lock}
            isLoading={isLoading}
            lockId={lockId}
            pair={pair}
          />
        )
      })
    ) : (
      (!isLockPairsFetched || !(pairState === PairState.EXISTS)) && (
        <CustomLightSpinner src="/images/blue-loader.svg" size="50px" />
      )
    )
  ) : (
    <></>
  )
}