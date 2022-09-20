import { Box, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'
import { WhitelabelNftItemGql } from 'types/whitelabelNft'
import truncateHash from 'utils/truncateHash'

const Card = styled(Box)`
  cursor: pointer;
`

const StyledImg = styled.img`
  width: 100%;
  aspect-ratio: 225/190;
  margin-bottom: 8px;
`

const NameText = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const OwnerText = styled(Text)`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 12px;
`

type Props = {
  data: WhitelabelNftItemGql
  onClick: () => void
}

function NftItemGalleryItem({ data, onClick }: Props) {
  return (
    <Card onClick={onClick}>
      <StyledImg src={data.collection?.previewImageUrl || ''} />
      <Text color="linkColor" fontSize="12px">
        #{data.tokenId}
      </Text>
      <NameText fontSize="14px" fontWeight={700}>
        Mysterious Girl
      </NameText>
      <OwnerText>{truncateHash(data.owner?.id || '', 8, 6)}</OwnerText>
    </Card>
  )
}

export default React.memo(NftItemGalleryItem)
