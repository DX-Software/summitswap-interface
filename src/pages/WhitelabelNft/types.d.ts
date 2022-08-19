interface WhitelabelFormValues {
  name: string
  symbol: string
  maxSupply: string
  whitelistMintPrice: string
  publicMintPrice: string
  signer: string
  phase: number
}

type NftImage = {
  id: number
  base64: string
}

type TotalNftSheet = {
  totalNft: number
}

type TraitSheet = {
  displayType: string
  traitType: string
}

type MetadataSheet = {
  tokenId: number
  name: string
  description: string
  [key: string]: string
}

type AttributeJson = {
  trait_type?: string
  display_type?: DisplayType
  value: string | number
}

type MetadataJson = {
  name: string
  description: string
  external_url?: string
  image: string
  attributes: AttributeJson[]
}
