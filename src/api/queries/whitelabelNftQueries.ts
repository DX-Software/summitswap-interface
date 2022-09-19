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
      maxSupply
      whitelistMintPrice
      publicMintPrice
      phase
      isReveal
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
      maxSupply
      whitelistMintPrice
      publicMintPrice
      phase
      isReveal
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
      maxSupply
      whitelistMintPrice
      publicMintPrice
      phase
      isReveal
      createdAt
    }
  }
`

// export const KICKSTARTER_ACCOUNT_BY_ID = gql`
//   query account($address: Bytes!) {
//     account(id: $address) {
//       id
//       totalKickstarter
//       totalBackedKickstarter
//       totalContribution
//     }
//   }
// `

// export const KICKSTARTERS_BY_ACCOUNT_ID = gql`
//   query kickstarters($first: Int!, $skip: Int!, $address: Bytes!) {
//     kickstarters(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc, where: { owner: $address }) {
//       id
//       paymentToken
//       tokenSymbol
//       approvalStatus
//       owner {
//         id
//       }
//       title
//       creator
//       imageUrl
//       projectDescription
//       rewardDescription
//       minContribution
//       totalContributor
//       totalContribution
//       projectGoals
//       rewardDistributionTimestamp
//       startTimestamp
//       endTimestamp
//       createdAt
//     }
//   }
// `

// export const KICKSTARTERS = gql`
//   query kickstarters($first: Int!, $skip: Int!, $orderBy: Bytes!, $orderDirection: Bytes!) {
//     kickstarters(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
//       id
//       paymentToken
//       tokenSymbol
//       approvalStatus
//       owner {
//         id
//       }
//       title
//       creator
//       imageUrl
//       projectDescription
//       rewardDescription
//       minContribution
//       totalContributor
//       totalContribution
//       projectGoals
//       rewardDistributionTimestamp
//       startTimestamp
//       endTimestamp
//       createdAt
//     }
//   }
// `

// export const KICKSTARTERS_BY_APPROVAL_STATUSES = gql`
//   query kickstarters($approvalStatuses: [String!], $first: Int!, $skip: Int!, $orderBy: Bytes!, $orderDirection: Bytes!) {
//     kickstarters(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: { approvalStatus_in: $approvalStatuses }) {
//       id
//       paymentToken
//       tokenSymbol
//       approvalStatus
//       owner {
//         id
//       }
//       title
//       creator
//       imageUrl
//       projectDescription
//       rewardDescription
//       minContribution
//       totalContributor
//       totalContribution
//       projectGoals
//       rewardDistributionTimestamp
//       startTimestamp
//       endTimestamp
//       percentageFeeAmount
//       fixFeeAmount
//       rejectedReason
//       createdAt
//     }
//   }
// `

// export const KICKSTARTERS_SEARCH = gql`
//   query kickstarters($text: Bytes!, $first: Int!, $skip: Int!, $orderBy: Bytes!, $orderDirection: Bytes!, $approvalStatuses: [String!]) {
//     kickstarterSearch(text: $text, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: { approvalStatuses_in: $approvalStatuses }) {
//       id
//       paymentToken
//       tokenSymbol
//       approvalStatus
//       owner {
//         id
//       }
//       title
//       creator
//       imageUrl
//       projectDescription
//       rewardDescription
//       minContribution
//       totalContributor
//       totalContribution
//       projectGoals
//       rewardDistributionTimestamp
//       startTimestamp
//       endTimestamp
//       createdAt
//     }
//   }
// `

// export const KICKSTARTERS_BY_END_TIME_BETWEEN = gql`
//   query kickstarters($first: Int!, $skip: Int!, $startTimestamp: BigInt!, $endTimestamp: BigInt!, $approvalStatuses: [String!]) {
//     kickstarters(
//       first: $first
//       skip: $skip
//       where: { endTimestamp_gte: $startTimestamp, endTimestamp_lte: $endTimestamp, approvalStatuses_in: $approvalStatuses }
//     ) {
//       id
//       paymentToken
//       tokenSymbol
//       approvalStatus
//       owner {
//         id
//       }
//       title
//       creator
//       imageUrl
//       projectDescription
//       rewardDescription
//       minContribution
//       totalContributor
//       totalContribution
//       projectGoals
//       rewardDistributionTimestamp
//       startTimestamp
//       endTimestamp
//       createdAt
//     }
//   }
// `

// export const BACKED_KICKSTARTERS_BY_CONTRIBUTOR_ID = gql`
//   query backedKickstarters($address: Bytes!, $first: Int!, $skip: Int!) {
//     backedKickstarters(
//       first: $first
//       orderBy: lastUpdated
//       orderDirection: desc
//       where: { contributor: $address }
//       skip: $skip
//     ) {
//       id
//       amount
//       kickstarter {
//         id
//         paymentToken
//         tokenSymbol
//         approvalStatus
//         owner {
//           id
//         }
//         title
//         creator
//         imageUrl
//         projectDescription
//         rewardDescription
//         minContribution
//         totalContributor
//         totalContribution
//         projectGoals
//         rewardDistributionTimestamp
//         startTimestamp
//         endTimestamp
//         createdAt
//       }
//     }
//   }
// `

// export const BACKED_KICKSTARTER_BY_ID = gql`
//   query backedKickstarter($id: Bytes!) {
//     backedKickstarter(id: $id) {
//       id
//       amount
//       contributor {
//         id
//       }
//       kickstarter {
//         id
//         paymentToken
//         tokenSymbol
//         approvalStatus
//         owner {
//           id
//         }
//         title
//         creator
//         imageUrl
//         projectDescription
//         rewardDescription
//         minContribution
//         totalContributor
//         totalContribution
//         projectGoals
//         rewardDistributionTimestamp
//         startTimestamp
//         endTimestamp
//         createdAt
//       }
//     }
//   }
// `

// export const BACKED_KICKSTARTERS_BY_KICKSTARTER_ADDRESS = gql`
//   query backedKickstarters($address: Bytes!, $first: Int!, $skip: Int!) {
//     backedKickstarters(
//       first: $first
//       orderBy: lastUpdated
//       orderDirection: desc
//       where: { kickstarter: $address }
//       skip: $skip
//     ) {
//       id
//       amount
//       contributor {
//         id
//       }
//       kickstarter {
//         id
//         paymentToken
//         tokenSymbol
//         approvalStatus
//         owner {
//           id
//         }
//         title
//         creator
//         imageUrl
//         projectDescription
//         rewardDescription
//         minContribution
//         totalContributor
//         totalContribution
//         projectGoals
//         rewardDistributionTimestamp
//         startTimestamp
//         endTimestamp
//         createdAt
//       }
//     }
//   }
// `
