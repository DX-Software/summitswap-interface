import { gql } from 'graphql-request'

export const KICKSTARTER_FACTORY_BY_ID = gql`
  query kickstarterFactory($address: Bytes!) {
    summitKickstarterFactory(id: $address) {
      id
      totalKickstarter
      totalBackedKickstarter
      totalProjectGoals
      totalContribution
    }
  }
`

export const KICKSTARTER_BY_ID = gql`
  query kickstarter($address: Bytes!) {
    kickstarter(id: $address) {
      id
      owner {
        id
      }
      title
      creator
      imageUrl
      projectDescription
      rewardDescription
      minContribution
      totalContributor
      totalContribution
      projectGoals
      rewardDistributionTimestamp
      startTimestamp
      endTimestamp
      createdAt
    }
  }
`

export const KICKSTARTER_ACCOUNT_BY_ID = gql`
  account(id: $address) {
    id
    totalKickstarter
    totalBackedKickstarter
    totalProjectGoals
    totalContribution
  }
`

export const KICKSTARTER_BY_ACCOUNT_ID = gql`
  query kickstarters($first: Int!, $skip: Int!, $owner: Bytes!) {
    kickstarters(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc, where: { owner: $owner }) {
      id
      owner {
        id
      }
      title
      creator
      imageUrl
      projectDescription
      rewardDescription
      minContribution
      totalContributor
      totalContribution
      projectGoals
      rewardDistributionTimestamp
      hasDistributedRewards
      startTimestamp
      endTimestamp
      createdAt
    }
  }
`

export const KICKSTARTERS = gql`
  kickstarters(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
    id
    owner {
      id
    }
    title
    creator
    imageUrl
    projectDescription
    rewardDescription
    minContribution
    totalContributor
    totalContribution
    projectGoals
    rewardDistributionTimestamp
    hasDistributedRewards
    startTimestamp
    endTimestamp
    createdAt
  }
`

export const KICKSTARTERS_SEARCH = gql`
  query kickstarters($text: Bytes!, $first: Int!, $orderBy: Bytes!, $orderDirection: Bytes!, $skip: Int!) {
    kickstarterSearch(text: $text, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      owner {
        id
      }
      title
      creator
      imageUrl
      projectDescription
      rewardDescription
      minContribution
      totalContributor
      totalContribution
      projectGoals
      rewardDistributionTimestamp
      hasDistributedRewards
      startTimestamp
      endTimestamp
      createdAt
    }
  }
`

export const KICKSTARTERS_END_TIME_BETWEEN = gql`
  query kickstarters($first: Int!, $startTimestamp: BigInt!, $endTimestamp: BigInt!) {
    kickstarters(first: $first, where: { endTimestamp_gte: $startTimestamp, endTimestamp_lte: $endTimestamp }) {
      id
      owner {
        id
      }
      title
      creator
      imageUrl
      projectDescription
      rewardDescription
      minContribution
      totalContributor
      totalContribution
      projectGoals
      rewardDistributionTimestamp
      hasDistributedRewards
      startTimestamp
      endTimestamp
      createdAt
    }
  }
`

export const BACKED_KICKSTARTERS = gql`
  query backedKickstarters($address: Bytes!, $first: Int!, $skip: Int!) {
    backedKickstarters(
      first: $first
      orderBy: lastUpdated
      orderDirection: desc
      where: { contributor: $address }
      skip: $skip
    ) {
      id
      amount
      kickstarter {
        id
        owner {
          id
        }
        title
        creator
        imageUrl
        projectDescription
        rewardDescription
        minContribution
        totalContributor
        totalContribution
        projectGoals
        rewardDistributionTimestamp
        hasDistributedRewards
        startTimestamp
        endTimestamp
        createdAt
      }
    }
  }
`

export const BACKED_KICKSTARTERS_BY_ID = gql`
  query backedKickstarter($id: Bytes!) {
    backedKickstarter(id: $id) {
      id
      amount
      contributor {
        id
      }
      kickstarter {
        id
        owner {
          id
        }
        title
        creator
        imageUrl
        projectDescription
        rewardDescription
        minContribution
        totalContributor
        totalContribution
        projectGoals
        rewardDistributionTimestamp
        hasDistributedRewards
        startTimestamp
        endTimestamp
        createdAt
      }
    }
  }
`

export const BACKED_KICKSTARTERS_BY_KICKSTARTER_ADDRESS = gql`
  query backedKickstarters($address: Bytes!, $first: Int!, $skip: Int!) {
    backedKickstarters(
      first: $first
      orderBy: lastUpdated
      orderDirection: desc
      where: { kickstarter: $address }
      skip: $skip
    ) {
      id
      amount
      contributor {
        id
      }
      kickstarter {
        id
        owner {
          id
        }
        title
        creator
        imageUrl
        projectDescription
        rewardDescription
        minContribution
        totalContributor
        totalContribution
        projectGoals
        rewardDistributionTimestamp
        hasDistributedRewards
        startTimestamp
        endTimestamp
        createdAt
      }
    }
  }
`
