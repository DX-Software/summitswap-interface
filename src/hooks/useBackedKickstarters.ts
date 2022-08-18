import BigNumber from 'bignumber.js';
import { PER_PAGE } from 'constants/kickstarter';
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react';
import { kickstarterClient } from 'utils/graphql'

export type BackedKickstarter = {
  id: string
  amount: BigNumber
  kickstarter: {
    id: string
    title: string
    creator: string
    totalContribution: BigNumber
    projectGoals: BigNumber
    startTimestamp: number
    endTimestamp: number
  }
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
          id: string
          title: string
          creator: string
          totalContribution: string
          projectGoals: string
          startTimestamp: string
          endTimestamp: string
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
          title: contribution.kickstarter.title,
          creator: contribution.kickstarter.creator,
          totalContribution: new BigNumber(contribution.kickstarter.totalContribution),
          projectGoals: new BigNumber(contribution.kickstarter.projectGoals),
          startTimestamp: Number(contribution.kickstarter.startTimestamp),
          endTimestamp: Number(contribution.kickstarter.endTimestamp),
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
