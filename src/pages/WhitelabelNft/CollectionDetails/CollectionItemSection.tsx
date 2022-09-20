import { Box, Heading, lightColors, NavTab, Text } from '@koda-finance/summitswap-uikit'
import { useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { UseQueryResult } from 'react-query'
import { NavItem, NftItemCollectionTab, WhitelabelNftCollectionGql } from 'types/whitelabelNft'
import TabAllCollection from './TabAllCollection'

type Props = {
  whitelabelNft: UseQueryResult<WhitelabelNftCollectionGql | undefined>
}

function CollectionItemSection({ whitelabelNft }: Props) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const [tabActiveIndex, setTabActiveIndex] = useState(0)

  const collectionTabs: NavItem[] = [
    {
      label: 'All Collections',
      code: NftItemCollectionTab.ALL_COLLECTION,
      component: <TabAllCollection />,
    },
    {
      label: 'My Collections',
      code: NftItemCollectionTab.MY_COLLECTION,
      component: null,
    },
  ]

  return (
    <>
      <Heading color="linkColor" marginBottom={isMobileView ? '8px' : '16px'}>
        {whitelabelNft.data?.name || 'NFT Collection'}
      </Heading>
      <Box borderBottom={`1px solid ${lightColors.inputColor}`} marginBottom={isMobileView ? '16px' : '24px'}>
        <NavTab activeIndex={tabActiveIndex} onItemClick={(index: number) => setTabActiveIndex(index)}>
          {collectionTabs.map((item) => {
            return <Text key={`tab-${item.label}`}>{item.label}</Text>
          })}
        </NavTab>
      </Box>
      <div>{collectionTabs[tabActiveIndex].component}</div>
    </>
  )
}

export default React.memo(CollectionItemSection)
