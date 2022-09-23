import React from "react"
import { Skeleton } from "@koda-finance/summitswap-uikit"
import { Grid } from "@mui/material"
import { PER_PAGE } from "constants/kickstarter"

type Props = {
  isMobile?: boolean
}

function KickstartersLoadingSection({ isMobile }: Props) {
  const skeletons = Array.from(Array(PER_PAGE).keys())

  return (
    <>
      {skeletons.map((skeleton) => (
        <Grid key={`skeleton-${skeleton}`} item xs={12} sm={6} lg={4}>
          {isMobile ? <Skeleton height={100} /> : <Skeleton height={310} />}
        </Grid>
      ))}
    </>
  )
}

export default KickstartersLoadingSection
