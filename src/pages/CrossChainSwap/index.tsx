import React from 'react'
import { Flex, Text } from '@summitswap-uikit'
import CardNav from 'components/CardNav'
import PageHeader from 'components/PageHeader'
import { TranslateString } from 'utils/translateTextHelpers'
import AppBody from '../AppBody'



export default function CrossChainSwap() {
  return (
    <AppBody>
        <PageHeader
          title={TranslateString(262, 'Liquidity')}
          description={TranslateString(1168, 'Add liquidity to receive LP tokens')}
        />
      <Flex justifyContent="center">
        <Text color="text" fontSize="20px">
          Coming soon...
        </Text>
      </Flex>
    </AppBody>
  )
}
