import { useWhitelabelNftCollections } from 'api/useWhitelabelNftApi'
import { PER_PAGE, Phase } from 'constants/whitelabel'
import useDebounce from 'hooks/useDebounce'
import React, { useState } from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftFactoryGql } from 'types/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import NftCollectionGallery from '../shared/NftCollectionGallery'

type Props = {
  whitelabelNftFactory: UseQueryResult<WhitelabelNftFactoryGql | undefined, unknown>
}

function TabPausedPhaseCollection({ whitelabelNftFactory }: Props) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>()
  const debouncedSearch = useDebounce(search, 1000)
  const { setWhitelabelNtId } = useWhitelabelNftContext()

  const whitelabelNftCollections = useWhitelabelNftCollections(page, PER_PAGE, debouncedSearch, [Phase.Pause])

  if (whitelabelNftFactory.isLoading) {
    return null
  }

  const totalWhitelabelNft = whitelabelNftFactory.data?.totalWhitelabelNftPausedPhase?.toNumber() || 0

  return (
    <NftCollectionGallery
      queryResult={whitelabelNftCollections}
      totalItem={totalWhitelabelNft}
      page={page}
      search={search}
      onSearchChange={setSearch}
      onPageChange={setPage}
      handleShowWhitelabelNft={setWhitelabelNtId}
      withSearch
    />
  )
}

export default React.memo(TabPausedPhaseCollection)
