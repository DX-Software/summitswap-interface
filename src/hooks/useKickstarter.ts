import BigNumber from 'bignumber.js'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { kickstarterClient } from 'utils/graphql'

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
  totalContributor: number
  totalContribution: BigNumber
  projectGoals: BigNumber
  rewardDistributionTimestamp: number
  hasDistributedRewards: boolean
  startTimestamp: number
  endTimestamp: number
  createdAt: number
}

const KICKSTARTER = gql`
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
      hasDistributedRewards
      startTimestamp
      endTimestamp
      createdAt
    }
  }
`

const fetchKickstarter = async (address?: string | null): Promise<{ data?: Kickstarter; error: boolean }> => {
  try {
    if (!address) return { error: false }
    const data = await kickstarterClient.request<{
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
    }>(KICKSTARTER, {
      address: address.toLowerCase(),
    })

    const kickstarter: Kickstarter = {
      id: data.kickstarter.id,
      owner: data.kickstarter.owner,
      title: data.kickstarter.title,
      creator: data.kickstarter.creator,
      imageUrl: data.kickstarter.imageUrl,
      projectDescription: data.kickstarter.projectDescription,
      rewardDescription: data.kickstarter.rewardDescription,
      minContribution: new BigNumber(data.kickstarter.minContribution),
      totalContributor: Number(data.kickstarter.totalContributor),
      totalContribution: new BigNumber(data.kickstarter.totalContribution),
      projectGoals: new BigNumber(data.kickstarter.projectGoals),
      rewardDistributionTimestamp: Number(data.kickstarter.rewardDistributionTimestamp),
      hasDistributedRewards: data.kickstarter.hasDistributedRewards,
      startTimestamp: Number(data.kickstarter.startTimestamp),
      endTimestamp: Number(data.kickstarter.endTimestamp),
      createdAt: Number(data.kickstarter.createdAt),
    }
    return { data: kickstarter, error: false }
  } catch (error) {
    console.error(`Failed to fetch kickstarter for address ${address}`, error)
    return {
      error: true,
    }
  }
}

const useKickstarter = (address?: string | null): Kickstarter | undefined => {
  const [kickstarter, setKickstarter] = useState<Kickstarter>()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchKickstarter(address)
      if (fetchError) {
        setIsError(true)
      }
      setKickstarter(data)
    }
    if (!isError) {
      fetch()
    }
  }, [address, isError])

  return kickstarter
}

export default useKickstarter
