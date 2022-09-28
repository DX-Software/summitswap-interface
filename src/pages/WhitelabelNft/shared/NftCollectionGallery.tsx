import { Flex, Input } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import Pagination from 'components/Pagination/Pagination'
import { PER_PAGE } from 'constants/whitelabel'
import React, { useMemo } from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftCollectionGql } from 'types/whitelabelNft'
import EmptyCollection from '../BrowseCollections/EmptyCollection'
import NftCollectionGalleryItem from './NftCollectionGalleryItem'
import NftCollectionGalleryLoadingSection from './NftCollectionGalleryLoadingSection'

type Props = {
  queryResult: UseQueryResult<WhitelabelNftCollectionGql[], unknown>
  totalItem: number
  page: number
  search: string | undefined
  onSearchChange: React.Dispatch<React.SetStateAction<string | undefined>>
  onPageChange: React.Dispatch<React.SetStateAction<number>>
  handleShowWhitelabelNft: React.Dispatch<React.SetStateAction<string>>
}

function NftCollectionGallery({
  queryResult,
  totalItem,
  page,
  search,
  onSearchChange,
  onPageChange,
  handleShowWhitelabelNft,
}: Props) {
  const maxPage = useMemo(() => {
    return Math.ceil(totalItem / PER_PAGE)
  }, [totalItem])

  return (
    <>
      <Input
        placeholder="Seach collection by collection name"
        scale="lg"
        style={{ marginBottom: '32px' }}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <Grid container spacing="40px">
        <Grid item xs={12}>
          <Grid container spacing="24px">
            {queryResult.isLoading ? (
              <NftCollectionGalleryLoadingSection />
            ) : queryResult.isFetched && queryResult.data?.length === 0 ? (
              <EmptyCollection />
            ) : (
              queryResult.data?.map((item) => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={`gallery-item-${item.id}`}>
                  <NftCollectionGalleryItem data={item} onClick={() => handleShowWhitelabelNft(item.id)} />
                </Grid>
              ))
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
