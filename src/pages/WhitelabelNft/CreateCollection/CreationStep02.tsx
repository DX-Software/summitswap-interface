import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Box,
  Button,
  DownloadIcon,
  ExchangeIcon,
  Flex,
  Heading,
  SpreadsheetIcon,
  UploadIcon,
} from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { FormikProps, FormikValues } from 'formik'
import React from 'react'
import styled from 'styled-components'
import { NavStepButton } from '../shared/Button'
import Divider from '../shared/Divider'
import NftCollectionGalleryItemImage from '../shared/NftCollectionGalleryItemImage'
import { HelperText } from '../shared/Text'

const SpreadSheetWrapper = styled(Box)`
  background: linear-gradient(180deg, #011d2c 51.44%, #483f5a 100%);
  border-radius: 8px;
`

const SpreadSheetIconWrapper = styled.div`
  width: 75px;
  height: 75px;
  background-color: ${({ theme }) => theme.colors.linkColor};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`

type Props = {
  setCurrentCreationStep: React.Dispatch<React.SetStateAction<number>>
  formik: FormikProps<FormikValues>
}

function CreationStep02({ setCurrentCreationStep, formik }: Props) {
  return (
    <>
      <Grid container spacing="32px" marginBottom="72px">
        <Grid item xs={12} lg={5}>
          <SpreadSheetWrapper padding="32px">
            <Heading color="success" size="md" marginBottom="24px">
              Easily define all of your NFTs
            </Heading>

            <Flex justifyContent="space-between" alignItems="center">
              <NftCollectionGalleryItemImage src="https://picsum.photos/536/354" scale="sm" />
              <ExchangeIcon width={64} height={64} />
              <SpreadSheetIconWrapper>
                <SpreadsheetIcon width={44} height={44} color="default" />
              </SpreadSheetIconWrapper>
            </Flex>

            <HelperText marginY="16px">
              Viverra elementum in egestas consequat est. Nisl est sit ac elit, at dui ornare sapien. Nam ultrices
              bibendum cursus pretium id mollis. Molestie id tortor, eget eu sed tortor.
            </HelperText>

            <Button variant="tertiary" startIcon={<DownloadIcon />} width="100%">
              <b>Download Metadata Format</b>
            </Button>
          </SpreadSheetWrapper>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Heading size="md" marginBottom="8px">
            Upload Your NFTs
          </Heading>
          <HelperText marginBottom="8px">Upload all of your NFTs images here (or you can upload in zip/rar)</HelperText>
          <Button variant="awesome" startIcon={<UploadIcon color="default" />} marginBottom="32px">
            <b>Upload NFT Images</b>
          </Button>

          <Heading size="md" marginBottom="8px">
            Upload the Metadata Sheet
          </Heading>
          <HelperText marginBottom="8px">Upload the metadata sheet that will synchronized with the images</HelperText>
          <Button variant="awesome" startIcon={<UploadIcon color="default" />} marginBottom="32px">
            <b>Upload Metadata Sheet</b>
          </Button>

          <Divider />

          <Button startIcon={<ExchangeIcon color="default" />}>Validate NFT Collection</Button>
        </Grid>
      </Grid>
      <Flex justifyContent="space-between">
        <NavStepButton
          variant="secondary"
          onClick={() => setCurrentCreationStep((prev) => prev - 1)}
          startIcon={<ArrowBackIcon width={24} />}
        >
          <b>Previous Step</b>
        </NavStepButton>
        <NavStepButton
          variant="tertiary"
          onClick={() => setCurrentCreationStep((prev) => prev + 1)}
          endIcon={<ArrowForwardIcon width={24} />}
        >
          <b>Next Step</b>
        </NavStepButton>
      </Flex>
    </>
  )
}

export default React.memo(CreationStep02)
