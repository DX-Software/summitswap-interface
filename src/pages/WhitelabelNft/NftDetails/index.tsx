import { Box } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWhitelabelNftItem } from 'api/useWhitelabelNftApi'
import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { UseQueryResult } from 'react-query'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { NftMetadata, WhitelabelNftCollectionGql } from 'types/whitelabelNft'
import uriToHttp from 'utils/uriToHttp'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import Header, { HeaderLevel } from '../shared/Header'
import IntroductionSection from './IntroductionSection'

const Divider = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.inputColor};
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
  const whitelabelNftItem = useWhitelabelNftItem(`${whitelabelNftId}-${tokenId}`)

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
        <IntroductionSection metadata={metadata} whitelabelNftItem={whitelabelNftItem} />
        <Divider marginTop={isMobileView ? '32px' : '44px'} marginBottom={isMobileView ? '32px' : '40px'} />
      </Grid>
    </>
  )
}

export default React.memo(NftDetails)
