import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Box,
  EtherIcon,
  Heading,
  ImageIcon,
  Text,
  useModal,
} from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { FormikProps } from 'formik'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { WhitelabelNft, WhitelabelNftFormField } from 'types/whitelabelNft'
import { getDefaultConcealName, getPreviewImageUrl } from 'utils/whitelabelNft'
import { NavStepButton } from '../shared/Button'
import NftCollectionGalleryItemImage from '../shared/NftCollectionGalleryItemImage'
import ConcealModal from './ConcealModal'
import NftImageCarousel from './NftImageCarousel'

const SummaryText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: ${({ textAlign }) => textAlign};

  @media (max-width: 576px) {
    font-size: 14px;
    text-align: left;
  }
`

const StyledImageIcon = styled(ImageIcon)`
  width: 24px;
  margin-right: 4px;

  @media (max-width: 576px) {
    width: 16px;
  }
`

type Props = {
  setCurrentCreationStep: React.Dispatch<React.SetStateAction<number>>
  formik: FormikProps<WhitelabelNft>
}

function CreationStep03({ setCurrentCreationStep, formik }: Props) {
  const [onPresent] = useModal(<ConcealModal title="Conceal Image" src={formik.values.concealImage} />)

  const previewImage = useMemo(() => {
    if (formik.values.previewImage) {
      return URL.createObjectURL(formik.values.previewImage)
    }
    return getPreviewImageUrl()
  }, [formik.values.previewImage])

  return (
    <>
      <Grid container spacing="40px">
        <Grid item xs={12} md={5}>
          <Box marginTop="12px">
            <NftCollectionGalleryItemImage src={previewImage} />
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Heading size="md" color="primary" marginBottom="8px">
            Collection Details
          </Heading>
          <Grid container spacing="4px" marginBottom="24px">
            <Grid item xs={6}>
              <SummaryText>Collection Name</SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText textAlign="right">{formik.values.name}</SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText>Collection Symbol</SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText textAlign="right">{formik.values.symbol}</SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText>Conceal Name</SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText textAlign="right">
                {formik.values.concealName || getDefaultConcealName(formik.values.name)}
              </SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText>Conceal Image</SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText textAlign="right" color="linkColor" onClick={onPresent} style={{ cursor: 'pointer' }}>
                <StyledImageIcon color="linkColor" width={24} /> Preview Image
              </SummaryText>
            </Grid>
          </Grid>

          <Heading size="md" color="primary" marginBottom="8px">
            Collection Price
          </Heading>
          <Grid container spacing="4px" marginBottom="24px">
            <Grid item xs={6}>
              <SummaryText>Whitelist Mint Price</SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText textAlign="right" color="primary">
                <EtherIcon />
                {formik.values.publicMintPrice} ETH
              </SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText>Public Mint Price</SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText textAlign="right" color="primary">
                <EtherIcon />
                {formik.values.whitelistMintPrice} ETH
              </SummaryText>
            </Grid>
          </Grid>

          <Heading size="md" color="primary" marginBottom="8px">
            NFT Collections
          </Heading>
          <NftImageCarousel name={WhitelabelNftFormField.nftImages} formik={formik} />

          <Grid container spacing="4px" marginBottom="24px">
            <Grid item xs={6}>
              <SummaryText>NFT Collection Count</SummaryText>
            </Grid>
            <Grid item xs={6}>
              <SummaryText textAlign="right">
                <SummaryText bold color="linkColor" style={{ display: 'inline-block' }}>
                  {formik.values.nftImages.length}
                </SummaryText>
                &nbsp;NFT(s)
              </SummaryText>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing="16px">
        <Grid item xs={12} sm={6}>
          <NavStepButton
            variant="secondary"
            onClick={() => setCurrentCreationStep((prev) => prev - 1)}
            startIcon={<ArrowBackIcon width={24} />}
            isLoading={formik.isSubmitting}
          >
            <b>Previous Step</b>
          </NavStepButton>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end">
          <NavStepButton
            variant="primary"
            onClick={formik.submitForm}
            endIcon={<ArrowForwardIcon width={24} color="default" />}
            isLoading={formik.isSubmitting}
          >
            <b>Create New Collection</b>
          </NavStepButton>
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(CreationStep03)
