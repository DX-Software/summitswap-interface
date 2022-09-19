import {
  Button,
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
import { useWhitelabelNftApiSignature } from 'api/useWhitelabelNftApi'
import { Phase } from 'constants/whitelabel'
import { BigNumber } from 'ethers'
import { formatUnits, parseEther } from 'ethers/lib/utils'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useCallback, useMemo } from 'react'
import { UseQueryResult } from 'react-query'
import styled from 'styled-components'
import { WhitelabelMintDto, WhitelabelNftGql, WhitelabelNftMintField } from 'types/whitelabelNft'
import login from 'utils/login'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import { mintCollectionValidationSchema } from '../CreateCollection/validation'
import InputField from '../shared/InputField'
import { HelperText, StockText } from '../shared/Text'
import MintSummaryModal from './MintSummaryModal'

type MintSectionProps = {
  whitelabelNft: UseQueryResult<WhitelabelNftGql | undefined>
}

const MinterWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.inputColor};
  padding: 8px 16px;
  border-left: 8px solid ${({ theme }) => theme.colors.linkColor};
`

function MintSection({ whitelabelNft }: MintSectionProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { account, activate, deactivate } = useWeb3React()
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNftId)

  const whitelabelNftApiSignature = useWhitelabelNftApiSignature(
    whitelabelNft.data?.owner?.id || '',
    whitelabelNftId || '',
    account || ''
  )

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const mintPrice = useMemo(() => {
    let price = whitelabelNft.data?.publicMintPrice?.toNumber()
    if (whitelabelNft.data?.phase === Phase.Whitelist) {
      price = whitelabelNft.data?.whitelistMintPrice?.toNumber()
    }
    return parseEther(price ? price.toString() : '0')
  }, [whitelabelNft.data])

  const phase = useMemo(() => {
    return whitelabelNft.data?.phase || Phase.Pause
  }, [whitelabelNft.data?.phase])

  const stock = 25

  const isWhitelisted = useMemo(() => {
    return whitelabelNftApiSignature.data?.data.signature
  }, [whitelabelNftApiSignature.data?.data.signature])

  const canMint = useMemo(() => {
    return isWhitelisted || phase === Phase.Public
  }, [isWhitelisted, phase])

  const formik: FormikProps<WhitelabelMintDto> = useFormik<WhitelabelMintDto>({
    enableReinitialize: true,
    initialValues: { mintQuantity: 1 },
    validationSchema: mintCollectionValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!whitelabelNftContract || !account || !whitelabelNftApiSignature.data) {
        return
      }
      setSubmitting(true)

      const nftOwner = await whitelabelNftContract.owner()
      const tokenInfo = await whitelabelNftContract.tokenInfo()
      const { phase: tokenInfoPhase, whitelistMintPrice, publicMintPrice } = tokenInfo
      const price = tokenInfoPhase === Phase.Whitelist ? whitelistMintPrice : publicMintPrice
      const mintMethod = tokenInfoPhase === Phase.Whitelist ? 'mint(uint256,bytes)' : 'mint(uint256)'
      const args: (number | string)[] = [values.mintQuantity]
      if (tokenInfoPhase === Phase.Whitelist) {
        args.push(whitelabelNftApiSignature.data.data.signature)
      }

      await whitelabelNftContract[mintMethod](...args, {
        value: account === nftOwner ? 0 : BigNumber.from(price).mul(values.mintQuantity),
      })

      setSubmitting(false)
    },
  })

  const handleMintQuantityChanged = useCallback(
    (value: string) => {
      if (value !== '' && value.match('^[0-9]*$') == null) return
      formik.setFieldValue(WhitelabelNftMintField.mintQuantity, value)
    },
    [formik]
  )

  const [onPresentModal] = useModal(
    <MintSummaryModal whitelabelNft={whitelabelNft} mintPrice={mintPrice} formik={formik} />
  )

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
          <Button
            scale="sm"
            startIcon={!canMint && <LockIcon width={12} color="textDisabled" />}
            variant={canMint ? 'primary' : 'awesome'}
            disabled={!canMint}
            onClick={onPresentModal}
          >
            {canMint ? 'Mint NFT Collection' : 'You are not in whitelist'}
          </Button>
        </FormikProvider>
      )}
    </>
  )
}

export default React.memo(MintSection)
