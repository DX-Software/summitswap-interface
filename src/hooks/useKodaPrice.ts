import { useEffect, useState } from 'react'

type ApiResponse = {
  ['koda-finance']: {
    [key: string]: string
  }
  update_at: string
}

/**
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */
const api = `https://api.coingecko.com/api/v3/simple/price?ids=koda-finance&vs_currencies=usd`

const useKodaPrice = () => {
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
  }, [setData])

  return data ? Number(data['koda-finance'].usd) : NaN
}

export default useKodaPrice
