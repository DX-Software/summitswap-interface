import { BACKEND_API } from 'constants/index'
import { PER_PAGE, Phase } from 'constants/whitelabel'
import { useMutation, useQuery } from 'react-query'
import {
  WhitelabelCollectionUpsertDto,
  WhitelabelMetadataConcealDto,
  WhitelabelMetadataUploadDto,
  WhitelabelMetadataValidateDto,
  WhitelabelNftCollectionGql,
  WhitelabelNftItemGql,
  WhitelabelSignatureResult,
  WhitelabelSignaturesAddDto,
  WhitelabelSignaturesDeleteAllDto,
  WhitelabelSignaturesDeleteDto,
  WhitelabelSignaturesResult,
  WhitelabelUploadResult,
} from 'types/whitelabelNft'
import { whitelabelNftClient } from 'utils/graphql'
import {
  convertToWhitelabelNftCollection,
  convertToWhitelabelNftFactory,
  convertToWhitelabelNftItem,
} from 'utils/whitelabelNft'
import httpClient from './http'
import {
  WHITELABEL_NFT_COLLECTIONS_GQL,
  WHITELABEL_NFT_COLLECTIONS_SEARCH_GQL,
  WHITELABEL_NFT_COLLECTION_BY_ID_GQL,
  WHITELABEL_NFT_FACTORY_BY_ID_GQL,
  WHITELABEL_NFT_ITEMS_GQL,
} from './queries/whitelabelNftQueries'

const URL = 'whitelabel-nft'
export const DOWNLOAD_METADATA_URL = `${BACKEND_API}/${URL}/metadata/download`
const METADATA_UPLOAD_URL = `${URL}/metadata/upload`
const METADATA_VALIDATE_URL = `${URL}/metadata/validate`
const METADATA_CONCEAL_URL = `${URL}/metadata/conceal`
const COLLECTION_GET_URL = `${URL}/collection/`
const COLLECTION_UPSERT_URL = `${URL}/collection/`
const SIGNATURE_GET_URL = `${URL}/signature/`
const SIGNATURES_GET_URL = `${URL}/signatures/`
const SIGNATURES_STORE_URL = `${URL}/signatures/`
const SIGNATURES_DELETE_URL = `${URL}/signatures/`
const SIGNATURES_DELETE_ALL_URL = `${URL}/signatures/all`

export function useWhitelabelNftFactoryById(whitelabelFactoryId: string) {
  return useQuery(['useWhitelabelNftFactoryById', whitelabelFactoryId], async () => {
    const data = await whitelabelNftClient.request(WHITELABEL_NFT_FACTORY_BY_ID_GQL, {
      address: whitelabelFactoryId.toLowerCase(),
    })
    const whitelabelFactory = convertToWhitelabelNftFactory(data.whitelabelNftFactory)
    return whitelabelFactory
  })
}

export function useWhitelabelNftCollectionById(whitelabelNftAddress: string) {
  return useQuery(
    ['useWhitelabelNftCollectionById', whitelabelNftAddress],
    async () => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_COLLECTION_BY_ID_GQL, {
        address: whitelabelNftAddress.toLowerCase(),
      })
      const whitelabelNft = convertToWhitelabelNftCollection(data.whitelabelNftCollection)
      return whitelabelNft
    },
    { refetchOnWindowFocus: true }
  )
}

export function useWhitelabelNftCollections(
  page = 1,
  perPage = PER_PAGE,
  searchText: string | undefined,
  phases: Phase[]
) {
  return useQuery(
    ['useWhitelabelNftCollections', page, perPage, searchText, phases],
    async () => {
      const query = searchText ? WHITELABEL_NFT_COLLECTIONS_SEARCH_GQL : WHITELABEL_NFT_COLLECTIONS_GQL
      const key = searchText ? 'whitelabelNftCollectionSearch' : 'whitelabelNftCollections'

      const filter = {
        text: searchText,
        first: perPage,
        skip: (page - 1) * perPage,
      }
      if (!searchText) delete filter.text

      const data = await whitelabelNftClient.request(query, filter)
      const whitelabelNftCollections: WhitelabelNftCollectionGql[] = data[key]
        .map((whitelabel) => convertToWhitelabelNftCollection(whitelabel))
        .filter((whitelabelNft) => phases.includes(whitelabelNft.phase))
      return whitelabelNftCollections
    },
    { refetchOnWindowFocus: false }
  )
}

export function useWhitelabelNftItems(collectionAddress: string, page = 1, perPage = PER_PAGE) {
  return useQuery(
    ['useWhitelabelNftItems', page, perPage, collectionAddress],
    async () => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_ITEMS_GQL, {
        first: perPage,
        skip: (page - 1) * perPage,
        collectionAddress,
      })
      const whitelabelNftCollections: WhitelabelNftItemGql[] = data.whitelabelNftItems.map((whitelabel) =>
        convertToWhitelabelNftItem(whitelabel)
      )
      return whitelabelNftCollections
    },
    { refetchOnWindowFocus: false }
  )
}

export function useWhitelabelNftItemsByOwner(
  collectionAddress: string,
  ownerAddress: string,
  page = 1,
  perPage = PER_PAGE
) {
  return useQuery(
    ['useWhitelabelNftItems', page, perPage, ownerAddress, collectionAddress],
    async () => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_ITEMS_GQL, {
        first: perPage,
        skip: (page - 1) * perPage,
        collectionAddress,
      })
      const whitelabelNftCollections: WhitelabelNftItemGql[] = data.whitelabelNftItems
        .map((whitelabel) => convertToWhitelabelNftItem(whitelabel))
        .filter((item) => item.owner.id === ownerAddress.toLowerCase())
      return whitelabelNftCollections
    },
    { refetchOnWindowFocus: false }
  )
}

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

// find one
export function useWhitelabelNftApiSignature(ownerAddress: string, contractAddress: string, whitelistAddress: string) {
  return useQuery(['useWhitelabelNftApiSignature', ownerAddress, contractAddress, whitelistAddress], async () => {
    const res = await httpClient.get(SIGNATURE_GET_URL, {
      params: {
        ownerAddress,
        contractAddress,
        whitelistAddress,
      },
    })
    return res.data as WhitelabelSignatureResult
  })
}

// find all pagination
export function useWhitelabelNftApiSignatures(
  ownerAddress: string,
  contractAddress: string,
  page: number,
  perPage: number
) {
  return useQuery(['useWhitelabelNftApiSignatures', ownerAddress, contractAddress, page, perPage], async () => {
    const res = await httpClient.get(SIGNATURES_GET_URL, {
      params: {
        ownerAddress,
        contractAddress,
        page,
        perPage,
      },
    })
    return res.data as WhitelabelSignaturesResult
  })
}

// store
export function useWhitelabelNftApiStoreSignatures() {
  return useMutation(async (data: WhitelabelSignaturesAddDto) => {
    const res = await httpClient.post(SIGNATURES_STORE_URL, data)
    return res
  })
}

// delete selected
export function useWhitelabelNftApiDeleteSignatures() {
  return useMutation(async (data: WhitelabelSignaturesDeleteDto) => {
    const res = await httpClient.delete(SIGNATURES_DELETE_URL, {
      data,
    })
    return res
  })
}

// delete all
export function useWhitelabelNftApiDeleteAllSignatures() {
  return useMutation(async (data: WhitelabelSignaturesDeleteAllDto) => {
    const res = await httpClient.delete(SIGNATURES_DELETE_ALL_URL, {
      data,
    })
    return res
  })
}
