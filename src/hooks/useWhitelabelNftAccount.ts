import BigNumber from 'bignumber.js'
import { gql } from 'graphql-request'
import { useQuery } from 'react-query'
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

const useWhitelabelNftAccount = (address?: string | null) => {
  return useQuery('useWhitelabelNftAccount', async () => {
    const response = await fetchWhitelabelNftAccount(address)
    return response.data as WhitelabelNftAccount
  })
}

export default useWhitelabelNftAccount
