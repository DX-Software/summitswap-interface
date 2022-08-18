import BigNumber from 'bignumber.js'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { kickstarterClient } from 'utils/graphql'

export type KickstarterAccount = {
  id: string
  totalKickstarter: BigNumber
  totalBackedKickstarter: BigNumber
  totalProjectGoals: BigNumber
  totalContribution: BigNumber
}

const KICKSTARTER_ACCOUNT = gql`
  query kickstarterAccount($address: Bytes!) {
    account(id: $address) {
      id
      totalKickstarter
      totalBackedKickstarter
      totalProjectGoals
      totalContribution
    }
  }
`

const fetchKickstarterAccount = async (address?: string | null): Promise<{ data?: KickstarterAccount; error: boolean }> => {
  try {
    if (!address) return { error: false }
    const data = await kickstarterClient.request<{
      account: {
        id: string,
        totalKickstarter: string,
        totalBackedKickstarter: string,
        totalProjectGoals: string,
        totalContribution: string,
      }
    }>(KICKSTARTER_ACCOUNT, {
      address: address.toLowerCase(),
    })

    const kickstarterAccount: KickstarterAccount = {
      id: data.account.id,
      totalKickstarter: new BigNumber(data.account.totalKickstarter),
      totalBackedKickstarter: new BigNumber(data.account.totalBackedKickstarter),
      totalProjectGoals: new BigNumber(data.account.totalProjectGoals),
      totalContribution: new BigNumber(data.account.totalContribution),
    }
    return { data: kickstarterAccount, error: false }
  } catch (error) {
    console.error(`Failed to fetch kickstarter account ${address}`, error)
    return {
      error: true,
    }
  }
}

const useKickstarterAccount = (address?: string | null): KickstarterAccount | undefined => {
  const [kickstarterAccount, setKickstarterAccount] = useState<KickstarterAccount>()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchKickstarterAccount(address)
      if (fetchError) {
        setIsError(true)
      } else if (data) {
        setKickstarterAccount(data)
      }
    }
    if (!isError) {
      fetch()
    }
  }, [address, isError])

  return kickstarterAccount
}

export default useKickstarterAccount
