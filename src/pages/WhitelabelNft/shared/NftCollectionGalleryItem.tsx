import { Text } from '@koda-finance/summitswap-uikit'
import { Phase } from 'constants/whitelabel'
import React, { useMemo } from 'react'
import { WhitelabelNftQuery } from 'types/whitelabelNft'
import CustomTag from './CustomTag'
import NftCollectionGalleryItemImage from './NftCollectionGalleryItemImage'

type Props = {
  data: WhitelabelNftQuery
}

function NftCollectionGalleryItem({ data }: Props) {
  const phase = useMemo(() => {
    return Phase[data.phase || 0]
  }, [data.phase])

  return (
    <>
      <NftCollectionGalleryItemImage src={data.previewImageUrl || ''} />
      <CustomTag>
        <Text textTransform="uppercase" fontFamily="Poppins" fontSize="10px" bold>
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
