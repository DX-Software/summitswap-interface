import { Token } from '@koda-finance/summitswap-sdk'
import { useEffect, useState } from 'react'

type ApiResponse = {
  [geckoId: string]: {
    [price: string]: number
  }
}

/**
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */

const useTokenPrice = (token?: Token): number => {
  const [data, setData] = useState<number>(0)

  useEffect(() => {
    if (token?.coingeckoId === undefined) return

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token.coingeckoId}&vs_currencies=usd`)
        const res: ApiResponse = await response.json()
        setData(res[token.coingeckoId!].usd)
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
    // eslint-disable-next-line 
  }, [setData])

  return data
}

export default useTokenPrice
