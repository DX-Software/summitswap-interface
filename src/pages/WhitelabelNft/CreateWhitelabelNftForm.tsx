import { Button, Flex, Input, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftApiUpload } from 'api/useWhitelabelNftApi'
import { INITIAL_PROJECT_CREATION } from 'constants/whitelabel'
import { Field, FormikProps, FormikProvider, useFormik } from 'formik'
import { useWhitelabelFactoryContract } from 'hooks/useContract'
import React, { useCallback, useState } from 'react'
import { WhitelabelNft } from 'types/whitelabelNft'
// import { WhitelabelFormField, WhitelabelNftTokenInfo } from './types'
// import DragAndDrop from './CreateCollection/DragAndDrop'

// const NftCardPreview = ({ nftMetadata }: { nftMetadata: NftMetadata }) => {
//   return (
//     <Flex>
//       <Image src={nftMetadata.image} width={100} height={100} />
//       <Flex flexDirection="column">
//         <Text>Name: {nftMetadata.name}</Text>
//         <Text>Description: {nftMetadata.description}</Text>
//       </Flex>
//     </Flex>
//   )
// }

export default function CreateWhitelabelNftForm() {
  const [nftImages, setNftImages] = useState<File[]>([])
  const [spreadsheet, setSpreadsheet] = useState<File>()

  const whitelabelNftApiUpload = useWhitelabelNftApiUpload()
  const whitelabelFactoryContract = useWhitelabelFactoryContract()
  const { account } = useWeb3React()

  const handleImageOnChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setNftImages(files)
    }
  }, [])

  const handleSpreadsheetOnChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setSpreadsheet(file)
    }
  }, [])

  const formik: FormikProps<WhitelabelNft> = useFormik<WhitelabelNft>({
    initialValues: INITIAL_PROJECT_CREATION,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      // const result = await whitelabelNftApiUpload.mutateAsync({
      //   walletAddress: account!,
      //   spreadsheet: spreadsheet!,
      //   nftImages,
      // })
      // const { rootCid, totalNft } = result
      // const tokenInfo: WhitelabelNftTokenInfo = { ...values, maxSupply: totalNft.toString() }
      // const baseUrl = `ipfs://${rootCid}`
      // const serviceFee = await whitelabelFactoryContract?.serviceFee()
      // await whitelabelFactoryContract?.createNft(tokenInfo, baseUrl, {
      //   value: serviceFee,
      // })
      // setSubmitting(false)
    },
  })

  return (
    <div className="main-content">
      <FormikProvider value={formik}>
        <Flex flexDirection="column">
          <Text>Name</Text>
          <Input
            name="name"
            placeholder="Name"
            onChange={formik.handleChange}
            style={{ marginBottom: 12 }}
            as={Field}
          />
          <Text>Symbol</Text>
          <Input
            name="symbol"
            placeholder="Symbol"
            onChange={formik.handleChange}
            style={{ marginBottom: 12 }}
            as={Field}
          />
          <Text>Whitelist Mint Price</Text>
          <Input
            name="whitelistMintPrice"
            placeholder="Whitelist Mint Price"
            onChange={formik.handleChange}
            style={{ marginBottom: 12 }}
            as={Field}
          />
          <Text>Public Mint Price</Text>
          <Input
            name="publicMintPrice"
            placeholder="Public Mint Price"
            onChange={formik.handleChange}
            style={{ marginBottom: 12 }}
            as={Field}
          />
          <Flex justifyContent="space-around" style={{ marginBottom: 12 }}>
            {/* <DragAndDrop name="images" accept="image/*" multiple handleChange={handleImageOnChange}>
              {nftImages.length > 0 ? `${nftImages.length} images selected` : 'Drag and Drop your NFT images here'}
            </DragAndDrop>
            <DragAndDrop
              name="spreadsheet"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              handleChange={handleSpreadsheetOnChange}
            >
              {spreadsheet ? 'Spreadsheet selected' : 'Upload your metadata spreadsheet here'}
            </DragAndDrop> */}
          </Flex>
          <Button marginX="auto" onClick={formik.submitForm}>
            Submit
          </Button>
        </Flex>
      </FormikProvider>
    </div>
  )
}
