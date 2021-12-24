import React, { useEffect } from 'react'
import { Flex, Text, Box, Button, useWalletModal } from '@summitswap-uikit'
import { rubicConfiguration } from './config'
import AppBody from '../AppBody'

export default function CrossChainSwap() {
  useEffect(() => {
    rubicWidget.init(rubicConfiguration)
  }, [])

  return (
    <AppBody>
      <Box mt={5}>
        <div id="rubic-widget-root" />
      </Box>
    </AppBody>
  )
}
