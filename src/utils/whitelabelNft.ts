import BigNumber from 'bignumber.js'
import { WhitelabelNftFactoryGql, WhitelabelNftCollectionGql, WhitelabelNftItemGql } from 'types/whitelabelNft'

// eslint-disable-next-line import/prefer-default-export
export function getDefaultConcealName(name: string) {
  return `Unknown ${name}`
}

export function getPreviewImageUrl() {
  return `${window.location.origin}/images/whitelabel-nfts/thumbnail_default.png`
}

export function getConcealImageUrl() {
  return `${window.location.origin}/images/whitelabel-nfts/conceal_default.png`
}

export function convertToWhitelabelNftFactory(
  data?: { [key: string]: any } | null
): WhitelabelNftFactoryGql | undefined {
  if (!data) return undefined
  return {
    id: data.id || '',
    totalWhitelabelNft: data.totalWhitelabelNft ? new BigNumber(data.totalWhitelabelNft) : undefined,
  }
}

export function convertToWhitelabelNftCollection(data?: {
  [key: string]: any
}): WhitelabelNftCollectionGql | undefined {
  if (!data) return undefined
  return {
    id: data.id,
    owner: data.owner,
    name: data.name,
    symbol: data.symbol,
    description: data.description,
    previewImageUrl: data.previewImageUrl,
    maxSupply: data.maxSupply ? new BigNumber(data.maxSupply) : undefined,
    whitelistMintPrice: data.whitelistMintPrice ? new BigNumber(data.whitelistMintPrice) : undefined,
    publicMintPrice: data.publicMintPrice ? new BigNumber(data.publicMintPrice) : undefined,
    phase: data.phase,
    isReveal: data.isReveal,
    createdAt: data.createdAt ? new BigNumber(data.createdAt) : undefined,
  }
}

export function convertToWhitelabelNftItem(data?: { [key: string]: any }): WhitelabelNftItemGql | undefined {
  if (!data) return undefined
  return {
    id: data.id,
    collection: data.collection,
    tokenId: data.tokenId,
    owner: data.owner,
  }
}
