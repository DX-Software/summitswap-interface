import { Box, Heading, NavTab, Text } from '@koda-finance/summitswap-uikit'
import { useWhitelabelNftFactoryById } from 'api/useWhitelabelNftApi'
import { WHITELABEL_FACTORY_ADDRESS } from 'constants/whitelabel'
import { isAddress } from 'ethers/lib/utils'
import useParsedQueryString from 'hooks/useParsedQueryString'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BrowseCollectionTab, NavItem } from 'types/whitelabelNft'
import CollectionDetails from '../CollectionDetails'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
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
  const parsedQs = useParsedQueryString()
  const [tabActiveIndex, setTabActiveIndex] = useState(0)
  const { whitelabelNftId, setWhitelabelNtId, setTokenId } = useWhitelabelNftContext()
  const whitelabelNftFactory = useWhitelabelNftFactoryById(WHITELABEL_FACTORY_ADDRESS)

  const collectionTabs: NavItem[] = [
    {
      label: 'All Collections',
      code: BrowseCollectionTab.ALL_COLLECTION,
      component: <TabBrowseAllCollection whitelabelNftFactory={whitelabelNftFactory} />,
    },
    {
      label: 'Public Phase',
      code: BrowseCollectionTab.PUBLIC_PHASE,
      component: <TabPublicPhaseCollection whitelabelNftFactory={whitelabelNftFactory} />,
    },
    {
      label: 'Whitelist Phase',
      code: BrowseCollectionTab.WHITELIST_PHASE,
      component: <TabWhitelistPhaseCollection whitelabelNftFactory={whitelabelNftFactory} />,
    },
    {
      label: 'Paused Phase',
      code: BrowseCollectionTab.PAUSED_PHASE,
      component: <TabPausedPhaseCollection whitelabelNftFactory={whitelabelNftFactory} />,
    },
  ]

  useEffect(() => {
    if (!parsedQs['whitelabel-nft'] || !isAddress(parsedQs['whitelabel-nft'].toString())) return
    setWhitelabelNtId(parsedQs['whitelabel-nft'].toString())
  }, [parsedQs, setWhitelabelNtId])

  useEffect(() => {
    if (!parsedQs['token-id']) return
    setTokenId(parsedQs['token-id'].toString())
  }, [parsedQs, setTokenId])

  if (whitelabelNftId) {
    return <CollectionDetails previousPage="Browse Collections" />
  }

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
