import { Box, Heading, NavTab, Text } from '@koda-finance/summitswap-uikit'
import { useWhitelabelNftFactoryById } from 'api/useWhitelabelNftApi'
import { WHITELABEL_FACTORY_ADDRESS } from 'constants/whitelabel'
import React, { useState } from 'react'
import styled from 'styled-components'
import { CollectionTab, NavItem } from 'types/whitelabelNft'
import InfoSection from './InfoSection'
import TabBrowseAllCollection from './TabBrowseAllCollection'
import TabPausedPhaseCollection from './TabPausedPhaseCollection'
import TabPublicPhaseCollection from './TabPublicPhaseCollection'
import TabWhitelistPhaseCollection from './TabWhitelistPhaseCollection'

const NavTabWrapper = styled(Box)`
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputColor};
`

function BrowseCollection() {
  const [tabActiveIndex, setTabActiveIndex] = useState(0)

  const whitelabelNftFactory = useWhitelabelNftFactoryById(WHITELABEL_FACTORY_ADDRESS)

  const collectionTabs: NavItem[] = [
    {
      label: 'All Collections',
      code: CollectionTab.ALL_COLLECTION,
      component: <TabBrowseAllCollection whitelabelNftFactory={whitelabelNftFactory} />,
    },
    {
      label: 'Public Phase',
      code: CollectionTab.PUBLIC_PHASE,
      component: <TabPublicPhaseCollection whitelabelNftFactory={whitelabelNftFactory} />,
    },
    {
      label: 'Whitelist Phase',
      code: CollectionTab.WHITELIST_PHASE,
      component: <TabWhitelistPhaseCollection whitelabelNftFactory={whitelabelNftFactory} />,
    },
    {
      label: 'Paused Phase',
      code: CollectionTab.PAUSED_PHASE,
      component: <TabPausedPhaseCollection whitelabelNftFactory={whitelabelNftFactory} />,
    },
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
      <div>{collectionTabs[tabActiveIndex].component}</div>
    </>
  )
}

export default React.memo(BrowseCollection)
