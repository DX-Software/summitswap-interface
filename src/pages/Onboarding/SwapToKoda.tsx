import { Token } from '@koda-finance/summitswap-sdk'
import { Button, Text, Input } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useRouterContract } from 'hooks/useContract'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BNB_TO_KODA_ROUTE, ROUTER_ADDRESS } from '../../constants'


interface Props {
  token: Token | undefined
  isLoading: boolean
  bnbAmountForSummitSwap: string | undefined
  setBNBAmountForSummitSwap: Dispatch<SetStateAction<string | undefined>>
}

export default function SwapToKoda({ isLoading, token, bnbAmountForSummitSwap, setBNBAmountForSummitSwap }: Props) {
  const { account } = useWeb3React()
  // const [bnbAmountForPancakeSwap, setBNBAmountForPancakeSwap] = useState('')
  const [kodaValue, setKodaValue] = useState<string>();

  const summitSwapRouter = useRouterContract(ROUTER_ADDRESS);

  const handleInputChange = async (amount: string) => {
    setBNBAmountForSummitSwap(amount)
    try {
      if (summitSwapRouter) {
        const amountsInWei = ethers.utils.parseEther(amount)
        const amountsOutInWei = await summitSwapRouter
          .getAmountsOut(amountsInWei, BNB_TO_KODA_ROUTE)
          .then((o) => o[o.length - 1]);
        const amountsOutInEther = ethers.utils.formatEther(amountsOutInWei);
        setKodaValue(amountsOutInEther);
      }
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <article>
      <p>
        Swap your <b>BNB</b> to <b>KODA</b>. Try to swap on both exchanges (pancakeswap and summitswap) to keep the
        prices about the same
      </p>
      {account && token && (
        <>
          <Input
            disabled={isLoading}
            type="number"
            placeholder="BNB Amount for SummitSwap"
            onChange={(o) => handleInputChange(o.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <span style={{color: "white"}}>Koda Value: {kodaValue}</span>
          {/* <Input
            disabled={isLoading}
            type="text"
            placeholder="BNB Amount for PancakeSwap"
            onChange={(o) => setBNBAmountForPancakeSwap(o.target.value)}
            style={{ marginBottom: '20px' }}
          /> */}
        </>
      )}
    </article>
  )
}
