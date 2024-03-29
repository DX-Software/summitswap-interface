import { Flex, Heading, LooksRareIcon, OpenSeaIcon, RaribleIcon, X2Y2Icon } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { getAddress } from 'ethers/lib/utils'
import React, { useCallback, useMemo, useRef } from 'react'
import { UseQueryResult } from 'react-query'
import styled from 'styled-components'
import { NftMetadata, WhitelabelNftItemGql } from 'types/whitelabelNft'
import { shortenAddress } from 'utils'
import { getLooksRareNftUrl, getOpenSeaNftUrl, getRaribleNftUrl, getX2Y2NftUrl } from 'utils/whitelabelNft'
import NftImage from '../shared/NftImage'
import { HelperText } from '../shared/Text'

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
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`

function IntroductionSection({ metadata, whitelabelNftItem }: IntroductionSectionProps) {
  const openseaLinkRef = useRef<HTMLAnchorElement>(null)
  const raribleLinkRef = useRef<HTMLAnchorElement>(null)
  const looksrareLinkRef = useRef<HTMLAnchorElement>(null)
  const x2y2LinkRef = useRef<HTMLAnchorElement>(null)

  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { account } = useWeb3React()

  const owner = useMemo(() => {
    if (whitelabelNftItem.data?.owner?.id) {
      return getAddress(whitelabelNftItem.data?.owner?.id)
    }
    return whitelabelNftItem.data?.owner?.id
  }, [whitelabelNftItem.data?.owner?.id])

  const handleVisitLink = useCallback((ref: React.RefObject<HTMLAnchorElement>) => {
    ref.current?.click()
  }, [])

  return (
    <Grid container columnSpacing="40px" rowGap="24px">
      <Grid item xs={12} md={5}>
        <NftImage
          base64={metadata?.image}
          isOwner={whitelabelNftItem.data?.owner?.id.toLowerCase() === account?.toLowerCase()}
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
          <MarketplaceIconWrapper onClick={() => handleVisitLink(openseaLinkRef)}>
            <OpenSeaIcon width={24} />
          </MarketplaceIconWrapper>
          <MarketplaceIconWrapper onClick={() => handleVisitLink(raribleLinkRef)}>
            <RaribleIcon />
          </MarketplaceIconWrapper>
          <MarketplaceIconWrapper onClick={() => handleVisitLink(looksrareLinkRef)}>
            <LooksRareIcon />
          </MarketplaceIconWrapper>
          <MarketplaceIconWrapper onClick={() => handleVisitLink(x2y2LinkRef)}>
            <X2Y2Icon />
          </MarketplaceIconWrapper>
          <a
            ref={openseaLinkRef}
            href={getOpenSeaNftUrl(whitelabelNftItem.data?.collection?.id || '', whitelabelNftItem.data?.tokenId || '')}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'none' }}
          >
            OpenSea
          </a>
          <a
            ref={raribleLinkRef}
            href={getRaribleNftUrl(whitelabelNftItem.data?.collection?.id || '', whitelabelNftItem.data?.tokenId || '')}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'none' }}
          >
            Rarible
          </a>
          <a
            ref={looksrareLinkRef}
            href={getLooksRareNftUrl(
              whitelabelNftItem.data?.collection?.id || '',
              whitelabelNftItem.data?.tokenId || ''
            )}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'none' }}
          >
            LooksRare
          </a>
          <a
            ref={x2y2LinkRef}
            href={getX2Y2NftUrl(whitelabelNftItem.data?.collection?.id || '', whitelabelNftItem.data?.tokenId || '')}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'none' }}
          >
            X2Y2
          </a>
        </Flex>
      </Grid>
    </Grid>
  )
}

export default React.memo(IntroductionSection)
