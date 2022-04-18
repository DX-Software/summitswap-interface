import { useState, useEffect } from 'react'
import { utils } from 'ethers'
import { PANCAKESWAP_ROUTER_V2_ADDRESS, KAPEX_TO_BUSD_ROUTE } from '../constants'
import { useRouterContract } from './useContract'

const useGetKapexPriceData = () => {
  const [price, setPrice] = useState<string>()
  const pancakeRouterContract = useRouterContract(PANCAKESWAP_ROUTER_V2_ADDRESS)

  useEffect(() => {
    const getPrice = async() => {
      try {
        const amountsInWei = utils.parseUnits("1", "ether")
        const amountsOutInWei = await pancakeRouterContract?.getAmountsOut(amountsInWei, KAPEX_TO_BUSD_ROUTE)
          .then((o) => o[o.length - 1]) 
        const amountsOutInEther = utils.formatEther(amountsOutInWei)
        setPrice(Number(amountsOutInEther).toFixed(8))
      } catch (err) {
        setPrice("0.001") // Means it's on Testnet
      }
    }
    getPrice() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
    
  return Number(price)
}

export default useGetKapexPriceData 