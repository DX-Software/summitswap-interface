import { Box, darkColors, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'
import CustomTag from './CustomTag'

const BoxWrapper = styled(Box)`
  padding-right: 12px;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 207 / 173;
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

const Shadow1 = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  top: -5px;
  right: -7px;
  width: 100%;
  height: 100%;
  max-width: 100%;
  border-radius: 8px;
  z-index: 2;
`

const Shadow2 = styled.div`
  position: absolute;
  background-color: ${darkColors.tertiary};
  top: -9px;
  right: -12px;
  width: 100%;
  height: 100%;
  max-width: 100%;
  border-radius: 8px;
  z-index: 1;
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
  isReveal?: boolean
}

function NftCollectionGalleryItemImage({ src, isReveal }: Props) {
  return (
    <BoxWrapper>
      <ImageWrapper>
        {isReveal && (
          <RevealTag variant="dropdownBackground">
            <Text textTransform="uppercase" fontFamily="Poppins" fontSize="10px" bold>
              REVEALED
            </Text>
          </RevealTag>
        )}
        <StyledImage src={src} alt="NFT item" />
        <Shadow1 />
        <Shadow2 />
      </ImageWrapper>
    </BoxWrapper>
  )
}

export default React.memo(NftCollectionGalleryItemImage)

NftCollectionGalleryItemImage.defaultProps = {
  isReveal: false,
}
