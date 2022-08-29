import BigNumber from 'bignumber.js'

export enum Tabs {
  BROWSE_COLLECTION = 'browse_collection',
}

export enum CollectionTab {
  ALL_COLLECTION = 'all_collection',
  PUBLIC_PHASE = 'public_phase',
  WHITELIST_PHASE = 'whitelist_phase',
  PAUSED_PHASE = 'paused_phase',
}

export type NavItem = {
  label: string
  code: Tabs | CollectionTab
  component: React.ReactNode
}

export type WhitelabelFormValues = {
  name: string
  symbol: string
  whitelistMintPrice: string
  publicMintPrice: string
  phase: number
}

export type WhitelabelNftTokenInfo = WhitelabelFormValues & {
  maxSupply: string
}

export type WhitelabelUploadParameter = {
  walletAddress: string
  spreadsheet: File
  nftImages: File[]
}

export type WhitelabelUploadResult = {
  rootCid: string
  totalNft: number
}

export type WhitelabelNftCardProp = {
  collectionName: string
  maxSupply: number
  phase: 'PAUSED' | 'WHITELIST' | 'PUBLIC'
}

export type WhitelabelNftGraphql = {
  id: string
  owner: {
    id: string
  }
  name: string
  symbol: string
  maxSupply: number
  whitelistMintPrice: BigNumber
  publicMintPrice: BigNumber
  phase: number
  createdAt: number
}
