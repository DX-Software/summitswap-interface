import { Token } from '@koda-finance/summitswap-sdk'
import { useWeb3React } from '@web3-react/core'
import React, { Dispatch, SetStateAction } from 'react'
import { Checkbox } from '@koda-finance/summitswap-uikit'
import { REFERRAL_ADDRESS } from '../../constants'

interface Props {
  token: Token | undefined
  isTokensSentToReferral: boolean
  firstBuyPercentage: string | undefined
  referrerPercentage: string | undefined
  isLoading: boolean
  pairAddress: string | undefined
  setIsReferralContractRemovedFromFees: Dispatch<SetStateAction<boolean>>
}

export default function RemoveFees({
  token,
  isTokensSentToReferral,
  firstBuyPercentage,
  referrerPercentage,
  isLoading,
  setIsReferralContractRemovedFromFees,
  pairAddress,
}: Props) {
  const { account } = useWeb3React()
  return (
    <article>
      <p>If token has fees remove referral contract from them</p>
      <p>
        Referral contract - <b>{REFERRAL_ADDRESS}</b>
      </p>
      <p>Remove pair from KODA fees</p>
      <p>
        Pair contract - <b>{pairAddress && account ? pairAddress : '???'}</b>
      </p>
      {token && account && (
        <p className="paragraph">
          <Checkbox
            id="agree"
            scale="sm"
            // disabled={!isTokensSentToReferral || !firstBuyPercentage || !referrerPercentage || isLoading}
            onChange={(o) => setIsReferralContractRemovedFromFees(o.target.checked)}
          />
          &nbsp; I confirm that these requirements are satisfied
        </p>
      )}
    </article>
  )
}
