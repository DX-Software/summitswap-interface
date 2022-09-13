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
  formik: FormikProps<WhitelabelNft>
}

function UploadNftMetadata({ formik }: Props) {
  const inputFileElement = useRef<HTMLInputElement>(null)
  const [spreadsheet, setSpreadsheet] = useState<File>()

  const handleSpreadsheetOnChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setSpreadsheet(file)
    }
  }, [])

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
      {spreadsheet ? (
        <Flex alignItems="center" marginBottom="24px">
          <SpreadsheetIconWrapper marginRight="8px">
            <SpreadsheetIcon width={24} color="default" />
          </SpreadsheetIconWrapper>
          <SpreadsheetName>{spreadsheet.name}</SpreadsheetName>
          <CloseIcon cursor="pointer" width={24} color="failure" marginLeft="24px" />
        </Flex>
      ) : (
        <Button
          variant={spreadsheet ? 'secondary' : 'awesome'}
          startIcon={<UploadIcon color={spreadsheet ? 'primary' : 'default'} />}
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
