import { useState, useEffect } from 'react'
import Web3 from 'web3';
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract"
import { BSC_RPC_URL, BUSD,
         PANCAKESWAP_ROUTER_V2_ADDRESS,
        WBNB_MAINNET_ADDRESS, KAPEX } from '../constants'
import summitswapRouterAbi from '../constants/abis/summitswap-router.json'

const kapexToBusdRoute = [
    KAPEX.address, 
    WBNB_MAINNET_ADDRESS,
    BUSD.address
  ];

const useGetKapexPrice = () => {
    
    const [price, setPrice] = useState<string>()

    const web3 = new Web3(BSC_RPC_URL)
  
    useEffect(() => {
        const init = async() =>  {
          const kapexPrice = await getAmountsOut(routerContract2, kapexToBusdRoute, 1);
          setPrice(kapexPrice)
        }
        init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      
      const routerContract2 = new web3.eth.Contract(
        summitswapRouterAbi as AbiItem[],
        PANCAKESWAP_ROUTER_V2_ADDRESS,
      );
      
      const getAmountsOut = async (router: Contract, route: string[], amount: number) => {
        try {
          const amountsInWei = web3.utils.toWei(amount.toString(), 'ether');
          const amountsOutInWei = await router.methods.getAmountsOut(amountsInWei, route)
            .call()
            .then((o) => o[o.length - 1]);
          const amountsOutInEther = web3.utils.fromWei(amountsOutInWei, 'ether');
          return amountsOutInEther;
        } catch(err) {
          return undefined
        }
      }
    
      if(price){
        return parseFloat(parseFloat(price).toFixed(8))
      }

      return undefined
}

export default useGetKapexPrice;