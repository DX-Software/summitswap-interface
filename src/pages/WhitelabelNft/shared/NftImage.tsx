import { Image } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'

type Props = {
  src: string
}

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
    background-color: #B8B8B8;
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
    background-color: #8A8A8A;
    position: absolute;
    top: -9px;
    right: -12px;
    border-radius: 8px;
    z-index: 1;
  }
`

function NftImage({ src }: Props) {
  return <CustomImage src={src} width={217} height={181} />
}

export default React.memo(NftImage)
