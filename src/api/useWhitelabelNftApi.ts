import { BACKEND_API } from 'constants/index'
import { useMutation, useQuery } from 'react-query'
import {
  WhitelabelCollectionUpsertDto,
  WhitelabelMetadataConcealDto,
  WhitelabelMetadataUploadDto,
  WhitelabelMetadataValidateDto,
  WhitelabelUploadResult,
} from 'types/whitelabelNft'
import httpClient from './http'

const URL = 'whitelabel-nft'
export const DOWNLOAD_METADATA_URL = `${BACKEND_API}/${URL}/metadata/download`
const METADATA_UPLOAD_URL = `${URL}/metadata/upload`
const METADATA_VALIDATE_URL = `${URL}/metadata/validate`
const METADATA_CONCEAL_URL = `${URL}/metadata/conceal`
const COLLECTION_GET_URL = `${URL}/collection/`
const COLLECTION_UPSERT_URL = `${URL}/collection/`

export function useWhitelabelNftApiUploadMetadata() {
  return useMutation(async (data: WhitelabelMetadataUploadDto) => {
    const formData = new FormData()
    formData.append('walletAddress', data.walletAddress)
    formData.append('spreadsheet', data.spreadsheet)
    data.nftImages.forEach((nftImage) => {
      formData.append('images', nftImage)
    })
    const res = await httpClient.post(METADATA_UPLOAD_URL, formData)
    return res.data as WhitelabelUploadResult
  })
}

export function useWhitelabelNftApiUploadConceal() {
  return useMutation(async (data: WhitelabelMetadataConcealDto) => {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('concealName', data.concealName)
    const res = await httpClient.post(METADATA_CONCEAL_URL, formData)
    return res.data as WhitelabelUploadResult
  })
}

export function useWhitelabelNftApiValidate() {
  return useMutation(async (data: WhitelabelMetadataValidateDto) => {
    const formData = new FormData()
    formData.append('spreadsheet', data.spreadsheet)
    data.nftImages.forEach((nftImage) => {
      formData.append('images', nftImage)
    })
    const res = await httpClient.post(METADATA_VALIDATE_URL, formData)
    return res
  })
}

export function useWhitelabelNftApiCollection(whitelabelNftAddress: string) {
  return useQuery(['useWhitelabelNftApiCollection', whitelabelNftAddress], async () => {
    const res = await httpClient.get(`${COLLECTION_GET_URL}/${whitelabelNftAddress}`)
    return res
  })
}

export function useWhitelabelNftApiCollectionUpsert() {
  return useMutation(async (data: WhitelabelCollectionUpsertDto) => {
    const res = await httpClient.post(COLLECTION_UPSERT_URL, data)
    return res
  })
}
