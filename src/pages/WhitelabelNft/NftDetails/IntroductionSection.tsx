import { Flex, Heading, LooksRareIcon, OpenSeaIcon, RaribleIcon, X2Y2Icon } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { getAddress } from 'ethers/lib/utils'
import React, { useMemo } from 'react'
import { UseQueryResult } from 'react-query'
import styled from 'styled-components'
import { NftMetadata, WhitelabelNftItemGql } from 'types/whitelabelNft'
import { shortenAddress } from 'utils'
import { getConcealImageUrl } from 'utils/whitelabelNft'
import { HelperText } from '../shared/Text'
import NftImage from './NftImage'

type IntroductionSectionProps = {
  metadata: NftMetadata | undefined
  whitelabelNftItem: UseQueryResult<WhitelabelNftItemGql | undefined>
}

const MarketplaceIconWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.inputColor};
  border-radius: 50%;
  padding: 4px;
  width: 32px;
  height: 32px;
  justify-content: center;
`

function IntroductionSection({ metadata, whitelabelNftItem }: IntroductionSectionProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { account } = useWeb3React()

  const owner = useMemo(() => {
    if (whitelabelNftItem.data?.owner?.id) {
      return getAddress(whitelabelNftItem.data?.owner?.id)
    }
    return whitelabelNftItem.data?.owner?.id
  }, [whitelabelNftItem.data?.owner?.id])

  return (
    <Grid container columnSpacing="40px" rowGap="24px">
      <Grid item xs={12} md={5}>
        <NftImage
          src={metadata?.image ? `data:image/png;base64,${metadata.image}` : getConcealImageUrl()}
          // isOwner={whitelabelNft.data?.isReveal || false}
        />
      </Grid>
      <Grid item xs={12} md={7}>
        <Heading size="xl" marginBottom="16px">
          {metadata?.name}
        </Heading>
        <HelperText color="textDisabled" marginBottom="16px">
          Owned by{' '}
          <HelperText color="success" style={{ display: 'inline-block' }}>
            {isMobileView ? shortenAddress(owner || '') : owner}
          </HelperText>
        </HelperText>
        <HelperText marginBottom="16px">{metadata?.description}</HelperText>
        <Flex style={{ columnGap: '8px' }}>
          <MarketplaceIconWrapper>
            <OpenSeaIcon width={24} />
          </MarketplaceIconWrapper>
          <MarketplaceIconWrapper>
            <RaribleIcon />
          </MarketplaceIconWrapper>
          <MarketplaceIconWrapper>
            <LooksRareIcon />
          </MarketplaceIconWrapper>
          <MarketplaceIconWrapper>
            <X2Y2Icon />
          </MarketplaceIconWrapper>
        </Flex>
      </Grid>
    </Grid>
  )
}

export default React.memo(IntroductionSection)
