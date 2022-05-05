import { Token } from '@koda-finance/summitswap-sdk'
import { Button, Text, Input } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  token: Token | undefined
  isLoading: boolean
  setBNBAmountForSummitSwap: Dispatch<SetStateAction<string | undefined>>
}

export default function SwapToKoda({ isLoading, token, setBNBAmountForSummitSwap }: Props) {
  const { account } = useWeb3React()
  // const [bnbAmountForPancakeSwap, setBNBAmountForPancakeSwap] = useState('')

  return (
    <article>
      <p>
        Swap your <b>BNB</b> to <b>KODA</b>. Try to swap on both exchanges (pancakeswap and summitswap) to keep the
        prices about the same
      </p>
      {account && token && (
        <>
          <Input
            disabled={isLoading}
            type="text"
            placeholder="BNB Amount for SummitSwap"
            onChange={(o) => setBNBAmountForSummitSwap(o.target.value)}
            style={{ marginBottom: '20px' }}
          />
          {/* <Input
            disabled={isLoading}
            type="text"
            placeholder="BNB Amount for PancakeSwap"
            onChange={(o) => setBNBAmountForPancakeSwap(o.target.value)}
            style={{ marginBottom: '20px' }}
          /> */}
        </>
      )}
    </article>
  )
}
