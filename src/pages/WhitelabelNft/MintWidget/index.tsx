import {
  Box,
  EtherIcon,
  Flex,
  Heading,
  lightColors,
  LockIcon,
  Text,
  useModal,
  useWalletModal,
  WalletIcon,
} from '@koda-finance/summitswap-uikit'
import { darken, Grid, lighten, useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftApiSignature, useWhitelabelNftCollectionById } from 'api/useWhitelabelNftApi'
import { Phase } from 'constants/whitelabel'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import { useWhitelabelNftContract } from 'hooks/useContract'
import useParsedQueryString from 'hooks/useParsedQueryString'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { TokenInfo, WhitelabelMintDto, WhitelabelNftMintField } from 'types/whitelabelNft'
import login from 'utils/login'
import { mintCollectionValidationSchema } from '../CreateCollection/validation'
import InputField from '../shared/InputField'
import { HelperText } from '../shared/Text'
import MintWidgetSummaryModal from './MintWidgetSummaryModal'
import StyledButton from './StyledButton'
import StyledStockText from './StyledStockText'

const Body = styled.div<{ color: string }>`
  width: 100vw;
  height: 100vh;
  padding: 24px;
  background-color: ${({ color }) => darken(color, 0.9)};
`

const Header = styled(Heading)<{ color: string }>`
  margin-bottom: 16px;
  color: ${({ color }) => lighten(color, 0.2)};

  @media (max-width: 576px) {
    margin-bottom: 8px;
  }
`

const MintMessageWrapper = styled(Box)<{ color: string }>`
  margin-top: 24px;
  margin-bottom: 16px;
  font-size: 16px;
  border-radius: 4px;
  padding: 12px 16px;
  background-color: ${({ color }) => darken(color, 0.5)};

  @media (max-width: 576px) {
    margin-top: 16px;
    font-size: 14px;
  }
`

const MinterWrapper = styled(Flex)<{ color: string }>`
  background-color: ${({ color }) => darken(color, 0.65)};
  padding: 8px 16px;
  border-left: 8px solid ${({ color }) => color};
`

const StyledInputField = styled(InputField)<{ color: string }>`
  > input {
    background: ${({ color }) => darken(color, 0.7)};
  }
  > input:focus {
    box-shadow: 0px 0px 6px ${({ color }) => lighten(color, 0.85)} !important;
  }
`

const ActionButtonWrapper = styled(Flex)`
  column-gap: 8px;

  @media (max-width: 576px) {
    flex-direction: column;
    row-gap: 8px;
  }
`

function MintWidget(props: RouteComponentProps<{ nftAddress: string }>) {
  const {
    match: {
      params: { nftAddress },
    },
  } = props
  const parseQs = useParsedQueryString()
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { account, activate, deactivate } = useWeb3React()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const [totalSupply, setTotalSupply] = useState<BigNumber>(BigNumber.from(0))
  const [mintedMessage, setMintedMessage] = useState('')
  const whitelabelNft = useWhitelabelNftCollectionById(nftAddress)
  const whitelabelNftApiSignature = useWhitelabelNftApiSignature(
    whitelabelNft.data?.owner?.id || '',
    nftAddress || '',
    account || ''
  )
  const whitelabelNftContract = useWhitelabelNftContract(nftAddress)

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const color = useMemo(() => {
    const _color = parseQs.color as string
    if (_color && _color.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/)) {
      return _color
    }
    return lightColors.primary
  }, [parseQs.color])

  const phase = useMemo(() => {
    return tokenInfo?.phase || Phase.Pause
  }, [tokenInfo?.phase])

  const mintPrice = useMemo(() => {
    let price = BigNumber.from(tokenInfo?.publicMintPrice || '0')
    if (tokenInfo?.phase === Phase.Whitelist) {
      price = BigNumber.from(tokenInfo?.whitelistMintPrice || '0')
    }
    return price.toString()
  }, [tokenInfo?.publicMintPrice, tokenInfo?.whitelistMintPrice, tokenInfo?.phase])

  const stock = useMemo(() => {
    if (!tokenInfo?.maxSupply) return 0
    return BigNumber.from(tokenInfo.maxSupply || '0')
      .sub(totalSupply)
      .toNumber()
  }, [tokenInfo?.maxSupply, totalSupply])

  const isWhitelisted = useMemo(() => {
    return !!whitelabelNftApiSignature.data?.signature
  }, [whitelabelNftApiSignature.data?.signature])

  const canMint = useMemo(() => {
    return isWhitelisted || phase === Phase.Public
  }, [isWhitelisted, phase])

  const getTokenInfo = useCallback(async () => {
    const _tokenInfo = await whitelabelNftContract?.tokenInfo()
    setTokenInfo(_tokenInfo)
  }, [whitelabelNftContract])

  const getTotalSupply = useCallback(async () => {
    const _totalSupply = await whitelabelNftContract?.totalSupply()
    setTotalSupply(BigNumber.from(_totalSupply))
  }, [whitelabelNftContract])

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
    <MintWidgetSummaryModal
      whitelabelNft={whitelabelNft}
      mintPrice={mintPrice}
      quantity={formik.values.mintQuantity}
      whitelabelNftApiSignature={whitelabelNftApiSignature}
      setMintedMessage={setMintedMessage}
      color={color}
    />
  )

  useEffect(() => {
    getTokenInfo()
  }, [getTokenInfo])

  useEffect(() => {
    getTotalSupply()
  }, [getTotalSupply])

  if (!nftAddress) return null

  return (
    <Body color={color}>
      <Header color={color}>Mint {whitelabelNft.data?.name} NFT</Header>
      {mintedMessage && (
        <MintMessageWrapper color={color}>
          <Text color={color}>{mintedMessage}</Text>
        </MintMessageWrapper>
      )}
      <Flex flexDirection="row" marginBottom="16px">
        <MinterWrapper color={color}>
          <Text fontSize={isMobileView ? '14px' : '16px'} marginRight="24px">
            Mint Price
          </Text>
          <EtherIcon color={color} />
          <Text color={color} bold fontSize={isMobileView ? '14px' : '16px'}>
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
          <StyledButton
            scale="sm"
            variant="awesome"
            startIcon={<WalletIcon color="default" />}
            style={{ fontFamily: 'Poppins' }}
            onClick={onPresentConnectModal}
            marginBottom="4px"
            color={color}
          >
            Connect My Wallet
          </StyledButton>
          <StyledStockText color={color}>{stock}</StyledStockText>
        </>
      ) : (
        <FormikProvider value={formik}>
          <Grid container>
            <Grid item xs={12} md={3}>
              <StyledInputField
                label="Mint Quantity"
                name={WhitelabelNftMintField.mintQuantity}
                placeholder="Input how many NFT to mint"
                formik={formik}
                onChange={handleMintQuantityChanged}
                helperText={<StyledStockText color={color}>{stock}</StyledStockText>}
                color={color}
              />
            </Grid>
          </Grid>
          <ActionButtonWrapper>
            <StyledButton
              scale="sm"
              startIcon={!canMint && <LockIcon width={12} color="textDisabled" />}
              variant={canMint && stock !== 0 ? 'primary' : 'awesome'}
              disabled={!canMint || stock === 0}
              onClick={onPresentMintModal}
              color={color}
            >
              {canMint ? 'Mint NFT Collection' : 'You are not in whitelist'}
            </StyledButton>
          </ActionButtonWrapper>
        </FormikProvider>
      )}
    </Body>
  )
}

export default React.memo(MintWidget)
