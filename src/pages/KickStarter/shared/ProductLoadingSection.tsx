import React from "react"
import { Skeleton } from "@koda-finance/summitswap-uikit"
import { Grid } from "@mui/material"

function ProductLoadingSection() {
  return (
    <>
      <Grid item xs={12} sm={6} lg={4}>
        <Skeleton height={310} />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <Skeleton height={310} />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <Skeleton height={310} />
      </Grid>
    </>
  )
}

export default ProductLoadingSection
