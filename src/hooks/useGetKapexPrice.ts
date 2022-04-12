import { useState, useEffect } from 'react'
import Web3 from 'web3';
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract"
import routerAbi from '../constants/abis/routerAbi.json'
import {pancakeswapRouterV2Address} from '../constants'
import { mainnetTokens } from '../constants/tokens-pancake'


const kapexToBusdRoute = [
    mainnetTokens.kapex.address, 
    mainnetTokens.wbnb.address,
    mainnetTokens.busd.address
  ];


const useGetKapexPrice = () => {

    const [price, setPrice] = useState<string>()

    const web3 = new Web3('https://bsc-dataseed1.binance.org:443')

    const routerContract2 = new web3.eth.Contract(
        routerAbi as AbiItem[],
        pancakeswapRouterV2Address,
      );

    useEffect(() => {
        const init = async() =>  {
          const kapexPrice = await getAmountsOut(routerContract2, kapexToBusdRoute, 1);
          setPrice(kapexPrice)
        }
        init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

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