import { Flex, Heading } from '@koda-finance/summitswap-uikit'
import React from 'react'

function MyNftCollection() {
  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="16px">
        My NFT Collections
      </Heading>
    </Flex>
  )
}

export default React.memo(MyNftCollection)
