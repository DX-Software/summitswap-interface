import { Box, Flex, Heading, NavTab, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useState } from 'react'
import styled from 'styled-components'
import { MintedNftTab, NavItem } from 'types/whitelabelNft'
import CollectionDetails from '../CollectionDetails'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import ConnectWalletSection from '../shared/ConnectWalletSection'
import Divider from '../shared/Divider'
import TabAllCollection from './TabAllCollection'
import TabNftCollectionAlbum from './TabNftCollectionAlbum'

const NavTabWrapper = styled(Box)`
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputColor};
`

function MintedNfts() {
  const { account } = useWeb3React()
  const [tabActiveIndex, setTabActiveIndex] = useState(0)
  const { whitelabelNftId } = useWhitelabelNftContext()

  const collectionTabs: NavItem[] = [
    {
      label: 'All Collections',
      code: MintedNftTab.ALL_COLLECTION,
      component: <TabAllCollection />,
    },
    {
      label: 'NFT Collection Albums',
      code: MintedNftTab.NFT_COLLECTION_ALBUMS,
      component: <TabNftCollectionAlbum />,
    },
  ]

  if (whitelabelNftId) {
    return <CollectionDetails previousPage="Minted NFTs" />
  }

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="16px">
        Minted NFTs
      </Heading>
      {!account ? (
        <>
          <Divider />
          <ConnectWalletSection />
        </>
      ) : (
        <>
          <NavTabWrapper marginBottom="24px">
            <NavTab activeIndex={tabActiveIndex} onItemClick={(index: number) => setTabActiveIndex(index)}>
              {collectionTabs.map((item) => {
                return <Text key={`tab-${item.label}`}>{item.label}</Text>
              })}
            </NavTab>
          </NavTabWrapper>
          <div>{collectionTabs[tabActiveIndex].component}</div>
        </>
      )}
    </Flex>
  )
}

export default React.memo(MintedNfts)
