// eslint-disable-next-line import/prefer-default-export
export function getDefaultConcealName(name: string) {
  return `Unknown ${name}`
}

export function getPreviewImageUrl() {
  return `${process.env.PUBLIC_URL}/images/whitelabel-nfts/thumbnail_default.png`
}

export function getConcealImageUrl() {
  return `${process.env.PUBLIC_URL}/images/whitelabel-nfts/conceal_default.png`
}
