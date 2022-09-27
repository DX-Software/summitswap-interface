import { gql } from 'graphql-request'

export const WHITELABEL_NFT_FACTORY_BY_ID_GQL = gql`
  query whitelabelNftFactory($address: Bytes!) {
    whitelabelNftFactory(id: $address) {
      id
      totalWhitelabelNft
    }
  }
`

export const WHITELABEL_NFT_COLLECTION_BY_ID_GQL = gql`
  query whitelabelNftCollection($address: Bytes!) {
    whitelabelNftCollection(id: $address) {
      id
      owner {
        id
      }
      name
      symbol
      description
      previewImageUrl
      baseTokenURI
      maxSupply
      whitelistMintPrice
      publicMintPrice
      phase
      isReveal
      totalOwner
      createdAt
    }
  }
`

export const WHITELABEL_NFT_COLLECTIONS_GQL = gql`
  query whitelabelNftCollections($first: Int!, $skip: Int!, $phases: [Int!]) {
    whitelabelNftCollections(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      owner {
        id
      }
      name
      symbol
      description
      previewImageUrl
      baseTokenURI
      maxSupply
      whitelistMintPrice
      publicMintPrice
      phase
      isReveal
      totalOwner
      createdAt
    }
  }
`

export const WHITELABEL_NFT_COLLECTIONS_SEARCH_GQL = gql`
  query whitelabelNftCollectionSearch($first: Int!, $skip: Int!, $text: Bytes!) {
    whitelabelNftCollectionSearch(text: $text, first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      owner {
        id
      }
      name
      symbol
      description
      previewImageUrl
      baseTokenURI
      maxSupply
      whitelistMintPrice
      publicMintPrice
      phase
      isReveal
      totalOwner
      createdAt
    }
  }
`

export const WHITELABEL_NFT_ITEMS_GQL = gql`
  query whitelabelNftItems($first: Int!, $skip: Int!, $collectionAddress: Bytes!) {
    whitelabelNftItems(
      first: $first
      skip: $skip
      orderBy: tokenId
      orderDirection: desc
      where: { collection: $collectionAddress }
    ) {
      id
      collection {
        id
        owner {
          id
        }
        name
        symbol
        description
        previewImageUrl
        baseTokenURI
        maxSupply
        whitelistMintPrice
        publicMintPrice
        phase
        isReveal
        totalOwner
        createdAt
      }
      tokenId
      owner {
        id
      }
    }
  }
`
