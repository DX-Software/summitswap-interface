import { Box, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'
import { WhitelabelNftCollectionGql } from 'types/whitelabelNft'
import { PhaseTag } from './CustomTag'
import NftCollectionGalleryItemImage from './NftCollectionGalleryItemImage'

const Card = styled(Box)`
  cursor: pointer;
`

const NameText = styled(Text)`
  font-size: 20px;
  line-height: 22px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 576px) {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 0;
  }
`

const InfoText = styled(Text)`
  line-height: 24px;

  @media (max-width: 576px) {
    font-size: 12px;
    line-height: 18px;
  }
`

type Props = {
  data: WhitelabelNftCollectionGql
  onClick: () => void
}

function NftCollectionGalleryItem({ data, onClick }: Props) {
  return (
    <Card onClick={onClick}>
      <NftCollectionGalleryItemImage src={data.previewImageUrl || ''} isReveal={data.isReveal} />
      <PhaseTag phase={data.phase} />
      <NameText bold>{data.name}</NameText>
      <InfoText color="textDisabled">
        <InfoText bold color="success" style={{ display: 'inline-block' }}>
          {data.maxSupply?.toString()}
        </InfoText>{' '}
        NFT Collections
      </InfoText>
    </Card>
  )
}

export default React.memo(NftCollectionGalleryItem)
