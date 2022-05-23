import { useState, useEffect } from 'react'
import { utils } from 'ethers'
import { PANCAKESWAP_ROUTER_V2_ADDRESS, KAPEX_TO_BUSD_ROUTE } from '../constants'
import { useRouterContract } from './useContract'

const useKapexPrice = () => {
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
        console.warn(err) // Means it's on Testnet
      }
    }
    getPrice()
  }, [pancakeRouterContract])

  return Number(price)
}

export default useKapexPrice
