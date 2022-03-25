import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Text } from '@koda-finance/summitswap-uikit'
import { Token } from '@koda-finance/summitswap-sdk'
import { useWeb3React } from '@web3-react/core'
import { abbreviateNumber } from 'utils'
import { KODA, MINIMUM_KODA_FOR_ONBOARDING } from '../../constants'

interface Props {
  token: Token | undefined
  isLoading: boolean
  isEnoughLiquidity: boolean
}

export default function AddLiquidity({ token, isLoading, isEnoughLiquidity }: Props) {
  const { account } = useWeb3React()

  return (
    <article>
      <p>
        Add liquidity on <b>KODA/{token?.symbol ?? 'YOUR COIN'}</b>. Minimum{' '}
        <b>{abbreviateNumber(MINIMUM_KODA_FOR_ONBOARDING)} KODA</b>
      </p>
      {token && account && (
        <>
          <Button as={Link} to={`/add/${KODA}/${token?.address}`} disabled={isLoading}>
            Add Liquidity
          </Button>
          <p>{!isEnoughLiquidity && <Text color="red">Not enough liquidity, please add more</Text>}</p>
        </>
      )}
    </article>
  )
}
