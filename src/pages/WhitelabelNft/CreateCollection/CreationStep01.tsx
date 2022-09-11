import { Box, darkColors, Flex } from '@koda-finance/summitswap-uikit'
import { FormikProps, FormikValues } from 'formik'
import React from 'react'
import { HelperText, SubTitle } from '../shared/Text'
import UploadImageInput from './UploadImageInput'

type Props = {
  setCurrentCreationStep: React.Dispatch<React.SetStateAction<number>>
  formik: FormikProps<FormikValues>
}

function CreationStep01({ setCurrentCreationStep, formik }: Props) {
  return (
    <>
      <SubTitle>Collection Details</SubTitle>
      <Flex style={{ marginBottom: 12 }}>
        <UploadImageInput name="asd" formik={formik}>
          Upload Your Thumbnail Image
        </UploadImageInput>
        <Box marginRight={16} />
        <UploadImageInput name="asdd" color={darkColors.primaryDark} formik={formik}>
          Upload Your Conceal Image
        </UploadImageInput>
      </Flex>
      <HelperText>NB : If you don&#39;t upload the images, we will set it as default image</HelperText>
    </>
  )
}

export default React.memo(CreationStep01)
