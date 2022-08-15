const checkUrl = (_url: string) => {
  let url: URL;
  try {
    url=  new URL(_url)
  } catch (_) {
    return false
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export default checkUrl;