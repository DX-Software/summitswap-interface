import { ArrowForwardIcon, darkColors, Flex, Heading, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { FormikProps } from 'formik'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { WhitelabelNft, WhitelabelNftFormField } from 'types/whitelabelNft'
import { NavStepButton } from '../shared/Button'
import CurrencyInput from '../shared/CurrencyInput'
import InputField from '../shared/InputField'
import { HelperText } from '../shared/Text'
import UploadImageInput from './UploadImageInput'

const DescriptionText = styled(Text)`
  margin-bottom: 16px;

  @media (max-width: 576px) {
    margin-bottom: 8px;
    font-size: 14px;
  }
`

type Props = {
  setCurrentCreationStep: React.Dispatch<React.SetStateAction<number>>
  formik: FormikProps<WhitelabelNft>
}

function CreationStep01({ setCurrentCreationStep, formik }: Props) {
  const handleNextPage = useCallback(async () => {
    const errors = await formik.validateForm()
    formik.setFieldTouched(WhitelabelNftFormField.name, true, true)
    formik.setFieldTouched(WhitelabelNftFormField.symbol, true, true)
    formik.setFieldTouched(WhitelabelNftFormField.whitelistMintPrice, true, true)
    formik.setFieldTouched(WhitelabelNftFormField.publicMintPrice, true, true)

    if (
      !Object.keys(errors).includes(WhitelabelNftFormField.name) &&
      !Object.keys(errors).includes(WhitelabelNftFormField.symbol) &&
      !Object.keys(errors).includes(WhitelabelNftFormField.whitelistMintPrice) &&
      !Object.keys(errors).includes(WhitelabelNftFormField.publicMintPrice)
    ) {
      setCurrentCreationStep((prev) => prev + 1)
    }
  }, [formik, setCurrentCreationStep])

  return (
    <>
      <Heading size="lg" marginBottom="16px">
        Collection Details
      </Heading>

      <Grid container spacing="16px">
        <Grid item xs={12} lg={6}>
          <Grid container spacing="16px" marginBottom="16px">
            <Grid item xs={12} sm={6} lg={6}>
              <UploadImageInput
                name={WhitelabelNftFormField.previewImage}
                selectedPlaceholder="Thumbnail Image"
                formik={formik}
              >
                Upload Your Thumbnail Image
              </UploadImageInput>
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <UploadImageInput
                name={WhitelabelNftFormField.concealImage}
                selectedPlaceholder="Conceal Image"
                color={darkColors.primaryDark}
                formik={formik}
              >
                Upload Your Conceal Image
              </UploadImageInput>
            </Grid>
          </Grid>
          <HelperText>NB: If you don&#39;t upload the images, we will set it as default image</HelperText>
        </Grid>
        <Grid item xs={12} lg={6}>
          <InputField
            label="NFT Collection Name"
            name={WhitelabelNftFormField.name}
            placeholder="e.g. Summit NFT"
            formik={formik}
          />
          <InputField
            label="NFT Collection Symbol"
            name={WhitelabelNftFormField.symbol}
            placeholder="e.g. SFT"
            formik={formik}
          />
          <InputField
            label="NFT Conceal Name (optional)"
            name={WhitelabelNftFormField.concealName}
            placeholder="e.g. Unknown Summit"
            helperText="This name will be shown when you haven’t revealed your collection"
            formik={formik}
          />
        </Grid>
      </Grid>

      <br />
      <br />

      <Heading size="lg" fontFamily="Poppins" marginBottom="16px">
        Collection Price
      </Heading>

      <Grid container spacing="16px">
        <Grid item xs={12} lg={6}>
          <Heading size="md" color="sidebarActiveColor" marginBottom="8px">
            Whitelist Mint Price
          </Heading>
          <DescriptionText>Whitelist Mint Price is the NFT mint price when it’s on whitelist phase</DescriptionText>

          <CurrencyInput
            label="Whitelist Mint Price"
            name={WhitelabelNftFormField.whitelistMintPrice}
            placeholder="e.g. 10"
            formik={formik}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Heading size="md" color="sidebarActiveColor" marginBottom="8px">
            Public Mint Price
          </Heading>
          <DescriptionText>Public Mint Price is the NFT mint price when it’s on public phase</DescriptionText>

          <CurrencyInput
            label="Public Mint Price"
            name={WhitelabelNftFormField.publicMintPrice}
            placeholder="e.g. 10"
            formik={formik}
          />
        </Grid>
      </Grid>

      <br />
      <br />

      <Flex justifyContent="flex-end">
        <NavStepButton variant="tertiary" onClick={handleNextPage} endIcon={<ArrowForwardIcon width={24} />}>
          <b>Next Step</b>
        </NavStepButton>
      </Flex>
    </>
  )
}

export default React.memo(CreationStep01)
