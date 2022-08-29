import BigNumber from 'bignumber.js'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { whitelabelNftClient } from 'utils/graphql'

export type WhitelabelNftAccount = {
  id: string
  totalWhitelabelNft: BigNumber
}

const WHITELABEL_NFT_ACCOUNT = gql`
  query whitelabelNftAccount($address: Bytes!) {
    account(id: $address) {
      id
      totalWhitelabelNft
    }
  }
`

const fetchWhitelabelNftAccount = async (
  address?: string | null
): Promise<{ data?: WhitelabelNftAccount; error: boolean }> => {
  try {
    if (!address) return { error: false }
    const data = await whitelabelNftClient.request<{
      account: {
        id: string
        totalWhitelabelNft: string
      }
    }>(WHITELABEL_NFT_ACCOUNT, {
      address: address.toLowerCase(),
    })

    const whitelabelNftAccount: WhitelabelNftAccount = {
      id: data.account.id,
      totalWhitelabelNft: new BigNumber(data.account.totalWhitelabelNft),
    }
    return { data: whitelabelNftAccount, error: false }
  } catch (error) {
    console.error(`Failed to fetch whitelabel nft account ${address}`, error)
    return {
      error: true,
    }
  }
}

const useWhitelabelNftAccount = (address?: string | null): WhitelabelNftAccount | undefined => {
  const [whitelabelNftAccount, setwhitelabelNftAccount] = useState<WhitelabelNftAccount>()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchWhitelabelNftAccount(address)
      if (fetchError) {
        setIsError(true)
      } else if (data) {
        setwhitelabelNftAccount(data)
      }
    }
    if (!isError) {
      fetch()
    }
  }, [address, isError])

  return whitelabelNftAccount
}

export default useWhitelabelNftAccount
