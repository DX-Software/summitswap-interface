import BigNumber from 'bignumber.js'

export enum Tabs {
  BROWSE_COLLECTION = 'browse_collection',
  CREATE_COLLECTION = 'create_collection',
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

export enum WhitelabelNftFormField {
  name = 'name',
  symbol = 'symbol',
  concealName = 'concealName',
  previewImageUrl = 'previewImageUrl',
  concealImageUrl = 'concealImageUrl',
  maxSupply = 'maxSupply',
  whitelistMintPrice = 'whitelistMintPrice',
  publicMintPrice = 'publicMintPrice',
  phase = 'phase',
  isReveal = 'isReveal',

  nftImages = 'nftImages',
  spreadsheet = 'spreadsheet',
}

export type WhitelabelNft = {
  [WhitelabelNftFormField.name]: string
  [WhitelabelNftFormField.symbol]: string
  [WhitelabelNftFormField.concealName]?: string
  [WhitelabelNftFormField.previewImageUrl]?: string | File
  [WhitelabelNftFormField.concealImageUrl]?: string | File
  [WhitelabelNftFormField.maxSupply]?: string
  [WhitelabelNftFormField.whitelistMintPrice]: string
  [WhitelabelNftFormField.publicMintPrice]: string
  [WhitelabelNftFormField.phase]: number
  [WhitelabelNftFormField.isReveal]: boolean

  [WhitelabelNftFormField.nftImages]?: File[]
  [WhitelabelNftFormField.spreadsheet]?: File
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
