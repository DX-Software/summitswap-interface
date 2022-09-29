import BigNumber from 'bignumber.js'
import { Phase } from 'constants/whitelabel'

export enum Tabs {
  BROWSE_COLLECTION = 'browse_collection',
  MINTED_NFTS = 'minted_nfts',
  MY_NFT_COLLECTION = 'my_nft_collection',
  CREATE_COLLECTION = 'create_collection',
}

export enum BrowseCollectionTab {
  ALL_COLLECTION = 'all_collection',
  PUBLIC_PHASE = 'public_phase',
  WHITELIST_PHASE = 'whitelist_phase',
  PAUSED_PHASE = 'paused_phase',
}

export enum NftItemCollectionTab {
  ALL_COLLECTION = 'all_collection',
  MY_COLLECTION = 'my_collection',
}

export enum MintedNftTab {
  ALL_COLLECTION = 'all_collection',
  NFT_COLLECTION_ALBUMS = 'nft_collection_albums',
}

export type NavItem = {
  label: string
  code: Tabs | BrowseCollectionTab | NftItemCollectionTab | MintedNftTab
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

export type WhitelabelNftUpdatePhase = {
  [WhitelabelNftFormField.phase]: number
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

export type WhitelabelCollectionResult = {
  _id: string
  contractAddress: string
  baseUrl: string
}

export type WhitelabelSignaturesAddDto = {
  ownerAddress: string
  contractAddress: string
  whitelistAddresses: string | string[]
}

export type WhitelabelSignaturesDeleteAllDto = {
  ownerAddress: string
  contractAddress: string
}

export type WhitelabelSignaturesDeleteDto = WhitelabelSignaturesDeleteAllDto & {
  whitelistAddresses: string[]
}

export type WhitelabelSignatureResult = {
  _id: string
  contractAddress: string
  ownerAddress: string
  signature: string
  whitelistAddress: string
}

export type WhitelabelSignaturesResult = {
  signatures: WhitelabelSignatureResult[]
  totalSignature: number
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

export type WhitelabelNftFactoryGql = {
  id: string
  totalWhitelabelNft?: BigNumber
  totalWhitelabelNftPausedPhase?: BigNumber
  totalWhitelabelNftPublicPhase?: BigNumber
  totalWhitelabelNftWhitelistPhase?: BigNumber
}

export type WhitelabelNftAccountGql = WhitelabelNftFactoryGql

export type WhitelabelNftCollectionGql = {
  id: string
  owner?: WhitelabelNftAccountGql
  name?: string
  symbol?: string
  description?: string
  previewImageUrl?: string
  baseTokenURI?: string
  maxSupply?: BigNumber
  whitelistMintPrice?: BigNumber
  publicMintPrice?: BigNumber
  phase?: number
  isReveal?: boolean
  totalOwner?: BigNumber
  createdAt?: BigNumber
}

export type WhitelabelNftItemGql = {
  id: string
  collection?: WhitelabelNftCollectionGql
  tokenId?: string
  owner?: WhitelabelNftAccountGql
}

export type WhitelabelNftOwnerGql = {
  id: string
  collection?: WhitelabelNftCollectionGql
  owner?: WhitelabelNftAccountGql
  nftCount?: BigNumber
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

export type NftMetadata = {
  tokenId: number | string
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: number | string
    display_type?: string
  }>
}
