import { Box, Skeleton, Text } from '@koda-finance/summitswap-uikit'
import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { NftMetadata, WhitelabelNftItemGql } from 'types/whitelabelNft'
import truncateHash from 'utils/truncateHash'
import uriToHttp from 'utils/uriToHttp'
import { getConcealImageUrl } from 'utils/whitelabelNft'

const Card = styled(Box)`
  cursor: pointer;
`

const StyledImg = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  margin-bottom: 8px;
  object-fit: cover;
  background-color: black;
`

const StyledImgSkeleton = styled(Skeleton)`
  width: 100%;
  aspect-ratio: 225/190;
  margin-bottom: 8px;
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
      {!metadata?.image ? (
        <StyledImgSkeleton />
      ) : (
        <StyledImg src={metadata.image ? `data:image/png;base64,${metadata.image}` : getConcealImageUrl()} />
      )}
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
