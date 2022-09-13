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
  [WhitelabelNftFormField.maxSupply]: '',
  [WhitelabelNftFormField.whitelistMintPrice]: '',
  [WhitelabelNftFormField.publicMintPrice]: '',
  [WhitelabelNftFormField.phase]: Phase.Pause,
  [WhitelabelNftFormField.isReveal]: false,

  [WhitelabelNftFormField.nftImages]: [],
  [WhitelabelNftFormField.spreadsheet]: undefined,
}
