import { ArrowBackIcon, ArrowForwardIcon, Button, ExchangeIcon } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { FormikProps } from 'formik'
import React, { useCallback, useState } from 'react'
import { WhitelabelNft, WhitelabelNftFormField } from 'types/whitelabelNft'
import { NavStepButton } from '../shared/Button'
import Divider from '../shared/Divider'
import SpreadsheetInfoBox from './SpreadsheetInfoBox'
import UploadNftImages from './UploadNftImages'
import UploadNftMetadata from './UploadNftMetadata'

type Props = {
  setCurrentCreationStep: React.Dispatch<React.SetStateAction<number>>
  formik: FormikProps<WhitelabelNft>
}

function CreationStep02({ setCurrentCreationStep, formik }: Props) {
  const [isValid, setIsValid] = useState(false)

  const handleOnClickValidate = useCallback(() => {
    console.log('a')
  }, [])

  const handleNextPage = useCallback(async () => {
    const errors = await formik.validateForm()
    formik.setFieldTouched(WhitelabelNftFormField.nftImages, true, true)
    formik.setFieldTouched(WhitelabelNftFormField.spreadsheet, true, true)

    if (
      !Object.keys(errors).includes(WhitelabelNftFormField.nftImages) &&
      !Object.keys(errors).includes(WhitelabelNftFormField.spreadsheet)
    ) {
      setCurrentCreationStep((prev) => prev + 1)
    }
  }, [formik, setCurrentCreationStep])

  return (
    <>
      <Grid container spacing="32px" marginBottom="72px">
        <Grid item xs={12} lg={5.15}>
          <SpreadsheetInfoBox />
        </Grid>
        <Grid item xs={12} lg={6.85}>
          <UploadNftImages name={WhitelabelNftFormField.nftImages} formik={formik} />
          <UploadNftMetadata name={WhitelabelNftFormField.spreadsheet} formik={formik} />

          <Divider />

          <Button startIcon={<ExchangeIcon color="default" />} onClick={handleOnClickValidate}>
            Validate NFT Collection
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing="16px">
        <Grid item xs={12} lg={6}>
          <NavStepButton
            variant="secondary"
            onClick={() => setCurrentCreationStep((prev) => prev - 1)}
            startIcon={<ArrowBackIcon width={24} />}
          >
            <b>Previous Step</b>
          </NavStepButton>
        </Grid>
        <Grid item xs={12} lg={6} display="flex" justifyContent="flex-end">
          <NavStepButton variant="tertiary" onClick={handleNextPage} endIcon={<ArrowForwardIcon width={24} />}>
            <b>Next Step</b>
          </NavStepButton>
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(CreationStep02)
