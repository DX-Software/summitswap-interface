import { Input, TabPresale, Text } from '@koda-finance/summitswap-uikit'
import { useWhitelabelNftContext } from 'contexts/whitelabelNft'
import React, { useState } from 'react'
import InfoSection from './InfoSection'
import { CollectionTab, NavItem } from './types'

function BrowseCollection() {
  const [tabActiveIndex, setTabActiveIndex] = useState(0)

  const { whitelabelNfts } = useWhitelabelNftContext()

  const collectionTabs: NavItem[] = [
    {
      label: 'All Collections',
      code: CollectionTab.ALL_COLLECTION,
      component: null,
    },
    {
      label: 'Public Phase',
      code: CollectionTab.PUBLIC_PHASE,
      component: null,
    },
    {
      label: 'Whitelist Phase',
      code: CollectionTab.WHITELIST_PHASE,
      component: null,
    },
    {
      label: 'Paused Phase',
      code: CollectionTab.PAUSED_PHASE,
      component: null,
    },
  ]

  return (
    <>
      <Input placeholder="Seach NFT Collection by name" scale="lg" style={{ marginBottom: '32px' }} />
      <InfoSection />
      <TabPresale activeIndex={tabActiveIndex} onItemClick={(index: number) => setTabActiveIndex(index)}>
        {collectionTabs.map((item) => {
          return <Text>{item.label}</Text>
        })}
      </TabPresale>
      <div className="main-content">{collectionTabs[tabActiveIndex].component}</div>
    </>
  )
}

export default React.memo(BrowseCollection)
