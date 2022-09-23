export const checkEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const checkUrl = (_url: string) => {
  let url: URL;
  try {
    url=  new URL(_url)
  } catch (_) {
    return false
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export const checkIfUint256 = (value: string) => {
  return /^\d+$/.test(value)
}

