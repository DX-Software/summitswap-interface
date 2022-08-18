import BigNumber from 'bignumber.js'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { kickstarterClient } from 'utils/graphql'

export type KickstarterFactory = {
  id: string
  totalKickstarter: BigNumber
  totalBackedKickstarter: BigNumber
  totalProjectGoals: BigNumber
  totalContribution: BigNumber
}

const KICKSTARTER_FACTORY = gql`
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

const fetchKickstarterFactory = async (address?: string | null): Promise<{ data?: KickstarterFactory; error: boolean }> => {
  try {
    if (!address) return { error: false }
    const data = await kickstarterClient.request<{
      summitKickstarterFactory: {
        id: string,
        totalKickstarter: string,
        totalBackedKickstarter: string,
        totalProjectGoals: string,
        totalContribution: string,
      }
    }>(KICKSTARTER_FACTORY, {
      address,
    })

    const kickstarterFactory: KickstarterFactory = {
      id: data.summitKickstarterFactory.id,
      totalKickstarter: new BigNumber(data.summitKickstarterFactory.totalKickstarter),
      totalBackedKickstarter: new BigNumber(data.summitKickstarterFactory.totalBackedKickstarter),
      totalProjectGoals: new BigNumber(data.summitKickstarterFactory.totalProjectGoals),
      totalContribution: new BigNumber(data.summitKickstarterFactory.totalContribution),
    }
    return { data: kickstarterFactory, error: false }
  } catch (error) {
    console.error(`Failed to fetch kickstarter factory for address ${address}`, error)
    return {
      error: true,
    }
  }
}

const useKickstarterFactory = (address?: string | null): KickstarterFactory | undefined => {
  const [kickstarterFactory, setKickstarterFactory] = useState<KickstarterFactory>()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchKickstarterFactory(address)
      if (fetchError) {
        setIsError(true)
      } else if (data) {
        setKickstarterFactory(data)
      }
    }
    if (!isError) {
      fetch()
    }
  }, [address, isError])

  return kickstarterFactory
}

export default useKickstarterFactory
