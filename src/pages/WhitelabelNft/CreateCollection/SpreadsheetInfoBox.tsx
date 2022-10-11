import { Box, Button, DownloadIcon, ExchangeIcon, Heading, SpreadsheetIcon } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { DOWNLOAD_METADATA_URL } from 'api/useWhitelabelNftApi'
import React, { useCallback, useRef } from 'react'
import styled from 'styled-components'
import NftCollectionGalleryItemImage from '../shared/NftCollectionGalleryItemImage'
import { HelperText } from '../shared/Text'

const SpreadSheetWrapper = styled(Box)`
  background: linear-gradient(180deg, #011d2c 51.44%, #483f5a 100%);
  border-radius: 8px;
  padding: 32px;

  @media (max-width: 576px) {
    padding: 16px;
  }
`

const SpreadSheetIconWrapper = styled.div`
  width: 75px;
  height: 75px;
  background-color: ${({ theme }) => theme.colors.linkColor};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 576px) {
    width: 68px;
    height: 68px;
  }
`

const SpreadSheetDescriptionText = styled(HelperText)`
  @media (max-width: 576px) {
    font-size: 12px;
  }
`

const ExchangeIconResponsive = styled(ExchangeIcon)`
  width: 64px;
  height: 64px;

  @media (max-width: 576px) {
    width: 54px;
    height: 54px;
  }
`

const ButtonDownload = styled(Button)`
  @media (max-width: 576px) {
    font-size: 14px;
  }
`

function SpreadsheetInfoBox() {
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)

  const handleDownload = useCallback(() => {
    downloadLinkRef.current?.click()
  }, [])

  return (
    <SpreadSheetWrapper>
      <Heading color="success" size="md" marginBottom="24px">
        Easily define all of your NFTs
      </Heading>

      <Grid container>
        <Grid item xs={4} display="flex" flexDirection="column" justifyContent="flex-end">
          <NftCollectionGalleryItemImage src="/images/whitelabel-nfts/nft-image-placeholder.png" />
        </Grid>
        <Grid item xs={4} display="flex" justifyContent="center" alignItems="center">
          <ExchangeIconResponsive color="sidebarActiveColor" />
        </Grid>
        <Grid item xs={4} display="flex" alignItems="center">
          <SpreadSheetIconWrapper>
            <SpreadsheetIcon width={44} height={44} color="default" />
          </SpreadSheetIconWrapper>
        </Grid>
      </Grid>

      <SpreadSheetDescriptionText marginY="16px">
        NFT metadata is the core of an NFT. It is a JSON document that often contains the following:
        <br />
        NFT’s name
        <br />
        Description of the NFT
        <br />
        Link to the hosted image
        <br />
        Traits
        <br />
        This NFT metadata will be input and paired with your NFT images on the smart contract
      </SpreadSheetDescriptionText>
      <a ref={downloadLinkRef} href={DOWNLOAD_METADATA_URL} style={{ display: 'none' }}>
        Download
      </a>
      <ButtonDownload variant="tertiary" startIcon={<DownloadIcon />} width="100%" onClick={handleDownload}>
        <b>Download Metadata Format</b>
      </ButtonDownload>
    </SpreadSheetWrapper>
  )
}

export default React.memo(SpreadsheetInfoBox)
