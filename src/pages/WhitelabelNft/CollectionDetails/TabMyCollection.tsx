import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftItemsByCollectionAndOwner, useWhitelabelNftOwnerById } from 'api/useWhitelabelNftApi'
import { PER_PAGE } from 'constants/whitelabel'
import React, { useState } from 'react'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import NftItemGallery from '../shared/NftItemGallery'

function TabMyCollection() {
  const { account } = useWeb3React()
  const [page, setPage] = useState(1)
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNftItems = useWhitelabelNftItemsByCollectionAndOwner(whitelabelNftId, account || '', page, PER_PAGE)
  const whitelabelNftOwnerById = useWhitelabelNftOwnerById(`${whitelabelNftId}-${account}`)

  return (
    <NftItemGallery
      queryResult={whitelabelNftItems}
      totalItem={whitelabelNftOwnerById.data?.nftCount?.toNumber() || 0}
      page={page}
      onPageChange={setPage}
      displayOwner
    />
  )
}

export default React.memo(TabMyCollection)
