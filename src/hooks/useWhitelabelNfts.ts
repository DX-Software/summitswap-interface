import BigNumber from 'bignumber.js'
import { PER_PAGE } from 'constants/whitelabel'
import { gql } from 'graphql-request'
import { WhitelabelNftGraphql } from 'pages/WhitelabelNft/types'
import { useQuery } from 'react-query'
import { whitelabelNftClient } from 'utils/graphql'

const WHITELABEL_NFT = gql`
  query whitelabelNfts($first: Int!, $skip: Int!) {
    whitelabelNfts(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      owner {
        id
      }
      name
      symbol
      maxSupply
      whitelistMintPrice
      publicMintPrice
      phase
      createdAt
    }
  }
`

const fetchWhitelabelNfts = async (
  page: number,
  perPage: number
): Promise<{ data?: WhitelabelNftGraphql[]; error: boolean }> => {
  try {
    type Result = {
      id: string
      owner: {
        id: string
      }
      name: string
      symbol: string
      maxSupply: number
      whitelistMintPrice: BigNumber
      publicMintPrice: BigNumber
      phase: number
      createdAt: string
    }

    const data: Result[] = (
      await whitelabelNftClient.request<{
        whitelabelNfts: Result[]
      }>(WHITELABEL_NFT, {
        first: perPage,
        skip: (page - 1) * perPage,
      })
    ).whitelabelNfts

    const whitelabelNfts: WhitelabelNftGraphql[] = data.map((item) => {
      return {
        id: item.id,
        owner: item.owner,
        name: item.name,
        symbol: item.symbol,
        maxSupply: item.maxSupply,
        whitelistMintPrice: new BigNumber(item.whitelistMintPrice),
        publicMintPrice: new BigNumber(item.publicMintPrice),
        phase: item.phase,
        createdAt: Number(item.createdAt),
      }
    })

    return { data: whitelabelNfts, error: false }
  } catch (error) {
    console.error(`Failed to fetch whitelabel nfts`, error)
    return {
      error: true,
    }
  }
}

const useWhitelabelNfts = (page = 1, perPage = PER_PAGE) => {
  return useQuery('useWhitelabelNfts', async () => {
    const response = await fetchWhitelabelNfts(page, perPage)
    return response.data as WhitelabelNftGraphql[]
  })
}

export default useWhitelabelNfts
