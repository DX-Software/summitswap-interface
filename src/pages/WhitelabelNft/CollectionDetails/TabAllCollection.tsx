import { useWhitelabelNftItemsByCollection } from 'api/useWhitelabelNftApi'
import { PER_PAGE } from 'constants/whitelabel'
import { BigNumber } from 'ethers'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useCallback, useEffect, useState } from 'react'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import NftItemGallery from '../shared/NftItemGallery'

function TabAllCollection() {
  const [page, setPage] = useState(1)
  const [totalItem, setTotalItem] = useState(0)
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNftItems = useWhitelabelNftItemsByCollection(whitelabelNftId, page, PER_PAGE)
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNftId)

  const getTotalItem = useCallback(async () => {
    const totalSupply = (await whitelabelNftContract?.totalSupply()) as BigNumber
    setTotalItem(totalSupply.toNumber())
  }, [whitelabelNftContract])

  useEffect(() => {
    getTotalItem()
  }, [getTotalItem, whitelabelNftContract])

  return <NftItemGallery queryResult={whitelabelNftItems} totalItem={totalItem} page={page} onPageChange={setPage} />
}

export default React.memo(TabAllCollection)
