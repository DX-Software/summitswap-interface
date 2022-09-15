// eslint-disable-next-line import/prefer-default-export
export function getDefaultConcealName(name: string) {
  return `Unknown ${name}`
}

export function getPreviewImageUrl() {
  return `${window.location.origin}/images/whitelabel-nfts/thumbnail_default.png`
}

export function getConcealImageUrl() {
  return `${window.location.origin}/images/whitelabel-nfts/conceal_default.png`
}
