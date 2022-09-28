import { Box, Flex, Heading, NavTab, Text } from '@koda-finance/summitswap-uikit'
import React, { useState } from 'react'
import styled from 'styled-components'
import { MintedNftTab, NavItem } from 'types/whitelabelNft'

const NavTabWrapper = styled(Box)`
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputColor};
`

function MintedNfts() {
  const [tabActiveIndex, setTabActiveIndex] = useState(0)

  const collectionTabs: NavItem[] = [
    {
      label: 'All Collections',
      code: MintedNftTab.ALL_COLLECTION,
      component: null,
    },
    {
      label: 'NFT Collection Albums',
      code: MintedNftTab.NFT_COLLECTION_ALBUMS,
      component: null,
    },
  ]

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="16px">
        Minted NFTs
      </Heading>
      <NavTabWrapper marginBottom="24px">
        <NavTab activeIndex={tabActiveIndex} onItemClick={(index: number) => setTabActiveIndex(index)}>
          {collectionTabs.map((item) => {
            return <Text key={`tab-${item.label}`}>{item.label}</Text>
          })}
        </NavTab>
      </NavTabWrapper>
      <div>{collectionTabs[tabActiveIndex].component}</div>
    </Flex>
  )
}

export default React.memo(MintedNfts)
