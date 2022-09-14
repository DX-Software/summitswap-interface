import { BACKEND_API } from 'constants/index'
import { useMutation } from 'react-query'
import { WhitelabelUploadParameter, WhitelabelUploadResult, WhitelabelValidateParameter } from 'types/whitelabelNft'
import httpClient from './http'

const URL = 'whitelabel-nft'
export const DOWNLOAD_METADATA_URL = `${BACKEND_API}/${URL}/metadata/download`
const UPLOAD_METADATA_URL = `${URL}/metadata/upload`
const VALIDATE_METADATA_URL = `${URL}/metadata/validate`

// eslint-disable-next-line import/prefer-default-export
export function useWhitelabelNftApiUpload() {
  return useMutation(async (data: WhitelabelUploadParameter) => {
    const formData = new FormData()
    formData.append('walletAddress', data.walletAddress)
    formData.append('spreadsheet', data.spreadsheet)
    data.nftImages.forEach((nftImage) => {
      formData.append('images', nftImage)
    })
    const res = await httpClient.post(UPLOAD_METADATA_URL, formData)
    return res.data as WhitelabelUploadResult
  })
}

export function useWhitelabelNftApiValidate() {
  return useMutation(async (data: WhitelabelValidateParameter) => {
    const formData = new FormData()
    formData.append('spreadsheet', data.spreadsheet)
    data.nftImages.forEach((nftImage) => {
      formData.append('images', nftImage)
    })
    const res = await httpClient.post(VALIDATE_METADATA_URL, formData)
    return res
  })
}
