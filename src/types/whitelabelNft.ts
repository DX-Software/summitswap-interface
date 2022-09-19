import BigNumber from 'bignumber.js'
import { Phase } from 'constants/whitelabel'

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
  description = 'description',
  concealName = 'concealName',
  previewImage = 'previewImage',
  concealImage = 'concealImage',
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
  [WhitelabelNftFormField.description]: string
  [WhitelabelNftFormField.concealName]?: string
  [WhitelabelNftFormField.previewImage]?: File
  [WhitelabelNftFormField.concealImage]?: File
  [WhitelabelNftFormField.maxSupply]?: string
  [WhitelabelNftFormField.whitelistMintPrice]: string
  [WhitelabelNftFormField.publicMintPrice]: string
  [WhitelabelNftFormField.phase]: number
  [WhitelabelNftFormField.isReveal]: boolean

  [WhitelabelNftFormField.nftImages]: File[]
  [WhitelabelNftFormField.spreadsheet]?: File
}

export type WhitelabelMetadataValidateDto = {
  spreadsheet: File
  nftImages: File[]
}

export type WhitelabelMetadataUploadDto = WhitelabelMetadataValidateDto & {
  walletAddress: string
}

export type WhitelabelMetadataConcealDto = {
  image: File
  concealName: string
}

export type WhitelabelCollectionUpsertDto = {
  whitelabelNftAddress: string
  baseUrl: string
}

export type WhitelabelUploadResult = {
  rootCid: string
}

type WhitelabelNftCreateNftEventCreateNft = {
  event: string
  args: {
    owner: string
    nftAddress: string
  }
}

export type WhitelabelNftTxReceipt = {
  blockHash: string
  blockNumber: number
  events: [WhitelabelNftCreateNftEventCreateNft]
  from: string
  to: string
  transactionHash: string
}

export type WhitelabelNftAccountGql = {
  id: string
  totalWhitelabelNft?: BigNumber
}

export type WhitelabelNftFactoryGql = {
  id: string
  totalWhitelabelNft?: BigNumber
  totalWhitelabelNftPausedPhase?: BigNumber
  totalWhitelabelNftPublicPhase?: BigNumber
  totalWhitelabelNftWhitelistPhase?: BigNumber
}

export type WhitelabelNftGql = {
  id: string
  owner?: WhitelabelNftAccountGql
  name?: string
  symbol?: string
  previewImageUrl?: string
  maxSupply?: BigNumber
  whitelistMintPrice?: BigNumber
  publicMintPrice?: BigNumber
  phase?: number
  isReveal?: boolean
  createdAt?: BigNumber
}

export type TokenInfo = {
  name: string
  symbol: string
  description: string
  previewImageUrl: string
  maxSupply: number
  whitelistMintPrice: string
  publicMintPrice: string
  phase: Phase
  isReveal: boolean
}

export enum WhitelabelNftMintField {
  mintQuantity = 'mintQuantity',
}

export type WhitelabelMintDto = {
  [WhitelabelNftMintField.mintQuantity]: number
}