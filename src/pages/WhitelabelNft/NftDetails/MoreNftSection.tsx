import { Heading } from '@koda-finance/summitswap-uikit'
import { useMediaQuery } from '@mui/material'
import { useWhitelabelNftItemsByCollection } from 'api/useWhitelabelNftApi'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftItemGql } from 'types/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import Decorator from '../shared/Decorator'
import NftItemGallery from '../shared/NftItemGallery'

type MoreNftSectionProps = {
  whitelabelNftItem: UseQueryResult<WhitelabelNftItemGql | undefined>
}

function MoreNftSection({ whitelabelNftItem }: MoreNftSectionProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNftItems = useWhitelabelNftItemsByCollection(whitelabelNftId, 12)

  return (
    <>
      <Heading color="primary" marginBottom={isMobileView ? '8px' : '16px'}>
        More from {whitelabelNftItem.data?.collection?.name}
      </Heading>
      <Decorator marginBottom="18px" />
      <NftItemGallery queryResult={whitelabelNftItems} displayCount={4} isRandom displayOwner />
    </>
  )
}

export default React.memo(MoreNftSection)
