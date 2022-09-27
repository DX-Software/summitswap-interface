import React from 'react'
import styled from 'styled-components'
import { CustomTag } from '../shared/CustomTag'

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
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
  top: 8px;
  left: 8px;
  z-index: 5;
  margin: 0;
`

type Props = {
  src: string
  isOwner?: boolean
}

function NftImage({ src, isOwner }: Props) {
  return (
    <ImageWrapper>
      {isOwner && <RevealTag variant="dropdownBackground">OWNED</RevealTag>}
      <StyledImage src={src} alt="NFT item" />
    </ImageWrapper>
  )
}

export default React.memo(NftImage)
