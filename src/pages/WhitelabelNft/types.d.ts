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
  display_type: string
  trait_type: string
}
