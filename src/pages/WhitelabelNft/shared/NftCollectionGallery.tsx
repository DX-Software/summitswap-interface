import { Box } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftQuery } from 'types/whitelabelNft'
import NftCollectionGalleryItem from './NftCollectionGalleryItem'

type Props = {
  queryResult: UseQueryResult<WhitelabelNftQuery[], unknown>
}

function NftCollectionGallery({ queryResult }: Props) {
  if (queryResult.isLoading) {
    return null
  }

  const { data } = queryResult

  return (
    <Grid container spacing="24px">
      {data &&
        data?.map((item) => (
          <Box key={`gallery-item-${item.id}`}>
            <Grid item xs={6} md={4} sm={6} lg={3}>
              <NftCollectionGalleryItem data={item} />
            </Grid>
          </Box>
        ))}
    </Grid>
  )
}

export default React.memo(NftCollectionGallery)
