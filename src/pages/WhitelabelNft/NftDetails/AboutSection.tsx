import { Heading } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { NftMetadata, WhitelabelNftItemGql } from 'types/whitelabelNft'

type AboutSectionProps = {
  metadata: NftMetadata | undefined
  whitelabelNftItem: UseQueryResult<WhitelabelNftItemGql | undefined>
}

function AboutSection({ metadata, whitelabelNftItem }: AboutSectionProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')

  return (
    <>
      <Heading color="primary" marginBottom={isMobileView ? '8px' : '16px'}>
        About {whitelabelNftItem.data?.collection?.name}
      </Heading>
      <Grid container spacing="8px">
        {/*  */}
      </Grid>
    </>
  )
}

export default React.memo(AboutSection)
