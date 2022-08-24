type WhitelabelFormValues = {
  name: string
  symbol: string
  whitelistMintPrice: string
  publicMintPrice: string
  signer: string
  phase: number
}

type WhitelabelNftTokenInfo = WhitelabelFormValues & {
  maxSupply: string
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
