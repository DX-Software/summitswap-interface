import { Box, Input, TabPresale, Text } from '@koda-finance/summitswap-uikit'
import { Phase } from 'constants/whitelabel'
import useWhitelabelNfts from 'hooks/useWhitelabelNfts'
import useWhitelabelNftsByPhase from 'hooks/useWhitelabelNftsByPhase'
import React, { useState } from 'react'
import InfoSection from './InfoSection'
import NftCollectionGallery from './shared/NftCollectionGallery'
import { CollectionTab, NavItem } from './types'

function BrowseCollection() {
  const [tabActiveIndex, setTabActiveIndex] = useState(0)

  const whitelabelNfts = useWhitelabelNfts()
  const publicPhaseWhitelabelNfts = useWhitelabelNftsByPhase(Phase.Public)
  const whitelistPhaseWhitelabelNfts = useWhitelabelNftsByPhase(Phase.Whitelist)
  const pausedPhaseWhitelabelNfts = useWhitelabelNftsByPhase(Phase.Pause)

  const collectionTabs: NavItem[] = [
    {
      label: 'All Collections',
      code: CollectionTab.ALL_COLLECTION,
      component: <NftCollectionGallery queryResult={whitelabelNfts} />,
    },
    {
      label: 'Public Phase',
      code: CollectionTab.PUBLIC_PHASE,
      component: <NftCollectionGallery queryResult={publicPhaseWhitelabelNfts} />,
    },
    {
      label: 'Whitelist Phase',
      code: CollectionTab.WHITELIST_PHASE,
      component: <NftCollectionGallery queryResult={whitelistPhaseWhitelabelNfts} />,
    },
    {
      label: 'Paused Phase',
      code: CollectionTab.PAUSED_PHASE,
      component: <NftCollectionGallery queryResult={pausedPhaseWhitelabelNfts} />,
    },
  ]

  return (
    <>
      <Input placeholder="Seach NFT Collection by name" scale="lg" style={{ marginBottom: '32px' }} />
      <InfoSection />
      <Box marginBottom="24px">
        <TabPresale activeIndex={tabActiveIndex} onItemClick={(index: number) => setTabActiveIndex(index)}>
          {collectionTabs.map((item) => {
            return <Text>{item.label}</Text>
          })}
        </TabPresale>
      </Box>
      <div>{collectionTabs[tabActiveIndex].component}</div>
    </>
  )
}

export default React.memo(BrowseCollection)
