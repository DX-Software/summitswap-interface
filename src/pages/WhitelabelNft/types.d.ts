type WhitelabelFormValues = {
  name: string
  symbol: string
  maxSupply: string
  whitelistMintPrice: string
  publicMintPrice: string
  signer: string
  phase: number
}

type WhitelabelUploadParameter = {
  walletAddress: string
  spreadsheet: File
  nftImages: File[]
}

type WhitelabelUploadResult = {
  rootCid: string
  totalNft: number
}
