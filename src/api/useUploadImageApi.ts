import { useMutation } from 'react-query'
import httpClient from './http'

type UploadImageResult = {
  fileName: string
  rootCid: string
  url: string
}

const URL = 'upload-image'

// eslint-disable-next-line import/prefer-default-export
export function useUploadImageApi() {
  return useMutation(async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    const res = await httpClient.post(`${URL}/upload`, formData)

    return res.data as UploadImageResult
  })
}
