import { Heading, Text } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftItemGql } from 'types/whitelabelNft'
import { shortenAddress } from 'utils'

type AboutSectionProps = {
  whitelabelNftItem: UseQueryResult<WhitelabelNftItemGql | undefined>
}

function AboutSection({ whitelabelNftItem }: AboutSectionProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')

  return (
    <>
      <Heading
        color="primary"
        fontWeight={700}
        marginBottom={isMobileView ? '8px' : '16px'}
        fontSize={isMobileView ? '14px' : '16px'}
      >
        About {whitelabelNftItem.data?.collection?.name}
      </Heading>
      <Text color="textDisabled" fontSize={isMobileView ? '12px' : '14px'} marginBottom="24px">
        {whitelabelNftItem.data?.collection?.description}
      </Text>
      <Grid container spacing="4px">
        <Grid item xs={12}>
          <Heading
            color="primary"
            fontWeight={700}
            marginBottom={isMobileView ? '4px' : '8px'}
            fontSize={isMobileView ? '14px' : '16px'}
          >
            Details
          </Heading>
        </Grid>
        <Grid item xs={6}>
          <Text color="textDisabled" fontSize={isMobileView ? '12px' : '14px'}>
            Contract Address
          </Text>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="flex-end">
          <Text color="linkColor" fontSize={isMobileView ? '12px' : '14px'}>
            {whitelabelNftItem.data?.collection?.id ? shortenAddress(whitelabelNftItem.data.collection.id, 6) : ''}
          </Text>
        </Grid>
        <Grid item xs={6}>
          <Text color="textDisabled" fontSize={isMobileView ? '12px' : '14px'}>
            Token ID
          </Text>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="flex-end">
          <Text fontSize={isMobileView ? '12px' : '14px'}>{whitelabelNftItem.data?.tokenId}</Text>
        </Grid>
        <Grid item xs={6}>
          <Text color="textDisabled" fontSize={isMobileView ? '12px' : '14px'}>
            Token Standard
          </Text>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="flex-end">
          <Text fontSize={isMobileView ? '12px' : '14px'}>ERC-721</Text>
        </Grid>
        <Grid item xs={6}>
          <Text color="textDisabled" fontSize={isMobileView ? '12px' : '14px'}>
            Blockchain
          </Text>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="flex-end">
          <Text fontSize={isMobileView ? '12px' : '14px'}>Ethereum</Text>
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(AboutSection)
