import { Box, Heading, lightColors, Skeleton, Text } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftGql } from 'types/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import { PhaseTag } from '../shared/CustomTag'
import ImageSkeleton from '../shared/ImageSkeleton'
import NftCollectionGalleryItemImage from '../shared/NftCollectionGalleryItemImage'
import { DescriptionText } from '../shared/Text'

type MetadataProps = {
  whitelabelNft: UseQueryResult<WhitelabelNftGql | undefined>
}

type StatsCardProps = {
  label: string
  value?: number
}

function StatsCard({ label, value = 0 }: StatsCardProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')

  return (
    <Box padding="16px" background={lightColors.inputColor} borderRadius="4px">
      <Heading size="lg" color={value === 0 ? 'textSubtle' : 'sidebarColor'}>
        {value}
      </Heading>
      <Text color="primary" fontSize={isMobileView ? '14px' : '16px'}>
        {label}
      </Text>
    </Box>
  )
}

function MetadataSection({ whitelabelNft }: MetadataProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNftId)

  if (whitelabelNft.isLoading) {
    return (
      <Grid container columnSpacing="40px" rowGap="24px">
        <Grid item xs={12} sm={5}>
          <Box marginTop="12px">
            <ImageSkeleton />
          </Box>
        </Grid>
        <Grid item xs={12} sm={7}>
          <Skeleton height="40px" marginY="8px" />
          <Skeleton width="33%" />
          <Skeleton height="100px" marginTop="16px" marginBottom="16px" />

          <Grid container spacing={isMobileView ? '8px' : '16px'}>
            <Grid item xs={6} lg={4}>
              <Skeleton height="72px" />
            </Grid>
            <Grid item xs={6} lg={4}>
              <Skeleton height="72px" />
            </Grid>
            <Grid item xs={6} lg={4}>
              <Skeleton height="72px" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container columnSpacing="40px" rowGap="24px">
      <Grid item xs={12} md={5}>
        <Box marginTop="12px">
          <NftCollectionGalleryItemImage
            src={whitelabelNft.data?.previewImageUrl || ''}
            isReveal={whitelabelNft.data?.isReveal || false}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={7}>
        <Heading size="xl">{whitelabelNft.data?.name}</Heading>
        <PhaseTag phase={whitelabelNft.data?.phase} />
        <DescriptionText color="textSubtle" marginTop="16px">
          Placerat eget egestas enim, lectus sem ante mi accumsan elit. Neque, nulla nulla laoreet pharetra nibh nisi
          faucibus. Ut hendrerit sed nam vitae posuere aliquet rhoncus gravida nulla. Accumsan nibh adipiscing ultrices
          ut egestas sit sit.
        </DescriptionText>
        <Grid container spacing={isMobileView ? '8px' : '16px'}>
          <Grid item xs={6} lg={4}>
            <StatsCard label="Items" value={whitelabelNft.data?.maxSupply?.toNumber()} />
          </Grid>
          <Grid item xs={6} lg={4}>
            <StatsCard label="Owners" value={0} />
          </Grid>
          <Grid item xs={6} lg={4}>
            <StatsCard label="NFT(s) minted" value={0} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default React.memo(MetadataSection)