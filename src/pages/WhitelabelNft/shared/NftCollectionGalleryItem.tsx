import { Text } from '@koda-finance/summitswap-uikit'
import { Phase } from 'constants/whitelabel'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { WhitelabelNftGql } from 'types/whitelabelNft'
import CustomTag from './CustomTag'
import NftCollectionGalleryItemImage from './NftCollectionGalleryItemImage'

const NameText = styled(Text)`
  font-size: 20px;
  line-height: 22px;
  margin-bottom: 4px;

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
  data: WhitelabelNftGql
}

function NftCollectionGalleryItem({ data }: Props) {
  const phase = useMemo(() => {
    return Phase[data.phase || 0]
  }, [data.phase])

  const tagVariant = useMemo(() => {
    switch (data.phase) {
      case Phase.Pause:
        return 'textDisabled'
      case Phase.Whitelist:
        return 'info'
      default:
        return 'primary'
    }
  }, [data.phase])

  return (
    <>
      <NftCollectionGalleryItemImage src={data.previewImageUrl || ''} isReveal={data.isReveal} />
      <CustomTag variant={tagVariant}>
        <Text textTransform="uppercase" fontSize="10px" fontWeight={700}>
          {phase} PHASE
        </Text>
      </CustomTag>
      <NameText bold>{data.name}</NameText>
      <InfoText color="textDisabled">
        <InfoText color="success" style={{ display: 'inline-block' }}>
          {data.maxSupply?.toString()}
        </InfoText>{' '}
        NFT Collections
      </InfoText>
    </>
  )
}

export default React.memo(NftCollectionGalleryItem)
