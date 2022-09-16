import BigNumber from 'bignumber.js'
import { WhitelabelNftQuery } from 'types/whitelabelNft'

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

export function convertToWhitelabelNft(data?: { [key: string]: any }): WhitelabelNftQuery | undefined {
  if (!data) return undefined
  return {
    id: data.id,
    owner: data.owner,
    name: data.name,
    symbol: data.symbol,
    previewImageUrl: data.previewImageUrl,
    maxSupply: data.maxSupply ? new BigNumber(data.maxSupply) : undefined,
    whitelistMintPrice: data.whitelistMintPrice ? new BigNumber(data.whitelistMintPrice) : undefined,
    publicMintPrice: data.publicMintPrice ? new BigNumber(data.publicMintPrice) : undefined,
    phase: data.phase,
    isReveal: data.isReveal,
    createdAt: data.createdAt ? new BigNumber(data.createdAt) : undefined,
  }
}
