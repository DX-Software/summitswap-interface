import BigNumber from 'bignumber.js'
import { Phase } from 'constants/whitelabel'
import {
  WhitelabelNftFactoryGql,
  WhitelabelNftCollectionGql,
  WhitelabelNftItemGql,
  WhitelabelNftAccountGql,
  WhitelabelNftOwnerGql,
} from 'types/whitelabelNft'

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
    totalWhitelabelNftPausedPhase: data.totalWhitelabelNftPausedPhase
      ? new BigNumber(data.totalWhitelabelNftPausedPhase)
      : undefined,
    totalWhitelabelNftPublicPhase: data.totalWhitelabelNftPublicPhase
      ? new BigNumber(data.totalWhitelabelNftPublicPhase)
      : undefined,
    totalWhitelabelNftWhitelistPhase: data.totalWhitelabelNftWhitelistPhase
      ? new BigNumber(data.totalWhitelabelNftWhitelistPhase)
      : undefined,
  }
}

export function convertToWhitelabelNftAccount(
  data?: { [key: string]: any } | null
): WhitelabelNftAccountGql | undefined {
  return convertToWhitelabelNftFactory(data)
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
    baseTokenURI: data.baseTokenURI,
    maxSupply: data.maxSupply ? new BigNumber(data.maxSupply) : undefined,
    whitelistMintPrice: data.whitelistMintPrice ? new BigNumber(data.whitelistMintPrice) : undefined,
    publicMintPrice: data.publicMintPrice ? new BigNumber(data.publicMintPrice) : undefined,
    phase: data.phase,
    isReveal: data.isReveal,
    totalOwner: data.publicMintPrice ? new BigNumber(data.totalOwner) : undefined,
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

export function convertToWhitelabelNftOwner(data?: { [key: string]: any }): WhitelabelNftOwnerGql | undefined {
  if (!data) return undefined
  return {
    id: data.id,
    collection: data.collection,
    owner: data.owner,
    nftCount: data.nftCount ? new BigNumber(data.nftCount) : undefined,
  }
}

export function getPhaseString(phase: Phase) {
  const phaseString = Phase[phase || 0]
  return phaseString
}

export function getOpenSeaNftUrl(contractAddress: string, tokenId: string) {
  const url = `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`
  return url
}

export function getRaribleNftUrl(contractAddress: string, tokenId: string) {
  const url = `https://rarible.com/token/${contractAddress}:${tokenId}`
  return url
}

export function getLooksRareNftUrl(contractAddress: string, tokenId: string) {
  const url = `https://looksrare.org/collections/${contractAddress}/${tokenId}`
  return url
}

export function getX2Y2NftUrl(contractAddress: string, tokenId: string) {
  const url = `https://x2y2.io/eth/${contractAddress}/${tokenId}`
  return url
}
