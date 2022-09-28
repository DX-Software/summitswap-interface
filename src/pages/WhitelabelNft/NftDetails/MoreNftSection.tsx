import { Heading } from '@koda-finance/summitswap-uikit'
import { useMediaQuery } from '@mui/material'
import { useWhitelabelNftItems } from 'api/useWhitelabelNftApi'
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
  const whitelabelNftItems = useWhitelabelNftItems(whitelabelNftId, 1, 12)

  return (
    <>
      <Heading color="primary" marginBottom={isMobileView ? '8px' : '16px'}>
        More from {whitelabelNftItem.data?.collection?.name}
      </Heading>
      <Decorator marginBottom="18px" />
      <NftItemGallery
        queryResult={whitelabelNftItems}
        totalItem={whitelabelNftItems.data?.length || 0}
        page={1}
        onPageChange={() => null}
        displayCount={4}
        isRandom
      />
    </>
  )
}

export default React.memo(MoreNftSection)
