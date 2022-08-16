import { Button, Flex, Image, Input, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import { convertFileToBase64 } from 'utils/convertFileToBase64'
import parseMetadata from '../spreadsheet'
import DragAndDrop from './DragAndDrop'

const NftCardPreview = ({ nftMetadata }: { nftMetadata: MetadataJson }) => {
  return (
    <Flex>
      <Image src={nftMetadata.image} width={100} height={100} />
      <Flex flexDirection="column">
        <Text>Name: {nftMetadata.name}</Text>
        <Text>Description: {nftMetadata.description}</Text>
      </Flex>
    </Flex>
  )
}

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
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Flex flexDirection="column">
              <Input name="name" placeholder="Name" onChange={formik.handleChange} style={{ marginBottom: 12 }} />
              <Input name="symbol" placeholder="Symbol" onChange={formik.handleChange} style={{ marginBottom: 12 }} />
              <Input
                name="maxSupply"
                placeholder="Max Supply"
                onChange={formik.handleChange}
                style={{ marginBottom: 12 }}
              />
              <Input
                name="whitelistMintPrice"
                placeholder="Whitelist Mint Price"
                onChange={formik.handleChange}
                style={{ marginBottom: 12 }}
              />
              <Input
                name="publicMintPrice"
                placeholder="Public Mint Price"
                onChange={formik.handleChange}
                style={{ marginBottom: 12 }}
              />
              <Input
                name="signer"
                placeholder="Signer Address"
                onChange={formik.handleChange}
                style={{ marginBottom: 12 }}
              />
              <Flex justifyContent="space-between" style={{ marginBottom: 12 }}>
                <DragAndDrop name="images" accept="image/*" multiple handleChange={handleImageOnChange}>
                  {nftImages.length > 0 ? `${nftImages.length} images selected` : 'Drag and Drop your NFT images here'}
                </DragAndDrop>
                <DragAndDrop
                  name="spreadsheet"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  handleChange={handleSpreadsheetOnChange}
                >
                  {spreadsheet ? 'Spreadsheet selected' : 'Upload your metadata spreadsheet here'}
                </DragAndDrop>
              </Flex>
              <Button marginX="auto" onClick={handleApply}>
                Apply
              </Button>
            </Flex>
          </Grid>
          <Grid item xs={4}>
            <Text>NFT Preview</Text>
            {nftMetadata.map((nftMetadatum) => (
              <NftCardPreview nftMetadata={nftMetadatum} />
            ))}
          </Grid>
        </Grid>
      </FormikProvider>
    </div>
  )
}
