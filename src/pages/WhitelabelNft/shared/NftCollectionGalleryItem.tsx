import { Text } from '@koda-finance/summitswap-uikit'
import { Phase } from 'constants/whitelabel'
import React, { useMemo } from 'react'
import { WhitelabelNftGraphql } from '../types'
import CustomTag from './CustomTag'
import NftImage from './NftImage'

type Props = {
  data: WhitelabelNftGraphql
}

function NftCollectionGalleryItem({ data }: Props) {
  const phase = useMemo(() => {
    return Phase[data.phase]
  }, [data.phase])

  return (
    <>
      <NftImage src="https://picsum.photos/seed/picsum/200/300" />
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
          {data.maxSupply}
        </Text>{' '}
        NFT Collections
      </Text>
    </>
  )
}

export default React.memo(NftCollectionGalleryItem)
