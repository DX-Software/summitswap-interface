import { BACKEND_API } from 'constants/index'
import { WALLET_LOGIN_ACCESS_TOKEN_KEY } from 'constants/walletLogin'
import { PER_PAGE, Phase } from 'constants/whitelabel'
import { useInfiniteQuery, useMutation, useQuery } from 'react-query'
import {
  WhitelabelCollectionResult,
  WhitelabelCollectionUpsertDto,
  WhitelabelMetadataConcealDto,
  WhitelabelMetadataUploadDto,
  WhitelabelMetadataValidateDto,
  WhitelabelNftCollectionGql,
  WhitelabelNftItemGql,
  WhitelabelNftOwnerGql,
  WhitelabelSignatureResult,
  WhitelabelSignaturesAddDto,
  WhitelabelSignaturesDeleteAllDto,
  WhitelabelSignaturesDeleteDto,
  WhitelabelSignaturesResult,
  WhitelabelUploadResult,
} from 'types/whitelabelNft'
import { whitelabelNftClient } from 'utils/graphql'
import {
  convertToWhitelabelNftAccount,
  convertToWhitelabelNftCollection,
  convertToWhitelabelNftFactory,
  convertToWhitelabelNftItem,
  convertToWhitelabelNftOwner,
} from 'utils/whitelabelNft'
import httpClient from './http'
import {
  WHITELABEL_NFT_ACCOUNT_BY_ID_GQL,
  WHITELABEL_NFT_COLLECTIONS_GQL,
  WHITELABEL_NFT_COLLECTIONS_SEARCH_GQL,
  WHITELABEL_NFT_COLLECTION_BY_ID_GQL,
  WHITELABEL_NFT_COLLECTION_BY_OWNER_GQL,
  WHITELABEL_NFT_FACTORY_BY_ID_GQL,
  WHITELABEL_NFT_ITEMS_BY_COLLECTION_GQL,
  WHITELABEL_NFT_ITEMS_BY_OWNER_GQL,
  WHITELABEL_NFT_ITEM_GQL,
  WHITELABEL_NFT_OWNERS_BY_OWNER_GQL,
  WHITELABEL_NFT_OWNER_BY_ID_GQL,
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

export function useWhitelabelNftAccountById(account: string) {
  return useQuery(['useWhitelabelNftAccountById', account], async () => {
    const data = await whitelabelNftClient.request(WHITELABEL_NFT_ACCOUNT_BY_ID_GQL, {
      address: account.toLowerCase(),
    })
    const whitelabelAccount = convertToWhitelabelNftAccount(data.account)
    return whitelabelAccount
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

      const filter = {
        text: searchText,
        phases,
        first: perPage,
        skip: (page - 1) * perPage,
      }
      if (!searchText) delete filter.text

      const data = await whitelabelNftClient.request(query, filter)
      const whitelabelNftCollections: WhitelabelNftCollectionGql[] = data.whitelabelNftCollections.map((whitelabel) =>
        convertToWhitelabelNftCollection(whitelabel)
      )
      return whitelabelNftCollections
    },
    { refetchOnWindowFocus: true }
  )
}

export function useWhitelabelNftCollectionsByOwner(page = 1, perPage = PER_PAGE, ownerAddress: string) {
  return useQuery(
    ['useWhitelabelNftCollectionsByOwner', page, perPage, ownerAddress],
    async () => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_COLLECTION_BY_OWNER_GQL, {
        first: perPage,
        skip: (page - 1) * perPage,
        ownerAddress: ownerAddress.toLowerCase(),
      })
      const whitelabelNftCollections: WhitelabelNftCollectionGql[] = data.whitelabelNftCollections.map((whitelabel) =>
        convertToWhitelabelNftCollection(whitelabel)
      )
      return whitelabelNftCollections
    },
    { refetchOnWindowFocus: true }
  )
}

export function useWhitelabelNftItemsByCollection(collectionAddress: string, perPage = PER_PAGE) {
  return useInfiniteQuery(
    ['useWhitelabelNftItemsByCollection', perPage, collectionAddress],
    async ({ pageParam = 1 }) => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_ITEMS_BY_COLLECTION_GQL, {
        first: perPage,
        skip: (pageParam - 1) * perPage,
        collectionAddress,
      })
      const whitelabelNftCollections: WhitelabelNftItemGql[] = data.whitelabelNftItems.map((whitelabel) =>
        convertToWhitelabelNftItem(whitelabel)
      )
      return whitelabelNftCollections
    },
    {
      refetchOnWindowFocus: true,
      getNextPageParam: (lastPage, pages) => {
        const nextPage = pages.length + 1
        return lastPage.length < perPage ? undefined : nextPage
      },
    }
  )
}

export function useWhitelabelNftItemsByOwner(
  ownerAddress: string,
  isReveals: boolean[],
  searchText?: string,
  perPage = PER_PAGE
) {
  return useInfiniteQuery(
    ['useWhitelabelNftItemsByOwner', perPage, ownerAddress, isReveals, searchText],
    async ({ pageParam = 1 }) => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_ITEMS_BY_OWNER_GQL, {
        first: perPage,
        skip: (pageParam - 1) * perPage,
        ownerAddress: ownerAddress.toLowerCase(),
        isReveals,
        text: searchText || '',
      })
      const whitelabelNftCollections: WhitelabelNftItemGql[] = data.whitelabelNftItems.map((whitelabel) =>
        convertToWhitelabelNftItem(whitelabel)
      )
      return whitelabelNftCollections
    },
    {
      refetchOnWindowFocus: true,
      getNextPageParam: (lastPage, pages) => {
        const nextPage = pages.length + 1
        return lastPage.length < perPage ? undefined : nextPage
      },
    }
  )
}

export function useWhitelabelNftItemById(id: string) {
  return useQuery(
    ['useWhitelabelNftItemById', id],
    async () => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_ITEM_GQL, {
        id,
      })
      const whitelabelNftItem: WhitelabelNftItemGql | undefined = convertToWhitelabelNftItem(data.whitelabelNftItem)
      return whitelabelNftItem
    },
    { refetchOnWindowFocus: true }
  )
}

export function useWhitelabelNftOwnerById(id: string) {
  return useQuery(
    ['useWhitelabelNftOwnerById', id],
    async () => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_OWNER_BY_ID_GQL, {
        id: id.toLowerCase(),
      })
      const whitelabelNftOwner: WhitelabelNftOwnerGql | undefined = convertToWhitelabelNftOwner(data.nftOwner)
      return whitelabelNftOwner
    },
    { refetchOnWindowFocus: true }
  )
}

export function useWhitelabelNftOwnersByOwner(owner: string, searchText?: string) {
  return useQuery(
    ['useWhitelabelNftOwnersByOwner', owner, searchText],
    async () => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_OWNERS_BY_OWNER_GQL, {
        owner: owner.toLowerCase(),
        text: searchText || '',
      })
      const whitelabelNftOwners: WhitelabelNftOwnerGql[] = data.nftOwners.map((whitelabel) =>
        convertToWhitelabelNftOwner(whitelabel)
      )

      return whitelabelNftOwners
    },
    { refetchOnWindowFocus: true }
  )
}

export function useWhitelabelNftItemsByCollectionAndOwner(
  collectionAddress: string,
  ownerAddress: string,
  perPage = PER_PAGE
) {
  return useInfiniteQuery(
    ['useWhitelabelNftItemsByCollectionAndOwner', perPage, ownerAddress, collectionAddress],
    async ({ pageParam = 1 }) => {
      const data = await whitelabelNftClient.request(WHITELABEL_NFT_ITEMS_BY_COLLECTION_GQL, {
        first: perPage,
        skip: (pageParam - 1) * perPage,
        collectionAddress,
      })
      const whitelabelNftCollections: WhitelabelNftItemGql[] = data.whitelabelNftItems
        .map((whitelabel) => convertToWhitelabelNftItem(whitelabel))
        .filter((item) => item.owner.id === ownerAddress.toLowerCase())
      return whitelabelNftCollections
    },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) => {
        const nextPage = pages.length + 1
        return lastPage.length < perPage ? undefined : nextPage
      },
    }
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
      formData.append('imageFilenames', nftImage)
    })
    const res = await httpClient.post(METADATA_VALIDATE_URL, formData)
    return res
  })
}

export function useWhitelabelNftApiCollection(whitelabelNftAddress: string) {
  return useQuery(['useWhitelabelNftApiCollection', whitelabelNftAddress], async () => {
    const res = await httpClient.get(`${COLLECTION_GET_URL}${whitelabelNftAddress}`)
    return res.data as WhitelabelCollectionResult
  })
}

export function useWhitelabelNftApiCollectionUpsert() {
  return useMutation(async (data: WhitelabelCollectionUpsertDto) => {
    const res = await httpClient.post(COLLECTION_UPSERT_URL, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)}`,
      },
    })
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
    const res = await httpClient.post(SIGNATURES_STORE_URL, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)}`,
      },
    })
    return res
  })
}

// delete selected
export function useWhitelabelNftApiDeleteSignatures() {
  return useMutation(async (data: WhitelabelSignaturesDeleteDto) => {
    const res = await httpClient.delete(SIGNATURES_DELETE_URL, {
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)}`,
      },
    })
    return res
  })
}

// delete all
export function useWhitelabelNftApiDeleteAllSignatures() {
  return useMutation(async (data: WhitelabelSignaturesDeleteAllDto) => {
    const res = await httpClient.delete(SIGNATURES_DELETE_ALL_URL, {
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)}`,
      },
    })
    return res
  })
}
