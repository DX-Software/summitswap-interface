export function convertFileToBase64(file: File) {
  return new Promise((resolve) => {
    const fr = new FileReader()
    fr.readAsDataURL(file)

    fr.onloadend = () => {
      resolve(fr.result)
    }
  })
}

export async function convertImageUrlToFile(url: string, filename: string) {
  const response = await fetch(url)
  const blob = await response.blob()
  const file = new File([blob], filename)
  return file
}
