import { Box, darkColors, Flex, ImageAddIcon, Text } from '@koda-finance/summitswap-uikit'
import { FormikProps, FormikValues } from 'formik'
import React from 'react'
import { HelperText, SubTitle } from '../shared/Text'
import DragAndDrop from './DragAndDrop'

type Props = {
  setCurrentCreationStep: React.Dispatch<React.SetStateAction<number>>
  formik: FormikProps<FormikValues>
}

function CreationStep01({ setCurrentCreationStep, formik }: Props) {
  return (
    <>
      <SubTitle>Collection Details</SubTitle>
      <Flex style={{ marginBottom: 12 }}>
        <DragAndDrop
          name="images"
          accept="image/*"
          multiple
          handleChange={() => null}
          icon={<ImageAddIcon width={74} />}
        >
          Upload Your Thumbnail Image
        </DragAndDrop>
        <Box marginRight={16} />
        <DragAndDrop
          name="spreadsheet"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          // handleChange={handleSpreadsheetOnChange}
          handleChange={() => null}
          color={darkColors.primaryDark}
          icon={<ImageAddIcon width={74} color={darkColors.primaryDark} />}
        >
          Upload Your Conceal Image
        </DragAndDrop>
      </Flex>
      <HelperText>NB : If you don&#39;t upload the images, we will set it as default image</HelperText>
    </>
  )
}

export default React.memo(CreationStep01)
