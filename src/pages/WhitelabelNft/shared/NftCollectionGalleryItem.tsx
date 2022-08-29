import { Tag, Text } from '@koda-finance/summitswap-uikit'
import { Phase } from 'constants/whitelabel'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { WhitelabelNftGraphql } from '../types'
import NftImage from './NftImage'

type Props = {
  data: WhitelabelNftGraphql
}

const CustomTag = styled(Tag)`
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 8px;
`

function NftCollectionGalleryItem({ data }: Props) {
  const phase = useMemo(() => {
    return Phase[data.phase]
  }, [data.phase])

  return (
    <>
      <NftImage src="https://picsum.photos/seed/picsum/200/300" />
      <CustomTag>
        <Text textTransform="uppercase">{phase} PHASE</Text>
      </CustomTag>
      <Text bold fontSize="20px" lineHeight="22px" marginBottom="4px">
        {data.name}
      </Text>
      <Text>{data.maxSupply} NFT Collections</Text>
    </>
  )
}

export default React.memo(NftCollectionGalleryItem)
