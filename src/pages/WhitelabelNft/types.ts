export enum Tabs {
  MY_WHITELABEL_NFT = 'my_whitelabel_nft',
}

export type NavItem = {
  label: string
  code: Tabs
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
