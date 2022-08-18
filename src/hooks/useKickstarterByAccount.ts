import BigNumber from 'bignumber.js'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { kickstarterClient } from 'utils/graphql'

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
  query kickstarters($first: Int!, $owner: Bytes!) {
    kickstarters(
      first: $first, orderBy: createdAt, orderDirection: desc,
      where: { owner: $owner }
    ) {
      id
      owner {
        id
      }
      title
      creator
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

const fetchKickstarters = async (account: string, perPage: number): Promise<{ data?: Kickstarter[]; error: boolean }> => {
  try {
    type Result = {
      id: string,
      owner: {
        id: string
      },
      title: string,
      creator: string,
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

    const data: Result[] = (await kickstarterClient.request<{
      kickstarters: Result[]
    }>(KICKSTARTERS, {
      first: perPage,
      owner: account.toLowerCase(),
    })).kickstarters

    const kickstarter: Kickstarter[] = data.map((item) => {
      return {
        id: item.id,
        owner: item.owner,
        title: item.title,
        creator: item.creator,
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

const useKickstarters = (account?: string | null, perPage = 6): Kickstarter[] | undefined => {
  const [kickstarters, setKickstarters] = useState<Kickstarter[]>()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchKickstarters(account || "", perPage)
      if (fetchError) {
        setIsError(true)
      } else if (data) {
        setKickstarters(data)
      }
    }
    if (!isError) {
      fetch()
    }
  }, [account, perPage, isError])

  return kickstarters
}

export default useKickstarters