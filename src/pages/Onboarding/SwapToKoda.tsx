import { Token } from '@koda-finance/summitswap-sdk'
import { Button } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  token: Token | undefined
  isLoading: boolean
}

export default function SwapToKoda({ isLoading, token }: Props) {
  const { account } = useWeb3React()

  return (
    <article>
      <p>
        Swap your <b>BNB</b> to <b>KODA</b>. Try to swap on both exchanges (pancakeswap and summitswap) to keep the
        prices about the same
      </p>
      {account && token && (
        <>
          <Button as={Link} to="/swap" disabled={isLoading} target="_blank" rel="noreferrer">
            Swap on SummitSwap
          </Button>
          &nbsp;
          <a
            href="https://pancakeswap.finance/swap?outputCurrency=0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5"
            target="_blank"
            rel="noreferrer"
          >
            <Button disabled={isLoading}>Swap on PancakeSwap</Button>
          </a>
        </>
      )}
    </article>
  )
}
