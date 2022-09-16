import { Box, Heading, Input, NavTab, Text } from '@koda-finance/summitswap-uikit'
import { useWhitelabelNftCollections } from 'api/useWhitelabelNftApi'
// import useWhitelabelNftsByPhase from 'hooks/useWhitelabelNftsByPhase'
import React, { useState } from 'react'
import styled from 'styled-components'
import { CollectionTab, NavItem } from 'types/whitelabelNft'
import NftCollectionGallery from '../shared/NftCollectionGallery'
import InfoSection from './InfoSection'

const NavTabWrapper = styled(Box)`
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputColor};
`

function BrowseCollection() {
  const [page, setPage] = useState(1)
  const [tabActiveIndex, setTabActiveIndex] = useState(0)

  const whitelabelNfts = useWhitelabelNftCollections(page)
  // const publicPhaseWhitelabelNfts = useWhitelabelNftsByPhase(Phase.Public)
  // const whitelistPhaseWhitelabelNfts = useWhitelabelNftsByPhase(Phase.Whitelist)
  // const pausedPhaseWhitelabelNfts = useWhitelabelNftsByPhase(Phase.Pause)

  const collectionTabs: NavItem[] = [
    {
      label: 'All Collections',
      code: CollectionTab.ALL_COLLECTION,
      component: <NftCollectionGallery queryResult={whitelabelNfts} />,
    },
    // {
    //   label: 'Public Phase',
    //   code: CollectionTab.PUBLIC_PHASE,
    //   component: <NftCollectionGallery queryResult={publicPhaseWhitelabelNfts} />,
    // },
    // {
    //   label: 'Whitelist Phase',
    //   code: CollectionTab.WHITELIST_PHASE,
    //   component: <NftCollectionGallery queryResult={whitelistPhaseWhitelabelNfts} />,
    // },
    // {
    //   label: 'Paused Phase',
    //   code: CollectionTab.PAUSED_PHASE,
    //   component: <NftCollectionGallery queryResult={pausedPhaseWhitelabelNfts} />,
    // },
  ]

  return (
    <>
      <InfoSection />
      <Heading size="xl" marginBottom="16px">
        Browse NFT Collections
      </Heading>
      <NavTabWrapper marginBottom="24px">
        <NavTab activeIndex={tabActiveIndex} onItemClick={(index: number) => setTabActiveIndex(index)}>
          {collectionTabs.map((item) => {
            return <Text key={`tab-${item.label}`}>{item.label}</Text>
          })}
        </NavTab>
      </NavTabWrapper>
      <Input placeholder="Seach collection by collection name" scale="lg" style={{ marginBottom: '32px' }} />
      <div>{collectionTabs[tabActiveIndex].component}</div>
    </>
  )
}

export default React.memo(BrowseCollection)
