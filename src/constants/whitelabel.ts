import { WhitelabelNftFormField } from 'types/whitelabelNft'

export const WHITELABEL_FACTORY_ADDRESS = `${process.env.REACT_APP_WHITELABEL_FACTORY_ADDRESS}`

export enum Phase {
  Pause,
  Whitelist,
  Public,
}

export const PER_PAGE = 12

export const INITIAL_WHITELABEL_CREATION = {
  [WhitelabelNftFormField.name]: '',
  [WhitelabelNftFormField.symbol]: '',
  [WhitelabelNftFormField.previewImage]: undefined,
  [WhitelabelNftFormField.concealImage]: undefined,
  [WhitelabelNftFormField.whitelistMintPrice]: '0',
  [WhitelabelNftFormField.publicMintPrice]: '0',
  [WhitelabelNftFormField.phase]: Phase.Pause,
  [WhitelabelNftFormField.isReveal]: false,

  [WhitelabelNftFormField.nftImages]: [],
  [WhitelabelNftFormField.spreadsheet]: undefined,
}

export const SUPPORTED_IMAGE_FORMAT = ['image/jpg', 'image/jpeg', 'image/png']
export const SUPPORTED_METADATA_FORMAT = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
