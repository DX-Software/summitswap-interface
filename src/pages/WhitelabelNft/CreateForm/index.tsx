import { Button, Flex } from '@koda-finance/summitswap-uikit'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import { convertFileToBase64 } from 'utils/convertFileToBase64'
import parseMetadata from '../spreadsheet'
import DragAndDrop from './DragAndDrop'

export default function CreateWhitelabelNftForm() {
  const [nftImages, setNftImages] = useState<NftImage[]>([])
  const [spreadsheet, setSpreadsheet] = useState<ArrayBuffer>()
  const [nftMetadata, setNftMetadata] = useState<MetadataJson[]>([])

  const handleImageOnChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const base64images = await Promise.all(files.map((file) => convertFileToBase64(file)))
      const nftImagesTemp = files.map((file, index) => ({
        id: Number(file.name.split('.')[0]),
        base64: String(base64images[index]),
      }))
      setNftImages(nftImagesTemp)
    }
  }, [])

  const handleSpreadsheetOnChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const data = await file.arrayBuffer()
      setSpreadsheet(data)
    }
  }, [])

  const handleApply = useCallback(async () => {
    if (spreadsheet) {
      const parsedMetadata = parseMetadata(spreadsheet, nftImages)
      setNftMetadata(parsedMetadata)
    }
  }, [spreadsheet, nftImages])

  const formik: FormikProps<WhitelabelFormValues> = useFormik<WhitelabelFormValues>({
    initialValues: {
      metadata: [],
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(false)
    },
  })

  return (
    <div className="main-content">
      <FormikProvider value={formik}>
        <Flex flexDirection="column">
          <Flex justifyContent="space-around">
            <DragAndDrop name="images" accept="image/*" multiple handleChange={handleImageOnChange}>
              Drag and Drop your NFT images here
            </DragAndDrop>
            <DragAndDrop
              name="spreadsheet"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              handleChange={handleSpreadsheetOnChange}
            >
              Upload your metadata spreadsheet here
            </DragAndDrop>
          </Flex>
          <Button marginX="auto" marginTop={3} onClick={handleApply}>
            Apply
          </Button>
        </Flex>
      </FormikProvider>
    </div>
  )
}
