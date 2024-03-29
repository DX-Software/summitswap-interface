import { Flex, Heading, Text, useModal } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useUploadImageApi } from 'api/useUploadImageApi'
import useWalletLogin from 'api/useWalletLoginApi'
import {
  useWhitelabelNftApiCollectionUpsert,
  useWhitelabelNftApiUploadConceal,
  useWhitelabelNftApiUploadMetadata,
} from 'api/useWhitelabelNftApi'
import { INITIAL_WHITELABEL_CREATION, Phase } from 'constants/whitelabel'
import { parseEther } from 'ethers/lib/utils'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import { useWhitelabelFactoryContract } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import { TokenInfo, WhitelabelNft, WhitelabelNftTxReceipt } from 'types/whitelabelNft'
import { convertImageUrlToFile } from 'utils/converter'
import { getConcealImageUrl, getDefaultConcealName, getPreviewImageUrl } from 'utils/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import ConnectWalletSection from '../shared/ConnectWalletSection'
import Divider from '../shared/Divider'
import CreatedNftModal from './CreatedNftModal'
import CreationStep01 from './CreationStep01'
import CreationStep02 from './CreationStep02'
import CreationStep03 from './CreationStep03'
import { createCollectionValidationSchema } from './validation'

function CreateCollection() {
  const { account, library } = useWeb3React()
  const { canCreate, setActiveTab } = useWhitelabelNftContext()
  const [currentCreationStep, setCurrentCreationStep] = useState(0)

  const [onPresentCreatedModal] = useModal(<CreatedNftModal />)

  const walletLogin = useWalletLogin()
  const whitelabelNftApiUpload = useWhitelabelNftApiUploadMetadata()
  const whitelabelNftApiUploadConceal = useWhitelabelNftApiUploadConceal()
  const whitelabelFactoryContract = useWhitelabelFactoryContract()
  const whitelabelNftApiCollectionUpsert = useWhitelabelNftApiCollectionUpsert()
  const uploadImageApi = useUploadImageApi()

  const formik: FormikProps<WhitelabelNft> = useFormik<WhitelabelNft>({
    enableReinitialize: true,
    initialValues: INITIAL_WHITELABEL_CREATION,
    validationSchema: createCollectionValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!account || !values.spreadsheet) return

      const accessToken = await walletLogin.mutateAsync({
        account: account!,
        library,
      })
      if (!accessToken) return

      const metadataResult = await whitelabelNftApiUpload.mutateAsync({
        walletAddress: account,
        spreadsheet: values.spreadsheet,
        nftImages: values.nftImages,
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
        description: values.description,
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
        baseUrl: `ipfs://${metadataResult.rootCid}/`,
        whitelabelNftAddress,
      })

      setSubmitting(false)
      onPresentCreatedModal()
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

  useEffect(() => {
    if (!canCreate) {
      setActiveTab(0)
    }
  }, [canCreate, setActiveTab])

  return (
    <Flex flexDirection="column">
      {account && (
        <Text color="textSubtle" marginBottom="4px">
          Step{' '}
          <Text color="linkColor" bold style={{ display: 'inline-block' }}>
            0{currentCreationStep + 1}
          </Text>{' '}
          of 03 - {steps[currentCreationStep].label}
        </Text>
      )}
      <Heading size="xl" marginBottom="16px">
        Create NFT Collection
      </Heading>
      <Divider />
      {account ? (
        <FormikProvider value={formik}>{steps[currentCreationStep].component}</FormikProvider>
      ) : (
        <ConnectWalletSection />
      )}
    </Flex>
  )
}

export default React.memo(CreateCollection)
