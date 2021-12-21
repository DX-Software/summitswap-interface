import React, { useEffect } from 'react'
import { Flex } from '@summitswap-uikit'
import AppBody from '../AppBody'

export default function CrossChainSwap() {
  useEffect(() => {
    const configuration = {
      from: 'ETH',
      to: 'KODA',
      fromChain: 'ETH',
      toChain: 'BSC',
      amount: 1,
      iframe: 'flex',
      hideSelectionFrom: false,
      hideSelectionTo: false,
      theme: 'dark',
      background: '#28372e',
      injectTokens: {
        eth: ['0xd123575d94a7ad9bff3ad037ae9d4d52f41a7518'],
        bsc: ['0x8aed24bf6e0247be51c57d68ad32a176bf86f4d9'],
        koda: ['0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5'],
      },
      slippagePercent: {
        instantTrades: 2,
        crossChain: 5,
      },
    }

    // @ts-ignore
    // console.log(rubicWidget);
    rubicWidget.init(configuration)
  }, [])

  return (
    <>
      <Flex justifyContent="center">
        <div id="rubic-widget-root" />
      </Flex>
      a
        <iframe
          title="Rubic"
          frameBorder="0"
          src="https://app.rubic.exchange/?iframe=vertical&amp;amount=1&amp;background=%23011d2c&amp;bsc_tokens=%5B%220x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5%22%5D&amp;from=ETH&amp;fromChain=ETH&amp;theme=dark&amp;to=KODA&amp;toChain=BSC"
          style={{
            borderRadius: 20,
            width: 'min(500px, 100vw)',
            height: '700px',
          }}
        />
    </>
  )
}
