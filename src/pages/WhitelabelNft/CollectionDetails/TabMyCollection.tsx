import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftItemsByCollectionAndOwner } from 'api/useWhitelabelNftApi'
import { PER_PAGE } from 'constants/whitelabel'
import React from 'react'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import NftItemGallery from '../shared/NftItemGallery'

function TabMyCollection() {
  const { account } = useWeb3React()
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNftItems = useWhitelabelNftItemsByCollectionAndOwner(whitelabelNftId, account || '', PER_PAGE)

  return <NftItemGallery queryResult={whitelabelNftItems} displayOwner />
}

export default React.memo(TabMyCollection)
