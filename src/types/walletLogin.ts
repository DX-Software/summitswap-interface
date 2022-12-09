export type WalletLoginResponse = {
  _id: string
  walletAddress: string
  nonce: string
  createdAt: Date
  updatedAt: Date
}

export type WalletLogin = {
  account: string
  library: any
}

export type WalletVerifyResponse = {
  access_token: string
}
