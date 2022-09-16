import { Flex } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import Pagination from 'components/Pagination/Pagination'
import { PER_PAGE } from 'constants/whitelabel'
import React, { useMemo } from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftQuery } from 'types/whitelabelNft'
import NftCollectionGalleryItem from './NftCollectionGalleryItem'

type Props = {
  queryResult: UseQueryResult<WhitelabelNftQuery[], unknown>
  totalItem: number
  page: number
  onPageChange: React.Dispatch<React.SetStateAction<number>>
}

function NftCollectionGallery({ queryResult, totalItem, page, onPageChange }: Props) {
  const maxPage = useMemo(() => {
    return Math.ceil(totalItem / PER_PAGE)
  }, [totalItem])

  if (queryResult.isLoading) {
    return null
  }

  const { data } = queryResult

  return (
    <Grid container spacing="40px">
      <Grid item xs={12}>
        <Grid container spacing="24px">
          {data &&
            data?.map((item) => (
              <Grid item xs={6} md={4} sm={6} lg={3} key={`gallery-item-${item.id}`}>
                <NftCollectionGalleryItem data={item} />
              </Grid>
            ))}
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
  )
}

export default React.memo(NftCollectionGallery)
