import { useMutation } from 'react-query'
import httpClient from './http'

export type UploadImageResult = {
  fileName: string
  rootCid: string
  url: string
}

// eslint-disable-next-line import/prefer-default-export
export function useUploadImageApi() {
  return useMutation(async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    const res = await httpClient.post("upload-image", formData)

    return res.data as UploadImageResult
  })
}
