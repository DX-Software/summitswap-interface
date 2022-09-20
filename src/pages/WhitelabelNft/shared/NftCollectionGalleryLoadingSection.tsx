import { Skeleton } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { PER_PAGE } from 'constants/whitelabel'
import React from 'react'
import ImageSkeleton from './ImageSkeleton'

function NftCollectionGalleryLoadingSection() {
  const skeletons = Array.from(Array(PER_PAGE).keys())

  return (
    <>
      {skeletons.map((skeleton) => (
        <Grid item xs={6} sm={6} md={4} lg={3} key={`gallery-item-${skeleton}`}>
          <ImageSkeleton width="100%" marginBottom="16px" />
          <Skeleton width={86} marginBottom="8px" />
          <Skeleton width="100%" marginBottom="4px" />
          <Skeleton width="70%" />
        </Grid>
      ))}
    </>
  )
}

export default React.memo(NftCollectionGalleryLoadingSection)
