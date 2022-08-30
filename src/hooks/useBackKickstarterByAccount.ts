import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react';
import { kickstarterClient } from 'utils/graphql'
import { Kickstarter } from './useKickstarters';

export type BackedKickstarter = {
  id: string
  contributor: {
    id: string
  }
  amount: BigNumber
  kickstarter: Kickstarter
}

const BACKED_KICKSTARTER = gql`
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

const fetchBackedKickstarterByAccount = async (address: string, account: string): Promise<{ data?: BackedKickstarter; error: boolean }> => {
  try {
    if (!address || !account) return { data: undefined, error: false }
    const data = await kickstarterClient.request<{
      backedKickstarter: {
        id: string
        amount: string
        contributor: {
          id: string
        },
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
          totalContributor: string,
          totalContribution: string,
          projectGoals: string,
          rewardDistributionTimestamp: string,
          hasDistributedRewards: boolean,
          startTimestamp: string,
          endTimestamp: string,
          createdAt: string,
        }
      }
    }>(BACKED_KICKSTARTER, {
      id: `${address.toLowerCase()}-${account.toLowerCase()}`,
    })
    console.log("data", data)
    if (!data.backedKickstarter) return { data: undefined, error: false }

    const contribution: BackedKickstarter = {
      id: data.backedKickstarter.id,
      amount: new BigNumber(data.backedKickstarter.amount),
      contributor: {
        id: data.backedKickstarter.contributor.id,
      },
      kickstarter: {
        id: data.backedKickstarter.id,
        owner: data.backedKickstarter.kickstarter.owner,
        title: data.backedKickstarter.kickstarter.title,
        creator: data.backedKickstarter.kickstarter.creator,
        imageUrl: data.backedKickstarter.kickstarter.imageUrl,
        projectDescription: data.backedKickstarter.kickstarter.projectDescription,
        rewardDescription: data.backedKickstarter.kickstarter.rewardDescription,
        minContribution: new BigNumber(data.backedKickstarter.kickstarter.minContribution),
        totalContributor: Number(data.backedKickstarter.kickstarter.totalContributor),
        totalContribution: new BigNumber(data.backedKickstarter.kickstarter.totalContribution),
        projectGoals: new BigNumber(data.backedKickstarter.kickstarter.projectGoals),
        rewardDistributionTimestamp: Number(data.backedKickstarter.kickstarter.rewardDistributionTimestamp),
        hasDistributedRewards: data.backedKickstarter.kickstarter.hasDistributedRewards,
        startTimestamp: Number(data.backedKickstarter.kickstarter.startTimestamp),
        endTimestamp: Number(data.backedKickstarter.kickstarter.endTimestamp),
        createdAt: Number(data.backedKickstarter.kickstarter.createdAt),
      }
    }
    return { data: contribution, error: false }
  } catch (error) {
    console.error(`Failed to fetch backed kickstarters by account for address ${address}`, error)
    return {
      error: true,
    }
  }
}

const useBackedKickstarterByAccount = (address?: string | null, account?: string | null): BackedKickstarter | undefined => {
  const [backedProject, setBackedProject] = useState<BackedKickstarter | undefined>(undefined)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchBackedKickstarterByAccount(address || "", account || "")
      if (fetchError) {
        setIsError(true)
      }
      setBackedProject(data)
    }
    if (!isError) {
      fetch()
    }
  }, [address, account, isError])

  return backedProject
}

export default useBackedKickstarterByAccount
