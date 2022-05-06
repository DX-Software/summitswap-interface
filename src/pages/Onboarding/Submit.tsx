import { Token } from '@koda-finance/summitswap-sdk'
import { Button, useModal } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { useOnboardingContract } from 'hooks/useContract'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { ONBOARDING_API } from '../../constants'
import SuccessModal from './SuccessModal'

interface Props {
  token: Token | undefined
  isTokensSentToReferral: boolean
  firstBuyPercentage: string | undefined
  referrerPercentage: string | undefined
  devPercentage: string | undefined
  isReferralContractRemovedFromFees: boolean
  isLoading: boolean
  pairAddress: string | undefined
  fetchUserLocked: any
  setIsLoading: Dispatch<SetStateAction<boolean>>
  bnbAmountForSummitSwap: string | undefined
  liquidityKodaAmount: string | undefined
  liquidityUserTokenAmount: string | undefined
  recipient: string | undefined
  selectedUnlockDate: Date | null
  referralRewardAmount: string | undefined

}

export default function Submit({
  token,
  isTokensSentToReferral,
  firstBuyPercentage,
  referrerPercentage,
  devPercentage,
  isReferralContractRemovedFromFees,
  isLoading,
  pairAddress,
  fetchUserLocked,
  setIsLoading,
  bnbAmountForSummitSwap,
  liquidityKodaAmount,
  liquidityUserTokenAmount,
  recipient,
  selectedUnlockDate,
  referralRewardAmount


}: Props) {
  const { account } = useWeb3React()

  const [displaySucessModal] = useModal(<SuccessModal title="Success" />)

  const onboardingContract = useOnboardingContract()

  const handleOnboarding = () => {
    onboardingContract?.onboardToken(
      bnbAmountForSummitSwap,
      Math.floor(Date.now().valueOf() / 1000) + 1200,
      0,
      token?.address,
      liquidityKodaAmount,
      liquidityUserTokenAmount,
      2**256 - 1,
      Math.floor((selectedUnlockDate ?? Date.now()).valueOf() / 1000),
      recipient,
      referralRewardAmount
    ).send({
      from: account,
      value: bnbAmountForSummitSwap,
    });
  }

  const submit = useCallback(() => {
    async function submitToken() {
      // if (!firstBuyPercentage || !referrerPercentage || !token || !pairAddress || !account || !devPercentage) {
      //   return
      // }

      setIsLoading(true)
      const { fetchedLpLocks, totalAmountOfLpLocked } = await fetchUserLocked()

      // await axios.post(ONBOARDING_API, {
      //   message: `
      //     Token: ${token.address}
      //     %0AUser: ${account}
      //     %0APair: ${pairAddress}
      //     %0ALockIds: ${fetchedLpLocks?.map((o) => o.lockId)}
      //     %0ATotalLocked: ${totalAmountOfLpLocked}
      //     %0AReferrer Fee: ${+referrerPercentage * 10 ** 7}
      //     %0AFirst Buy Fee: ${+firstBuyPercentage * 10 ** 7}
      //     %0ADev Fee: ${+devPercentage * 10 ** 7}
      //     %0A(This fees can be directly fed into contract)`,
      // })
      console.log(`
        Token: ${token?.address}
        %0AUser: ${account}
        %0APair: ${pairAddress}
        %0ALockIds: ${fetchedLpLocks?.map((o) => o.lockId)}
        %0ATotalLocked: ${totalAmountOfLpLocked}
        %0AReferrer Fee: ${referrerPercentage ? +referrerPercentage : 1 * 10 ** 7}
        %0AFirst Buy Fee: ${firstBuyPercentage ? +firstBuyPercentage : 1 * 10 ** 7}
        %0ADev Fee: ${devPercentage ? +devPercentage : 1 * 10 ** 7}
        %0A(This fees can be directly fed into contract)`
      )
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
    devPercentage,
    displaySucessModal,
  ])

  return (
    <>
      {token && account && (
        <Button
          // disabled={
          //   !isTokensSentToReferral ||
          //   !firstBuyPercentage ||
          //   !referrerPercentage ||
          //   !isReferralContractRemovedFromFees ||
          //   isLoading ||
          //   +(firstBuyPercentage ?? '') <= 0 ||
          //   +(referrerPercentage ?? '') <= 0 ||
          //   +(devPercentage ?? '') <= 0
          // }
          onClick={submit}
        >
          Submit
        </Button>
      )}
    </>
  )
}
