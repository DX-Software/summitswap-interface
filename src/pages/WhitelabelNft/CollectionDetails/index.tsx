import { ArrowBackIcon, Box, Breadcrumbs, Flex, Heading, Skeleton, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useWhitelabelNftCollectionById } from 'api/useWhitelabelNftApi'
import React from 'react'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import { PhaseTag } from '../shared/CustomTag'
import ImageSkeleton from '../shared/ImageSkeleton'
import NftCollectionGalleryItemImage from '../shared/NftCollectionGalleryItemImage'
import { DescriptionText, HelperText } from '../shared/Text'
import MetadataSection from './MetadataSection'

type WhitelabelNftDetailsProps = {
  previousPage: string
}

type HeaderProps = {
  previousPage: string
  nftName: string | undefined
}

const Header = ({ previousPage, nftName }: HeaderProps) => {
  const { setWhitelabelNtId } = useWhitelabelNftContext()
  return (
    <>
      <Flex borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="8px" marginBottom="24px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={() => setWhitelabelNtId('')}>
            {previousPage}
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            {nftName}
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} onClick={() => setWhitelabelNtId('')}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: 'underline' }}>
          back to {previousPage}
        </Text>
      </Flex>
    </>
  )
}

function CollectionDetails({ previousPage }: WhitelabelNftDetailsProps) {
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNft = useWhitelabelNftCollectionById(whitelabelNftId)

  return (
    <>
      <Header previousPage={previousPage} nftName={whitelabelNft.data?.name} />
      <Grid container marginTop="24px" columnSpacing="40px" rowGap="24px">
        <Grid item xs={12} sm={5}>
          <Box marginTop="12px">
            {!whitelabelNft.data?.previewImageUrl ? (
              <ImageSkeleton />
            ) : (
              <NftCollectionGalleryItemImage src={whitelabelNft.data.previewImageUrl} />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={7}>
          <MetadataSection whitelabelNft={whitelabelNft} />
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(CollectionDetails)
