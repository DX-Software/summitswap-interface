import { Flex, Heading } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftAccountById, useWhitelabelNftCollectionsByOwner } from 'api/useWhitelabelNftApi'
import { PER_PAGE } from 'constants/whitelabel'
import React, { useState } from 'react'
import CollectionDetails from '../CollectionDetails'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import ConnectWalletSection from '../shared/ConnectWalletSection'
import Divider from '../shared/Divider'
import NftCollectionGallery from '../shared/NftCollectionGallery'

function MyNftCollection() {
  const [page, setPage] = useState(1)
  const { account } = useWeb3React()
  const { whitelabelNftId } = useWhitelabelNftContext()

  const whitelabelNftAccountById = useWhitelabelNftAccountById(account || '')
  const whitelabelNftCollectionsByOwner = useWhitelabelNftCollectionsByOwner(page, PER_PAGE, account || '')

  if (whitelabelNftId) {
    return <CollectionDetails previousPage="My NFT Collections" />
  }

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="16px">
        My NFT Collections
      </Heading>
      <Divider />
      {!account ? (
        <ConnectWalletSection />
      ) : (
        <NftCollectionGallery
          queryResult={whitelabelNftCollectionsByOwner}
          totalItem={whitelabelNftAccountById.data?.totalWhitelabelNft?.toNumber() || 0}
          page={page}
          onPageChange={setPage}
        />
      )}
    </Flex>
  )
}

export default React.memo(MyNftCollection)
