import React from 'react'
import { Skeleton } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { PER_PAGE } from 'constants/whitelabel'

type Props = {
  isMobile?: boolean
}

function WhitelabelNftLoadingSection({ isMobile }: Props) {
  const skeletons = Array.from(Array(PER_PAGE).keys())

  return (
    <>
      {skeletons.map((skeleton) => (
        <Grid item xs={6} sm={6} md={4} lg={3} key={`gallery-item-${skeleton}`}>
          {isMobile ? <Skeleton height={100} /> : <Skeleton width={219} height={276} />}
        </Grid>
      ))}
    </>
  )
}

export default WhitelabelNftLoadingSection
