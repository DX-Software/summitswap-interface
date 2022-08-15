interface WhitelabelFormValues {
  spreadsheet?: File
  images: HTMLImageElement[]
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
