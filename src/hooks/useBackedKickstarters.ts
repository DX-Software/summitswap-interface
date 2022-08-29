import BigNumber from 'bignumber.js';
import { PER_PAGE } from 'constants/kickstarter';
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react';
import { kickstarterClient } from 'utils/graphql'
import { Kickstarter } from './useKickstarters';

export type BackedKickstarter = {
  id: string
  amount: BigNumber
  kickstarter: Kickstarter
}

const BACKED_KICKSTARTERS = gql`
  query backedKickstarters($address: Bytes!, $first: Int!, $skip: Int!) {
    backedKickstarters(
      first: $first, orderBy: lastUpdated, orderDirection: desc,
      where: { contributor: $address }, skip: $skip
    ) {
      id
      amount
      kickstarter {
        id
        title
        creator
        imageUrl
        totalContribution
        projectGoals
        startTimestamp
        endTimestamp
      }
    }
  }
`

const fetchBackedKickstarters = async (address: string | null, page: number, perPage: number): Promise<{ data?: BackedKickstarter[]; error: boolean }> => {
  try {
    if (!address) return { data: [], error: false }
    const data = await kickstarterClient.request<{
      backedKickstarters: {
        id: string
        amount: string
        kickstarter: {
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
      }[]
    }>(BACKED_KICKSTARTERS, {
      address: address.toLowerCase(),
      first: perPage,
      skip: (page - 1) * perPage,
    })
    const contributions: BackedKickstarter[] = data.backedKickstarters.map((contribution) => {
      return {
        id: contribution.id,
        amount: new BigNumber(contribution.amount),
        kickstarter: {
          id: contribution.kickstarter.id,
          owner: contribution.kickstarter.owner,
          title: contribution.kickstarter.title,
          creator: contribution.kickstarter.creator,
          imageUrl: contribution.kickstarter.imageUrl,
          projectDescription: contribution.kickstarter.projectDescription,
          rewardDescription: contribution.kickstarter.rewardDescription,
          minContribution: new BigNumber(contribution.kickstarter.minContribution),
          totalContribution: new BigNumber(contribution.kickstarter.totalContribution),
          projectGoals: new BigNumber(contribution.kickstarter.projectGoals),
          rewardDistributionTimestamp: Number(contribution.kickstarter.rewardDistributionTimestamp),
          hasDistributedRewards: contribution.kickstarter.hasDistributedRewards,
          startTimestamp: Number(contribution.kickstarter.startTimestamp),
          endTimestamp: Number(contribution.kickstarter.endTimestamp),
          createdAt: Number(contribution.kickstarter.createdAt),
        }
      }
    })
    return { data: contributions, error: false }
  } catch (error) {
    console.error(`Failed to fetch backed kickstarters for address ${address}`, error)
    return {
      error: true,
    }
  }
}

const useBackedKickstarters = (address?: string | null, page = 1, perPage = PER_PAGE): BackedKickstarter[] | undefined => {
  const [backedProjects, setBackedProjects] = useState<BackedKickstarter[] | undefined>(undefined)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchBackedKickstarters(address || "", page, perPage)
      if (fetchError) {
        setIsError(true)
      } else if (data) {
        setBackedProjects(data)
      }
    }
    if (!isError) {
      fetch()
    }
  }, [address, page, perPage, isError])

  return backedProjects
}

export default useBackedKickstarters
