import {
  Button,
  EditIcon,
  EtherIcon,
  Flex,
  Heading,
  LockIcon,
  Text,
  useModal,
  useWalletModal,
  WalletIcon,
} from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { Phase } from 'constants/whitelabel'
import { formatUnits, parseEther } from 'ethers/lib/utils'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { UseQueryResult } from 'react-query'
import styled from 'styled-components'
import {
  WhitelabelMintDto,
  WhitelabelNftCollectionGql,
  WhitelabelNftMintField,
  WhitelabelSignatureResult,
} from 'types/whitelabelNft'
import login from 'utils/login'
import { mintCollectionValidationSchema } from '../CreateCollection/validation'
import InputField from '../shared/InputField'
import { HelperText, StockText } from '../shared/Text'
import EditMintPriceModal from './EditMintPriceModal'
import MintSummaryModal from './MintSummaryModal'

type MintSectionProps = {
  isOwner: boolean
  totalSupply: number
  whitelabelNft: UseQueryResult<WhitelabelNftCollectionGql | undefined>
  whitelabelNftApiSignature: UseQueryResult<WhitelabelSignatureResult | undefined>
  setMintedMessage: React.Dispatch<React.SetStateAction<string>>
  scrollToMintMessage: () => void
}

const MinterWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.inputColor};
  padding: 8px 16px;
  border-left: 8px solid ${({ theme }) => theme.colors.linkColor};
`

const ActionButtonWrapper = styled(Flex)`
  column-gap: 8px;

  @media (max-width: 576px) {
    flex-direction: column;
    row-gap: 8px;
  }
`

function MintSection({
  isOwner,
  totalSupply,
  whitelabelNft,
  whitelabelNftApiSignature,
  setMintedMessage,
  scrollToMintMessage,
}: MintSectionProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const mintPrice = useMemo(() => {
    let price = whitelabelNft.data?.publicMintPrice?.toString()
    if (whitelabelNft.data?.phase === Phase.Whitelist) {
      price = whitelabelNft.data?.whitelistMintPrice?.toString()
    }
    return parseEther(price ? price.toString() : '0')
  }, [whitelabelNft.data?.publicMintPrice, whitelabelNft.data?.whitelistMintPrice, whitelabelNft.data?.phase])

  const phase = useMemo(() => {
    return whitelabelNft.data?.phase || Phase.Pause
  }, [whitelabelNft.data?.phase])

  const stock = useMemo(() => {
    if (!whitelabelNft.data?.maxSupply) return 0
    return whitelabelNft.data.maxSupply.minus(totalSupply).toNumber()
  }, [whitelabelNft.data?.maxSupply, totalSupply])

  const isWhitelisted = useMemo(() => {
    return whitelabelNftApiSignature.data?.signature
  }, [whitelabelNftApiSignature.data?.signature])

  const canMint = useMemo(() => {
    return isWhitelisted || phase === Phase.Public
  }, [isWhitelisted, phase])

  const formik: FormikProps<WhitelabelMintDto> = useFormik<WhitelabelMintDto>({
    enableReinitialize: true,
    initialValues: { mintQuantity: 1 },
    validationSchema: mintCollectionValidationSchema,
    onSubmit: async () => null,
  })

  const handleMintQuantityChanged = useCallback(
    (value: string) => {
      if (value !== '' && value.match('^[0-9]*$') == null) return
      if (Number(value) > stock) return
      formik.setFieldValue(WhitelabelNftMintField.mintQuantity, value)
    },
    [formik, stock]
  )

  const [onPresentMintModal] = useModal(
    <MintSummaryModal
      whitelabelNft={whitelabelNft}
      mintPrice={mintPrice}
      quantity={formik.values.mintQuantity}
      whitelabelNftApiSignature={whitelabelNftApiSignature}
      setMintedMessage={setMintedMessage}
      scrollToMintMessage={scrollToMintMessage}
    />
  )
  const [onPresentEditMintModal] = useModal(<EditMintPriceModal whitelabelNft={whitelabelNft} />)

  return (
    <>
      <Heading color="linkColor" marginBottom={isMobileView ? '8px' : '16px'}>
        Mint NFT
      </Heading>
      <Flex flexDirection="row" marginBottom="16px">
        <MinterWrapper>
          <Text fontSize={isMobileView ? '14px' : '16px'} marginRight="24px">
            Mint Price
          </Text>
          <EtherIcon color="linkColor" />
          <Text color="linkColor" bold fontSize={isMobileView ? '14px' : '16px'}>
            {formatUnits(mintPrice, 18)}
          </Text>
        </MinterWrapper>
      </Flex>
      {phase === Phase.Pause ? (
        <HelperText fontSize={isMobileView ? '12px' : '14px'}>
          This NFT Collection is still on paused phase. Please wait for minting phase
        </HelperText>
      ) : !account ? (
        <>
          <Button
            scale="sm"
            variant="awesome"
            startIcon={<WalletIcon color="default" />}
            style={{ fontFamily: 'Poppins' }}
            onClick={onPresentConnectModal}
            marginBottom="4px"
          >
            Connect My Wallet
          </Button>
          <StockText>{stock}</StockText>
        </>
      ) : (
        <FormikProvider value={formik}>
          <Grid container>
            <Grid item xs={12} md={5}>
              <InputField
                label="Mint Quantity"
                name={WhitelabelNftMintField.mintQuantity}
                placeholder="Input how many NFT to mint"
                formik={formik}
                onChange={handleMintQuantityChanged}
                helperText={<StockText>{stock}</StockText>}
              />
            </Grid>
          </Grid>
          <ActionButtonWrapper>
            <Button
              scale="sm"
              startIcon={!canMint && <LockIcon width={12} color="textDisabled" />}
              variant={canMint && stock !== 0 ? 'primary' : 'awesome'}
              disabled={!canMint || stock === 0}
              onClick={onPresentMintModal}
            >
              {canMint ? 'Mint NFT Collection' : 'You are not in whitelist'}
            </Button>
            {isOwner && (
              <Button scale="sm" variant="tertiary" startIcon={<EditIcon />} onClick={onPresentEditMintModal}>
                Edit Mint Price
              </Button>
            )}
          </ActionButtonWrapper>
        </FormikProvider>
      )}
    </>
  )
}

export default React.memo(MintSection)
