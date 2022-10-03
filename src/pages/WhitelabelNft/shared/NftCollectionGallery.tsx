import { Flex, Input } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import Pagination from 'components/Pagination/Pagination'
import { PER_PAGE } from 'constants/whitelabel'
import React, { useMemo } from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftCollectionGql, WhitelabelNftOwnerGql } from 'types/whitelabelNft'
import EmptyCollection from '../BrowseCollections/EmptyCollection'
import NftCollectionGalleryItem from './NftCollectionGalleryItem'
import NftCollectionGalleryLoadingSection from './NftCollectionGalleryLoadingSection'

type Props = {
  queryResult: UseQueryResult<WhitelabelNftCollectionGql[] | WhitelabelNftOwnerGql[], unknown>
  totalItem: number
  page: number
  search?: string
  withSearch?: boolean
  onSearchChange?: React.Dispatch<React.SetStateAction<string | undefined>>
  onPageChange: React.Dispatch<React.SetStateAction<number>>
}

function NftCollectionGallery({
  queryResult,
  totalItem,
  page,
  search,
  withSearch,
  onSearchChange,
  onPageChange,
}: Props) {
  const maxPage = useMemo(() => {
    return Math.ceil(totalItem / PER_PAGE)
  }, [totalItem])

  return (
    <>
      {withSearch && (
        <Input
          placeholder="Search collection by collection name"
          scale="lg"
          style={{ marginBottom: '32px' }}
          value={search}
          onChange={(event) => (onSearchChange ? onSearchChange(event.target.value) : null)}
        />
      )}
      <Grid container spacing="40px">
        <Grid item xs={12}>
          <Grid container spacing="24px">
            {queryResult.isLoading ? (
              <NftCollectionGalleryLoadingSection />
            ) : queryResult.isFetched && queryResult.data?.length === 0 ? (
              <EmptyCollection />
            ) : (
              queryResult.data?.map((item: WhitelabelNftCollectionGql | WhitelabelNftOwnerGql) => {
                const collection = item as WhitelabelNftCollectionGql
                const nftOwner = item as WhitelabelNftOwnerGql

                const key = `gallery-item-${item.id}`
                const id = nftOwner.collection?.id || collection.id
                const name = collection.name || nftOwner.collection?.name
                const previewImageUrl = collection.previewImageUrl || nftOwner.collection?.previewImageUrl
                const isReveal = collection.isReveal || nftOwner.collection?.isReveal
                const phase = collection.phase ?? nftOwner.collection?.phase
                const { maxSupply } = collection
                const { nftCount } = nftOwner

                return (
                  <Grid item xs={6} sm={6} md={4} lg={3} key={key}>
                    <NftCollectionGalleryItem
                      id={id}
                      name={name}
                      previewImageUrl={previewImageUrl}
                      isReveal={isReveal}
                      phase={phase}
                      maxSupply={maxSupply}
                      nftCount={nftCount}
                    />
                  </Grid>
                )
              })
            )}
          </Grid>
        </Grid>
        {maxPage > 1 && (
          <Grid item xs={12}>
            <Flex justifyContent="flex-end" style={{ columnGap: '8px' }}>
              <Pagination maxPage={maxPage} page={page} onPageChange={onPageChange} />
            </Flex>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default React.memo(NftCollectionGallery)

NftCollectionGallery.defaultProps = {
  withSearch: false,
}
