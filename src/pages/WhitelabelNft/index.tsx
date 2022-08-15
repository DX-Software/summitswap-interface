import { Button, Input } from '@koda-finance/summitswap-uikit'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { convertFileToBase64 } from 'utils/convertFileToBase64'
import parseMetadata from './spreadsheet'

const NftImagePreview = styled.img`
  width: 200px;
  height: auto;
`

export default function WhitelabelNft({ children }) {
  const [nftImages, setNftImages] = useState<NftImage[]>([])
  const [spreadsheet, setSpreadsheet] = useState<ArrayBuffer>()

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

  const handleSpreadSheetOnChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const data = await file.arrayBuffer()
      setSpreadsheet(data)
    }
  }, [])

  const handleApply = useCallback(async () => {
    if (spreadsheet) {
      const metadata = parseMetadata(spreadsheet, nftImages)
      console.log(metadata)
    }
  }, [spreadsheet, nftImages])

  const formik: FormikProps<WhitelabelFormValues> = useFormik<WhitelabelFormValues>({
    initialValues: {
      spreadsheet: undefined,
      images: [],
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(false)
    },
  })

  return (
    <div className="main-content">
      <FormikProvider value={formik}>
        <Input type="file" name="images" scale="md" multiple accept="image/*" onChange={handleImageOnChange} />
        <Input
          type="file"
          name="spreadsheet"
          scale="md"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleSpreadSheetOnChange}
        />

        <Button onClick={handleApply}>Apply</Button>

        {nftImages.map((image) => (
          <NftImagePreview src={image.base64} key={image.id} />
        ))}
      </FormikProvider>
    </div>
  )
}
