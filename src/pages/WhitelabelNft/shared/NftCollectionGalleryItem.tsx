import { Box, Text } from '@koda-finance/summitswap-uikit'
import BigNumber from 'bignumber.js'
import { Phase } from 'constants/whitelabel'
import React from 'react'
import styled from 'styled-components'
import { WhitelabelNftCollectionGql, WhitelabelNftOwnerGql } from 'types/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
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
  id: string
  name?: string
  previewImageUrl?: string
  isReveal?: boolean
  phase?: Phase
  maxSupply?: BigNumber
}

function NftCollectionGalleryItem({ id, name, previewImageUrl, isReveal, phase, maxSupply }: Props) {
  const { setWhitelabelNtId } = useWhitelabelNftContext()

  return (
    <Card onClick={() => setWhitelabelNtId(id)}>
      <NftCollectionGalleryItemImage src={previewImageUrl || ''} isReveal={isReveal} />
      {phase && <PhaseTag phase={phase} />}
      <NameText bold>{name}</NameText>
      <InfoText color="textDisabled">
        <InfoText bold color="success" style={{ display: 'inline-block' }}>
          {maxSupply?.toString()}
        </InfoText>{' '}
        NFT(s) {maxSupply ? 'Collections' : 'owned'}
      </InfoText>
    </Card>
  )
}

export default React.memo(NftCollectionGalleryItem)
