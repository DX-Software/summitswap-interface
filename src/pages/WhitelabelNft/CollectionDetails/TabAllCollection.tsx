import { useWhitelabelNftItemsByCollection } from 'api/useWhitelabelNftApi'
import { PER_PAGE } from 'constants/whitelabel'
import React from 'react'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import NftItemGallery from '../shared/NftItemGallery'

function TabAllCollection() {
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNftItems = useWhitelabelNftItemsByCollection(whitelabelNftId, PER_PAGE)

  return <NftItemGallery queryResult={whitelabelNftItems} displayOwner />
}

export default React.memo(TabAllCollection)
