import { useMutation } from 'react-query'
import { WhitelabelUploadParameter, WhitelabelUploadResult } from 'types/whitelabelNft'
import httpClient from './http'

const URL = 'whitelabel-nft'

// eslint-disable-next-line import/prefer-default-export
export function useWhitelabelNftApiUpload() {
  return useMutation(async (data: WhitelabelUploadParameter) => {
    const formData = new FormData()
    formData.append('walletAddress', data.walletAddress)
    formData.append('spreadsheet', data.spreadsheet)
    data.nftImages.forEach((nftImage) => {
      formData.append('images', nftImage)
    })
    const res = await httpClient.post(`${URL}/upload`, formData)
    return res.data as WhitelabelUploadResult
  })
}
