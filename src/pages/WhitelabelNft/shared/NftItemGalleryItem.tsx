import { Box, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { NftMetadata, WhitelabelNftItemGql } from 'types/whitelabelNft'
import truncateHash from 'utils/truncateHash'
import uriToHttp from 'utils/uriToHttp'
import NftImage from './NftImage'

const Card = styled(Box)`
  cursor: pointer;
`

const NameText = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const OwnerText = styled(Text)`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 12px;
`

type Props = {
  data: WhitelabelNftItemGql
  baseUrl: string
  onClick: () => void
}

function NftItemGalleryItem({ data, baseUrl, onClick }: Props) {
  const { account } = useWeb3React()
  const [metadata, setMetadata] = useState<NftMetadata | undefined>()

  const isRevealed = useMemo(() => {
    return data.collection?.isReveal || false
  }, [data.collection?.isReveal])

  const tokenId = useMemo(() => {
    if (isRevealed) return data.tokenId || '0'
    return 'concealed'
  }, [isRevealed, data.tokenId])

  const metadataUrl = uriToHttp(`${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${tokenId}.json`).pop()

  const getMetadata = useCallback(async () => {
    if (!metadataUrl) return
    const result = await axios.get(metadataUrl)
    setMetadata(result.data)
  }, [metadataUrl])

  useEffect(() => {
    getMetadata()
  }, [getMetadata])

  return (
    <Card onClick={onClick}>
      <Box marginBottom="8px">
        <NftImage base64={metadata?.image} isOwner={data.owner?.id.toLowerCase() === account?.toLowerCase()} />
      </Box>
      <Text color="linkColor" fontSize="12px">
        #{data.tokenId}
      </Text>
      <NameText fontSize="14px" fontWeight={700}>
        {metadata?.name || `Unknown ${data.collection?.name}` || ''}
      </NameText>
      <OwnerText>{truncateHash(data.owner?.id || '', 8, 6)}</OwnerText>
    </Card>
  )
}

export default React.memo(NftItemGalleryItem)
