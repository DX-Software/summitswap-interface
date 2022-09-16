import { Text } from '@koda-finance/summitswap-uikit'
import { Phase } from 'constants/whitelabel'
import React, { useMemo } from 'react'
import { WhitelabelNftGql } from 'types/whitelabelNft'
import CustomTag from './CustomTag'
import NftCollectionGalleryItemImage from './NftCollectionGalleryItemImage'

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
      <Text bold fontSize="20px" lineHeight="22px" marginBottom="4px">
        {data.name}
      </Text>
      <Text color="textDisabled">
        <Text color="success" style={{ display: 'inline-block' }}>
          {data.maxSupply?.toString()}
        </Text>{' '}
        NFT Collections
      </Text>
    </>
  )
}

export default React.memo(NftCollectionGalleryItem)
