import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Box,
  Button,
  darkColors,
  ExchangeIcon,
  Text,
} from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useWhitelabelNftApiValidate } from 'api/useWhitelabelNftApi'
import { FormikProps } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { WhitelabelNft, WhitelabelNftFormField } from 'types/whitelabelNft'
import { NavStepButton } from '../shared/Button'
import Divider from '../shared/Divider'
import SpreadsheetInfoBox from './SpreadsheetInfoBox'
import UploadNftImages from './UploadNftImages'
import UploadNftMetadata from './UploadNftMetadata'
import ValidationMessageAlert from './ValidationMessageAlert'

type Props = {
  setCurrentCreationStep: React.Dispatch<React.SetStateAction<number>>
  formik: FormikProps<WhitelabelNft>
}

function CreationStep02({ setCurrentCreationStep, formik }: Props) {
  const whitelabelNftApiValidate = useWhitelabelNftApiValidate()

  const [isValidated, setIsValidated] = useState(false)
  const [validatedMessage, setValidatedMessage] = useState('')
  const [validatedError, setValidatedError] = useState<string[]>([])

  const isValidateDisabled = useMemo(() => {
    if (formik.values.nftImages && formik.values.spreadsheet) {
      return false
    }
    return true
  }, [formik.values.nftImages, formik.values.spreadsheet])

  const hasFormFilled = useCallback(async () => {
    const errors = await formik.validateForm()
    formik.setFieldTouched(WhitelabelNftFormField.nftImages, true, true)
    formik.setFieldTouched(WhitelabelNftFormField.spreadsheet, true, true)

    if (
      !Object.keys(errors).includes(WhitelabelNftFormField.nftImages) &&
      !Object.keys(errors).includes(WhitelabelNftFormField.spreadsheet)
    ) {
      return true
    }
    return false
  }, [formik])

  const handleOnClickValidate = useCallback(async () => {
    try {
      if (!(await hasFormFilled())) return
      setValidatedMessage('')
      setValidatedError([])
      setIsValidated(false)

      const res = await whitelabelNftApiValidate.mutateAsync({
        spreadsheet: formik.values.spreadsheet!,
        nftImages: formik.values.nftImages,
      })
      if (res.status === 201) {
        setValidatedMessage(res.data.message)
        setIsValidated(true)
      }
    } catch (error: any) {
      const errorData = error.response.data
      setValidatedMessage(errorData.error)
      setValidatedError(errorData.message)
    }
  }, [hasFormFilled, formik.values.spreadsheet, formik.values.nftImages, whitelabelNftApiValidate])

  const handleNextPage = useCallback(async () => {
    if ((await hasFormFilled()) && isValidated) {
      setCurrentCreationStep((prev) => prev + 1)
    }
  }, [hasFormFilled, setCurrentCreationStep, isValidated])

  useEffect(() => {
    setValidatedMessage('')
    setValidatedError([])
    setIsValidated(false)
  }, [formik.values.nftImages, formik.values.spreadsheet])

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

          <Button
            variant={isValidateDisabled ? 'awesome' : 'primary'}
            startIcon={<ExchangeIcon color="default" />}
            onClick={handleOnClickValidate}
            disabled={isValidateDisabled}
          >
            Validate NFT Collection
          </Button>
          {validatedMessage && (
            <ValidationMessageAlert isSuccess={validatedError.length === 0} errors={validatedError}>
              {validatedMessage}
            </ValidationMessageAlert>
          )}
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
          <NavStepButton
            variant="tertiary"
            onClick={handleNextPage}
            endIcon={<ArrowForwardIcon width={24} />}
            disabled={!isValidated}
          >
            <b>Next Step</b>
          </NavStepButton>
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(CreationStep02)
