import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftOwnersByOwner } from 'api/useWhitelabelNftApi'
import useDebounce from 'hooks/useDebounce'
import React, { useState } from 'react'
import NftCollectionGallery from '../shared/NftCollectionGallery'

function TabNftCollectionAlbum() {
  const { account } = useWeb3React()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>()
  const debouncedSearch = useDebounce(search, 1000)
  const whitelabelNftOwnerByOwner = useWhitelabelNftOwnersByOwner(account || '', debouncedSearch)

  return (
    <NftCollectionGallery
      queryResult={whitelabelNftOwnerByOwner}
      totalItem={10}
      page={page}
      search={search}
      onSearchChange={setSearch}
      onPageChange={setPage}
      withSearch
    />
  )
}

export default React.memo(TabNftCollectionAlbum)
