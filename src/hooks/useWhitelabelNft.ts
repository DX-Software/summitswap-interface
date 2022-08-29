import BigNumber from 'bignumber.js'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { whitelabelNftClient } from 'utils/graphql'

export type WhitelabelNft = {
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
  createdAt: number
}

const WHITELABEL_NFT = gql`
  query whitelabelNfts {
    whitelabelNfts {
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

const fetchWhitelabelNfts = async (): Promise<{ data?: WhitelabelNft[]; error: boolean }> => {
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
      }>(WHITELABEL_NFT)
    ).whitelabelNfts

    const whitelabelNfts: WhitelabelNft[] = data.map((item) => {
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

const useWhitelabelNft = (address?: string | null): WhitelabelNft[] | undefined => {
  const [whitelabelNfts, setWhitelabelNfts] = useState<WhitelabelNft[]>()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchWhitelabelNfts()
      if (fetchError) {
        setIsError(true)
      }
      setWhitelabelNfts(data)
    }
    if (!isError) {
      fetch()
    }
  }, [address, isError])

  return whitelabelNfts
}

export default useWhitelabelNft
