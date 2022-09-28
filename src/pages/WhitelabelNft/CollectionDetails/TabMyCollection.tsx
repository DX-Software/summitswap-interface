import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftItemsByCollectionAndOwner } from 'api/useWhitelabelNftApi'
import { PER_PAGE } from 'constants/whitelabel'
import { BigNumber } from 'ethers'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useCallback, useEffect, useState } from 'react'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import NftItemGallery from '../shared/NftItemGallery'

function TabMyCollection() {
  const { account } = useWeb3React()
  const [page, setPage] = useState(1)
  const [totalItem, setTotalItem] = useState(0)
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNftItems = useWhitelabelNftItemsByCollectionAndOwner(whitelabelNftId, account || '', page, PER_PAGE)
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

export default React.memo(TabMyCollection)
