import { Token } from '@koda-finance/summitswap-sdk'
import { Button, useModal } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { ONBOARDING_API } from '../../constants'
import SuccessModal from './SuccessModal'

interface Props {
  token: Token | undefined
  isTokensSentToReferral: boolean
  firstBuyPercentage: string | undefined
  referrerPercentage: string | undefined
  isReferralContractRemovedFromFees: boolean
  isLoading: boolean
  pairAddress: string | undefined
  fetchUserLocked: any
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

export default function Submit({
  token,
  isTokensSentToReferral,
  firstBuyPercentage,
  referrerPercentage,
  isReferralContractRemovedFromFees,
  isLoading,
  pairAddress,
  fetchUserLocked,
  setIsLoading,
}: Props) {
  const { account } = useWeb3React()

  const [displaySucessModal] = useModal(<SuccessModal title="Success" />)

  const submit = useCallback(() => {
    async function submitToken() {
      if (!firstBuyPercentage || !referrerPercentage || !token || !pairAddress || !account) {
        return
      }

      setIsLoading(true)
      const { fetchedLpLocks, totalAmountOfLpLocked } = await fetchUserLocked()

      await axios.post(ONBOARDING_API, {
        message: `
          Token: ${token.address}
          %0AUser: ${account}
          %0APair: ${pairAddress}
          %0ALockIds: ${fetchedLpLocks?.map((o) => o.lockId)}
          %0ATotalLocked: ${totalAmountOfLpLocked}
          %0AReferrer Fee: ${referrerPercentage}
          %0AFirst Buy Fee: ${firstBuyPercentage}`,
      })
      setIsLoading(false)

      displaySucessModal()
    }

    submitToken()
  }, [
    firstBuyPercentage,
    referrerPercentage,
    token,
    pairAddress,
    account,
    setIsLoading,
    fetchUserLocked,
    displaySucessModal,
  ])

  return (
    <>
      {token && account && (
        <Button
          disabled={
            !isTokensSentToReferral ||
            !firstBuyPercentage ||
            !referrerPercentage ||
            !isReferralContractRemovedFromFees ||
            isLoading ||
            +(firstBuyPercentage ?? '') <= 0 ||
            +(referrerPercentage ?? '') <= 0
          }
          onClick={submit}
        >
          Submit
        </Button>
      )}
    </>
  )
}
