import {
  Box,
  Button,
  CloseIcon,
  Flex,
  Heading,
  SpreadsheetIcon,
  Text,
  UploadIcon,
} from '@koda-finance/summitswap-uikit'
import { FormikProps } from 'formik'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { WhitelabelNft } from 'types/whitelabelNft'
import { HelperText } from '../shared/Text'

const SpreadsheetIconWrapper = styled(Box)`
  background-color: ${({ theme }) => theme.colors.linkColor};
  border-radius: 4px;
  padding: 4px;
`

const SpreadsheetName = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
`

type Props = {
  name: string
  formik: FormikProps<WhitelabelNft>
}

function UploadNftMetadata({ name, formik }: Props) {
  const inputFileElement = useRef<HTMLInputElement>(null)

  const handleSpreadsheetOnChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]
        formik.setFieldValue(name, file)
      }
    },
    [formik, name]
  )

  const handleChooseImages = () => {
    inputFileElement.current?.click()
  }

  return (
    <>
      <Heading size="md" marginBottom="8px">
        Upload the Metadata Sheet
      </Heading>
      <HelperText marginBottom="16px">Upload the metadata sheet that will synchronized with the images</HelperText>

      <input
        ref={inputFileElement}
        type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleSpreadsheetOnChange}
        hidden
      />
      {formik.values.spreadsheet ? (
        <Flex alignItems="center" marginBottom="24px">
          <SpreadsheetIconWrapper marginRight="8px">
            <SpreadsheetIcon width={24} color="default" />
          </SpreadsheetIconWrapper>
          <SpreadsheetName>{formik.values.spreadsheet.name}</SpreadsheetName>
          <CloseIcon cursor="pointer" width={24} color="failure" marginLeft="24px" />
        </Flex>
      ) : (
        <Button
          variant="awesome"
          startIcon={<UploadIcon color="default" />}
          marginBottom="32px"
          onClick={handleChooseImages}
        >
          <b>Upload Metadata Sheet</b>
        </Button>
      )}
    </>
  )
}

export default React.memo(UploadNftMetadata)
