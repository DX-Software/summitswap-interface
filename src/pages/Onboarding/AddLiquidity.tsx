import React, { Dispatch, SetStateAction, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Text, Input } from '@koda-finance/summitswap-uikit'
import { Token } from '@koda-finance/summitswap-sdk'
import { useWeb3React } from '@web3-react/core'
import { KODA } from '../../constants'

interface Props {
  token: Token | undefined
  isLoading: boolean
  isEnoughLiquidity: boolean
  setLiquidityKodaAmount: Dispatch<SetStateAction<string | undefined>>
  setLiquidityUserTokenAmount: Dispatch<SetStateAction<string | undefined>>
}

export default function AddLiquidity({ token, isLoading, isEnoughLiquidity, setLiquidityKodaAmount, setLiquidityUserTokenAmount }: Props) {
  const { account } = useWeb3React()

  return (
    <article>
      <p>
        Add liquidity on <b>KODA/{token?.symbol ?? 'YOUR TOKEN'}</b>
      </p>
      {token && account && (
        <>
          <Input
            disabled={isLoading}
            type="number"
            placeholder="KODA Amount"
            onChange={(o) => setLiquidityKodaAmount(o.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Input
            disabled={isLoading}
            type="number"
            placeholder={`${token?.symbol ?? 'Your Token'} Amount`}
            onChange={(o) => setLiquidityUserTokenAmount(o.target.value)}
            style={{ marginBottom: '20px' }}
          />
          {/* <p>{!isEnoughLiquidity && <Text color="red">Not enough liquidity, please add more</Text>}</p> */}
        </>
      )}
    </article>
  )
}
