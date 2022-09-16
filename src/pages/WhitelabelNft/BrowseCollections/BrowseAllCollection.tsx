import { useWhitelabelNftCollections } from 'api/useWhitelabelNftApi'
import React, { useState } from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftFactoryQuery } from 'types/whitelabelNft'
import NftCollectionGallery from '../shared/NftCollectionGallery'

type Props = {
  whitelabelNftFactory: UseQueryResult<WhitelabelNftFactoryQuery | undefined, unknown>
}

function BrowseAllCollection({ whitelabelNftFactory }: Props) {
  const [page, setPage] = useState(1)

  const whitelabelNftCollections = useWhitelabelNftCollections(page)

  if (whitelabelNftFactory.isLoading) {
    return null
  }

  const totalWhitelabelNft = whitelabelNftFactory.data?.totalWhitelabelNft?.toNumber() || 0

  return (
    <NftCollectionGallery
      queryResult={whitelabelNftCollections}
      totalItem={totalWhitelabelNft}
      page={page}
      onPageChange={setPage}
    />
  )
}

export default React.memo(BrowseAllCollection)
