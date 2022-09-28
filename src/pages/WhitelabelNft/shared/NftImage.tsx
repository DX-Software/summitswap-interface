import { Box, Skeleton } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'
import { getConcealImageUrl } from 'utils/whitelabelNft'
import { CustomTag } from './CustomTag'

const ImageWrapper = styled(Box)`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  background-color: black;
`

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  border-radius: 8px;
  z-index: 3;
  object-fit: cover;
  background-color: black;
`

const RevealTag = styled(CustomTag)`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  margin: 0;
`

const StyledImgSkeleton = styled(Skeleton)`
  width: 100%;
  aspect-ratio: 1/1;
`

type Props = {
  base64?: string
  isOwner?: boolean
}

function NftImage({ base64, isOwner }: Props) {
  return (
    <ImageWrapper>
      {!base64 ? (
        <StyledImgSkeleton />
      ) : (
        <>
          {isOwner && <RevealTag variant="default">OWNED</RevealTag>}
          <StyledImage src={base64 ? `data:image/png;base64,${base64}` : getConcealImageUrl()} alt="NFT item" />
        </>
      )}
    </ImageWrapper>
  )
}

export default React.memo(NftImage)
