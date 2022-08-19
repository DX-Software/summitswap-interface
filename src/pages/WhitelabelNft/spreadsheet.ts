import * as XLSX from 'xlsx'

export enum DisplayType {
  string = 'string',
  generic = 'generic',
  date = 'date',
  number = 'number',
  boost_percentage = 'boost_percentage',
  boost_number = 'boost_number',
}

function getTotalNft(sheet: XLSX.WorkSheet) {
  const totalNft = XLSX.utils.sheet_to_json(sheet) as TotalNftSheet[]
  return totalNft[0].totalNft
}

function getTraits(sheet: XLSX.WorkSheet) {
  const traits = XLSX.utils.sheet_to_json(sheet) as TraitSheet[]
  return traits
}

function getMetadata(sheet: XLSX.WorkSheet, traits: TraitSheet[], totalNft: number) {
  const traitValues = traits.map((trait) => trait.traitType)
  const header = ['tokenId', 'name', 'description', ...traitValues]
  const columnUpperBound = String.fromCharCode(65 + 3 + traits.length)
  const metadata = XLSX.utils.sheet_to_json(sheet, {
    header,
    range: `A2:${columnUpperBound}${totalNft + 1}`,
    defval: null,
  }) as MetadataSheet[]
  return metadata
}

function parseAttributes(metaAttributes: { [key: string]: string }, traits: TraitSheet[]) {
  const attributes: AttributeJson[] = traits.map((trait) => {
    const { traitType, displayType } = trait
    const value = metaAttributes[traitType]

    const attribute: AttributeJson = {
      trait_type: traitType,
      value,
    }

    if (displayType !== DisplayType.string) {
      attribute.display_type = DisplayType[displayType]
    }
    if (displayType === DisplayType.generic) {
      delete attribute.trait_type
    }
    return attribute
  })
  return attributes
}

export default function parseMetadata(spreadsheet: ArrayBuffer, nftImages: NftImage[]) {
  const metadata: MetadataJson[] = []

  const workbook = XLSX.read(spreadsheet, { type: 'binary' })
  const { traitSheet, metadataSheet, totalNftSheet } = workbook.Sheets
  const totalNft = getTotalNft(totalNftSheet)
  const traits = getTraits(traitSheet)
  const metadataRaw = getMetadata(metadataSheet, traits, totalNft)

  metadataRaw.forEach((meta) => {
    const { tokenId, name, description, ...metaAttributes } = meta
    const image = nftImages[tokenId].base64
    const attributes = parseAttributes(metaAttributes, traits)
    metadata.push({ name, description, image, attributes } as MetadataJson)
  })

  return metadata
}
