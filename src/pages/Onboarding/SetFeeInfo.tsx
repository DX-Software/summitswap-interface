import { Token } from '@koda-finance/summitswap-sdk'
import { Input, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
  token: Token | undefined
  isLoading: boolean
  isLiquidityLocked: boolean
  isTokensSentToReferral: boolean
  referrerPercentage: string | undefined
  setReferrerPercentage: Dispatch<SetStateAction<string | undefined>>
  firstBuyPercentage: string | undefined
  setFirstBuyPercentage: Dispatch<SetStateAction<string | undefined>>
}

export default function SetFeeInfo({
  token,
  isLoading,
  isLiquidityLocked,
  isTokensSentToReferral,
  referrerPercentage,
  setReferrerPercentage,
  firstBuyPercentage,
  setFirstBuyPercentage,
}: Props) {
  const { account } = useWeb3React()

  return (
    <article>
      <p>Specify details</p>
      <p>
        How much % do you want the referrers to earn?
        {token && account && (
          <>
            <Input
              disabled={!isTokensSentToReferral || isLoading || !isLiquidityLocked}
              type="number"
              placeholder="Referrer %"
              onChange={(o) => setReferrerPercentage(o.target.value)}
              style={{ marginTop: '10px', marginBottom: '10px' }}
            />
            <p>
              {!(parseInt(referrerPercentage ?? '') > 0) && isTokensSentToReferral && isLiquidityLocked && (
                <Text color="red">Please enter positive number</Text>
              )}
            </p>
          </>
        )}
      </p>
      <p>
        How much % do you want the referees to earn on their first buy?
        {token && account && (
          <>
            <Input
              disabled={!isTokensSentToReferral || isLoading || !isLiquidityLocked}
              type="number"
              placeholder="First buy referree %"
              onChange={(o) => setFirstBuyPercentage(o.target.value)}
              style={{ marginTop: '10px', marginBottom: '10px' }}
            />
            <p>
              {!(+(firstBuyPercentage ?? '') > 0) && isTokensSentToReferral && isLiquidityLocked && (
                <Text color="red">Please enter positive number</Text>
              )}
            </p>
          </>
        )}
      </p>
    </article>
  )
}
