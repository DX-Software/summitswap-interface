import { useState, useEffect } from 'react'
import Web3 from 'web3' 
import { AbiItem } from "web3-utils" 
import { BSC_RPC_URL, PANCAKESWAP_ROUTER_V2_ADDRESS, KAPEX_TO_BUSD_ROUTE } from '../constants'
import summitswapRouterAbi from '../constants/abis/summitswap-router.json'

const useGetKapexPriceData = () => {
  const [price, setPrice] = useState<string>()
  const web3 = new Web3(BSC_RPC_URL)

  const pancakeRouterContract = new web3.eth.Contract(
    summitswapRouterAbi as AbiItem[],
    PANCAKESWAP_ROUTER_V2_ADDRESS,
  )

  useEffect(() => {
    const getPrice = async() =>  {
      const amountsInWei = web3.utils.toWei("1", 'ether') 
      const amountsOutInWei = await pancakeRouterContract.methods.getAmountsOut(amountsInWei, KAPEX_TO_BUSD_ROUTE)
        .call()
        .then((o) => o[o.length - 1]) 
      const amountsOutInEther = web3.utils.fromWei(amountsOutInWei, 'ether')
      setPrice(Number(amountsOutInEther).toFixed(8))
    }
    getPrice() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
    
  return Number(price)
      
}

export default useGetKapexPriceData 