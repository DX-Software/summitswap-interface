import { TOKEN_BLACKLIST } from 'constants/info'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { infoClient } from 'utils/graphql'
import { getDeltaTimestamps } from 'utils/infoQueryHelpers'

interface TopTokensResponse {
  tokenDayDatas: {
    id: string
  }[]
}

/**
 * Tokens to display on Home page
 * The actual data is later requested in tokenData.ts
 * Note: dailyTxns_gt: 300 is there to prevent fetching incorrectly priced tokens with high dailyVolumeUSD
 */
const fetchTopTokens = async (timestamp24hAgo: number): Promise<string[]> => {
  try {
    const query = gql`
      query topTokens($blacklist: [String!], $timestamp24hAgo: Int) {
        tokenDayDatas(
          first: 1000
          where: { dailyTxns_gt: 0, token_not_in: $blacklist, date_gt: 0 }
          orderBy: dailyVolumeUSD
          orderDirection: desc
        ) {
          id
        }
      }
    `
    const data = await infoClient.request<TopTokensResponse>(query, { blacklist: TOKEN_BLACKLIST, timestamp24hAgo })
    // tokenDayDatas id has compound id "0xTOKENADDRESS-NUMBERS", extracting token address with .split('-')
    return data.tokenDayDatas.map((t) => t.id.split('-')[0])
  } catch (error) {
    console.error('Failed to fetch top tokens', error)
    return []
  }
}

/**
 * Fetch top addresses by volume
 */
const useTopTokenAddresses = (): string[] => {
  const [topTokenAddresses, setTopTokenAddresses] = useState<string[]>([])
  const [timestamp24hAgo] = getDeltaTimestamps()

  useEffect(() => {
    const fetch = async () => {
      const addresses = await fetchTopTokens(timestamp24hAgo)
      setTopTokenAddresses(addresses)
    }
    if (topTokenAddresses.length === 0) {
      fetch()
    }
  }, [topTokenAddresses, timestamp24hAgo])

  return topTokenAddresses
}

export default useTopTokenAddresses
