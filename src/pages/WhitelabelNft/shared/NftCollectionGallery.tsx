import { Grid } from '@mui/material'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftGraphql } from '../types'
import NftCollectionGalleryItem from './NftCollectionGalleryItem'

type Props = {
  queryResult: UseQueryResult<WhitelabelNftGraphql[], unknown>
}

function NftCollectionGallery({ queryResult }: Props) {
  if (queryResult.isLoading) {
    return null
  }

  const { data } = queryResult

  return (
    <Grid container spacing="24px">
      {data?.map((item) => (
        <>
          <Grid item xs={6} md={4} sm={6} lg={3}>
            <NftCollectionGalleryItem data={item} />
          </Grid>
        </>
      ))}
    </Grid>
  )
}

export default React.memo(NftCollectionGallery)
