import React from 'react'
import { Flex } from '@summitswap-uikit'
import AppBody from '../AppBody'

export default function CrossChainSwap() {
  return (
    <Flex justifyContent="center">
      <iframe
        title="Rubic"
        id="rubic-widget-iframe"
        height="700px"
        width="400px"
        frameBorder="0"
        src="https://app.rubic.exchange/?iframe=vertical&amp;amount=1&amp;background=%23011d2c&amp;bsc_tokens=%5B%220x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5%22%5D&amp;from=ETH&amp;fromChain=ETH&amp;hideSelectionTo=true&amp;theme=dark&amp;to=KODA&amp;toChain=BSC"
        style={{
          borderRadius: 20,
        }}
      />
    </Flex>
  )
}
