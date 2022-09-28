import { Box, Text } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWhitelabelNftItemById } from 'api/useWhitelabelNftApi'
import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { UseQueryResult } from 'react-query'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { NftMetadata, WhitelabelNftCollectionGql } from 'types/whitelabelNft'
import uriToHttp from 'utils/uriToHttp'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import Header, { HeaderLevel } from '../shared/Header'
import AboutSection from './AboutSection'
import IntroductionSection from './IntroductionSection'
import MoreNftSection from './MoreNftSection'
import TraitSection from './TraitSection'

const Divider = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.inputColor};
`

const PersuasionWrapper = styled(Box)`
  background-color: ${({ theme }) => theme.colors.dropdownBackground};
  padding: 16px;
  padding-left: 15%;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  z-index: 0;

  @media (max-width: 576px) {
    padding: 12px 16px;
  }
`

const KodaMascot = styled.img`
  position: absolute;
  top: -10px;
  left: -20px;
  z-index: -30;
  transform: rotate(20deg);
  width: 192px;
  height: auto;

  @media (max-width: 1200px) {
    opacity: 0.4;
  }
`

const StyledText = styled(Text)`
  display: inline-block;
  font-size: 14px;

  @media (max-width: 576px) {
    font-size: 12px;
  }
`

type NftDetailsProps = {
  previousHeaderLevels: HeaderLevel[]
  whitelabelNft: UseQueryResult<WhitelabelNftCollectionGql | undefined>
}

function NftDetails({ previousHeaderLevels, whitelabelNft }: NftDetailsProps) {
  const history = useHistory()
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const [metadata, setMetadata] = useState<NftMetadata | undefined>()
  const { whitelabelNftId, tokenId, setTokenId } = useWhitelabelNftContext()
  const whitelabelNftItem = useWhitelabelNftItemById(`${whitelabelNftId}-${tokenId}`)

  const headerLevels: HeaderLevel[] = [
    previousHeaderLevels[0],
    { label: previousHeaderLevels[1].label, onBack: () => setTokenId('') },
    { label: metadata?.name },
  ]

  const metadataUrl = useMemo(() => {
    const baseUrl = whitelabelNft.data?.baseTokenURI || ''
    return uriToHttp(`${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${tokenId}.json`).pop()
  }, [whitelabelNft.data?.baseTokenURI, tokenId])

  const getMetadata = useCallback(async () => {
    if (!metadataUrl) return
    const result = await axios.get(metadataUrl)
    setMetadata(result.data)
  }, [metadataUrl])

  useEffect(() => {
    getMetadata()
  }, [getMetadata])

  useEffect(() => {
    if (whitelabelNftId) {
      history.replace({
        search: `?whitelabel-nft=${whitelabelNftId}&token-id=${tokenId}`,
      })
    }
  }, [history, tokenId, whitelabelNftId])

  return (
    <>
      <Header levels={headerLevels} />
      <Grid container marginTop="24px">
        <Grid item xs={12}>
          <IntroductionSection metadata={metadata} whitelabelNftItem={whitelabelNftItem} />
          <Divider marginTop={isMobileView ? '32px' : '44px'} marginBottom={isMobileView ? '32px' : '40px'} />
        </Grid>
        <Grid container item xs={12} spacing="24px">
          <Grid item xs={12} lg={7}>
            <TraitSection metadata={metadata} />
          </Grid>
          <Grid item xs={12} lg={5}>
            <AboutSection whitelabelNftItem={whitelabelNftItem} />
          </Grid>
          <Grid item xs={12}>
            <PersuasionWrapper>
              <KodaMascot src="/images/whitelabel-nfts/koda-mascot.png" />
              <Text color="warning" fontWeight={700} fontSize={isMobileView ? '14px' : '16px'} marginBottom="4px">
                Get Your Own NFT Now
              </Text>
              <StyledText>
                Want to have your own NFT?{' '}
                <StyledText color="linkColor" onClick={() => setTokenId('')} style={{ cursor: 'pointer' }}>
                  <u>Mint yours now</u>
                </StyledText>{' '}
                before it runs out of stock!
              </StyledText>
            </PersuasionWrapper>
          </Grid>
          <Grid item xs={12} spacing="24px">
            <MoreNftSection whitelabelNftItem={whitelabelNftItem} />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(NftDetails)
