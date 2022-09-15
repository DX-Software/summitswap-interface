import { Flex, Heading, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useUploadImageApi } from 'api/useUploadImageApi'
import {
  useWhitelabelNftApiCollectionUpsert,
  useWhitelabelNftApiUploadConceal,
  useWhitelabelNftApiUploadMetadata,
} from 'api/useWhitelabelNftApi'
import { INITIAL_WHITELABEL_CREATION, Phase } from 'constants/whitelabel'
import { parseEther } from 'ethers/lib/utils'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import { useWhitelabelFactoryContract } from 'hooks/useContract'
import React, { useState } from 'react'
import { TokenInfo, WhitelabelNft, WhitelabelNftTxReceipt } from 'types/whitelabelNft'
import {
  convertImageUrlToFile,
  getConcealImageUrl,
  getDefaultConcealName,
  getPreviewImageUrl,
} from 'utils/whitelabelNft'
import ConnectWalletSection from '../shared/ConnectWalletSection'
import Divider from '../shared/Divider'
import CreationStep01 from './CreationStep01'
import CreationStep02 from './CreationStep02'
import CreationStep03 from './CreationStep03'
import validationSchema from './validation'

function CreateCollection() {
  const { account } = useWeb3React()
  const [currentCreationStep, setCurrentCreationStep] = useState(0)

  const whitelabelNftApiUpload = useWhitelabelNftApiUploadMetadata()
  const whitelabelNftApiUploadConceal = useWhitelabelNftApiUploadConceal()
  const whitelabelFactoryContract = useWhitelabelFactoryContract()
  const whitelabelNftApiCollectionUpsert = useWhitelabelNftApiCollectionUpsert()
  const uploadImageApi = useUploadImageApi()

  const formik: FormikProps<WhitelabelNft> = useFormik<WhitelabelNft>({
    enableReinitialize: true,
    initialValues: INITIAL_WHITELABEL_CREATION,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const metadataResult = await whitelabelNftApiUpload.mutateAsync({
        walletAddress: account!,
        spreadsheet: formik.values.spreadsheet!,
        nftImages: formik.values.nftImages,
      })

      let previewImageUrl = getPreviewImageUrl()
      if (values.previewImage) {
        const res = await uploadImageApi.mutateAsync(values.previewImage)
        previewImageUrl = res.url
      }

      const concealResult = await whitelabelNftApiUploadConceal.mutateAsync({
        image: values.concealImage || (await convertImageUrlToFile(getConcealImageUrl(), 'conceal.png')),
        concealName: values.concealName || getDefaultConcealName(values.name),
      })

      const { rootCid: concealRootCid } = concealResult
      const baseUrl = `ipfs://${concealRootCid}/`
      const tokenInfo: TokenInfo = {
        name: values.name,
        symbol: values.symbol,
        previewImageUrl,
        maxSupply: values.nftImages.length,
        whitelistMintPrice: parseEther(values.whitelistMintPrice).toString(),
        publicMintPrice: parseEther(values.publicMintPrice).toString(),
        phase: Phase.Pause,
        isReveal: false,
      }

      const serviceFee = await whitelabelFactoryContract?.serviceFee()
      const tx = await whitelabelFactoryContract?.createNft(tokenInfo, baseUrl, {
        value: serviceFee,
      })
      const txReceipt = (await tx.wait()) as WhitelabelNftTxReceipt
      const { events } = txReceipt
      const createNftEvent = events.find((e) => e.event === 'CreateNft')
      const whitelabelNftAddress = createNftEvent!.args.nftAddress

      await whitelabelNftApiCollectionUpsert.mutateAsync({
        baseUrl: metadataResult.rootCid,
        whitelabelNftAddress,
      })

      setSubmitting(false)
    },
  })

  const steps = [
    {
      label: 'Collection Details',
      component: <CreationStep01 setCurrentCreationStep={setCurrentCreationStep} formik={formik} />,
    },
    {
      label: 'Defined NFTs',
      component: <CreationStep02 setCurrentCreationStep={setCurrentCreationStep} formik={formik} />,
    },
    {
      label: 'Summary',
      component: <CreationStep03 setCurrentCreationStep={setCurrentCreationStep} formik={formik} />,
    },
  ]

  if (!account) {
    return <ConnectWalletSection />
  }

  return (
    <Flex flexDirection="column">
      <Text color="textSubtle" marginBottom="4px">
        Step{' '}
        <Text color="linkColor" bold style={{ display: 'inline-block' }}>
          0{currentCreationStep + 1}
        </Text>{' '}
        of 03 - {steps[currentCreationStep].label}
      </Text>
      <Heading size="xl" marginBottom="16px">
        Create NFT Collection
      </Heading>
      <Divider />
      <FormikProvider value={formik}>{steps[currentCreationStep].component}</FormikProvider>
    </Flex>
  )
}

export default React.memo(CreateCollection)
