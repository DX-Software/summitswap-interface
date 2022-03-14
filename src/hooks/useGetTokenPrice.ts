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

const useGetTokenPrice = (ids: string[], currencies: string[] = ["usd"]): null | ApiResponse => {
  const api = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.toString()}&vs_currencies=${currencies.toString()}`
  const [data, setData] = useState<ApiResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api)
        const res: ApiResponse = await response.json()
        
        setData(res)
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
    // eslint-disable-next-line 
  }, [setData, ids.length])

  return data
}

export default useGetTokenPrice
