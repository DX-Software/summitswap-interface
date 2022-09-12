import { Box, darkColors, Image, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'
import CustomTag from './CustomTag'

const CustomImage = styled(Image)`
  position: relative;

  > img {
    z-index: 3;
    border-radius: 8px;
  }

  ::after {
    content: ' ';
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    position: absolute;
    top: -5px;
    right: -7px;
    border-radius: 8px;
    z-index: 2;
  }
  ::before {
    content: ' ';
    width: 100%;
    height: 100%;
    background-color: ${darkColors.tertiary};
    position: absolute;
    top: -9px;
    right: -12px;
    border-radius: 8px;
    z-index: 1;
  }
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
  scale?: 'sm' | 'md'
  isReveal?: boolean
}

function NftCollectionGalleryItemImage({ src, scale = 'md', isReveal }: Props) {
  const scaleVariants = {
    sm: {
      width: 123,
      height: 103,
    },
    md: {
      width: 201,
      height: 171,
    },
  }

  return (
    <Box position="relative" width={scaleVariants[scale].width} height={scaleVariants[scale].height}>
      {isReveal && (
        <RevealTag variant="dropdownBackground">
          <Text textTransform="uppercase" fontFamily="Poppins" fontSize="10px" bold>
            REVEALED
          </Text>
        </RevealTag>
      )}
      <CustomImage src={src} width={scaleVariants[scale].width} height={scaleVariants[scale].height} />
    </Box>
  )
}

export default React.memo(NftCollectionGalleryItemImage)

NftCollectionGalleryItemImage.defaultProps = {
  scale: 'md',
  isReveal: false,
}
