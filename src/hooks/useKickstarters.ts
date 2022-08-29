import BigNumber from 'bignumber.js'
import { PER_PAGE } from 'constants/kickstarter'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { kickstarterClient } from 'utils/graphql'

export enum OrderBy {
  TITLE = "title",
  CREATOR = "creator",
  TOTAL_CONTRIBUTION = "totalContribution",
  PROJECT_GOALS = "projectGoals",
  START_TIMESTAMP = "startTimestamp",
  END_TIMESTAMP = "endTimestamp",
  CREATED_AT = "createdAt",
}

export enum OrderDirection {
  ASC = "asc",
  DESC = "desc",
}

export type Kickstarter = {
  id: string
  owner: {
    id: string
  }
  title: string
  creator: string
  imageUrl: string
  projectDescription: string
  rewardDescription: string
  minContribution: BigNumber
  totalContribution: BigNumber
  projectGoals: BigNumber
  rewardDistributionTimestamp: number
  hasDistributedRewards: boolean
  startTimestamp: number
  endTimestamp: number
  createdAt: number
}

const KICKSTARTERS = gql`
  query kickstarters($first: Int!, $orderBy: Bytes!, $orderDirection: Bytes!, $skip: Int!) {
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

const KICKSTARTERS_BY_TEXT = gql`
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

const fetchKickstarters = async (searchText: string, orderBy: string, orderDirection: string, page: number, perPage: number): Promise<{ data?: Kickstarter[]; error: boolean }> => {
  try {
    const subgraphGql = searchText === "" ? KICKSTARTERS : KICKSTARTERS_BY_TEXT

    type Result = {
      id: string,
      owner: {
        id: string
      },
      title: string,
      creator: string,
      imageUrl: string,
      projectDescription: string,
      rewardDescription: string,
      minContribution: string,
      totalContribution: string,
      projectGoals: string,
      rewardDistributionTimestamp: string,
      hasDistributedRewards: boolean,
      startTimestamp: string,
      endTimestamp: string,
      createdAt: string,
    }

    type KickstarterResult = {
      kickstarters: Result[]
    }

    type KickstarterSearchResult = {
      kickstarterSearch: Result[]
    }

    let data: Result[];
    if (searchText === "") {
      data = (await kickstarterClient.request<KickstarterResult>(subgraphGql, {
        first: perPage,
        orderBy,
        orderDirection,
        skip: (page - 1) * perPage,
      })).kickstarters
    } else {
      data = (await kickstarterClient.request<KickstarterSearchResult>(subgraphGql, {
        text: `'${searchText}'`,
        first: perPage,
        orderBy,
        orderDirection,
        skip: (page - 1) * perPage,
      })).kickstarterSearch
    }

    const kickstarter: Kickstarter[] = data.map((item) => {
      return {
        id: item.id,
        owner: item.owner,
        title: item.title,
        creator: item.creator,
        imageUrl: item.imageUrl,
        projectDescription: item.projectDescription,
        rewardDescription: item.rewardDescription,
        minContribution: new BigNumber(item.minContribution),
        totalContribution: new BigNumber(item.totalContribution),
        projectGoals: new BigNumber(item.projectGoals),
        rewardDistributionTimestamp: Number(item.rewardDistributionTimestamp),
        hasDistributedRewards: item.hasDistributedRewards,
        startTimestamp: Number(item.startTimestamp),
        endTimestamp: Number(item.endTimestamp),
        createdAt: Number(item.createdAt),
      }
    })
    return { data: kickstarter, error: false }
  } catch (error) {
    console.error(`Failed to fetch kickstarters`, error)
    return {
      error: true,
    }
  }
}

const useKickstarters = (searchText = "", orderBy = OrderBy.TITLE, orderDirection = OrderDirection.ASC, page = 1, perPage = PER_PAGE): Kickstarter[] | undefined => {
  const [kickstarters, setKickstarters] = useState<Kickstarter[]>()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchKickstarters(searchText, orderBy, orderDirection, page, perPage)
      if (fetchError) {
        setIsError(true)
      } else if (data) {
        setKickstarters(data)
      }
    }
    if (!isError) {
      fetch()
    }
  }, [searchText, orderBy, orderDirection, page, perPage, isError])

  return kickstarters
}

export default useKickstarters
