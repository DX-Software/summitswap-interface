import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react';
import { kickstarterClient } from 'utils/graphql'

export type Contribution = {
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
  query backedKickstarters($address: Bytes!) {
    contributions(first: 100, orderBy: createdAt, orderDirection: desc, where: { contributor: $address }) {
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

const fetchBackedKickstarters = async (address?: string | null): Promise<{ data?: Contribution[]; error: boolean }> => {
  try {
    if (!address) return { data: [], error: false }
    const data = await kickstarterClient.request<{contributions: Contribution[]}>(BACKED_KICKSTARTERS, {
      address: address.toLowerCase(),
    })
    return { data: data.contributions, error: false }
  } catch (error) {
    console.error(`Failed to fetch transactions for pool ${address}`, error)
    return {
      error: true,
    }
  }
}

const useBackedKickstarter = (address?: string | null): Contribution[] => {
  const [backedProjects, setBackedProjects] = useState<Contribution[]>([])
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchBackedKickstarters(address)
      if (fetchError) {
        setIsError(true)
      } else if (data) {
        setBackedProjects(data)
      }
    }
    if (!isError) {
      fetch()
    }
  }, [address, isError])

  return backedProjects
}

export default useBackedKickstarter
