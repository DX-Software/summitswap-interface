import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@summitswap-uikit'
import { useClaimedRewardIndex } from 'state/transactions/hooks'
import web3 from 'web3'
import { useToken } from '../../hooks/Tokens'

interface Props {
  timestamp: any
  amountA: any
  amountB: any
  tokenA: any
  tokenB: any
  tokenR: any
  amountR: any
  index: number
}

const ReferralTransactionRow: React.FC<Props> = ({ timestamp, amountA, amountB, tokenA, tokenB, tokenR, amountR, index }) => {
  const [claimRewardIndex, setClaimRewardIndex]: any = useState(0);
  const amountRR = web3.utils.fromWei(amountR.toString(), 'ether')
  const amountAA = web3.utils.fromWei(amountA.toString(), 'ether')
  const amountBB = web3.utils.fromWei(amountB.toString(), 'ether')
  const ts = `${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getFullYear() - 2000}/${
    new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getMonth() + 1
  }/${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getDate()}`
  const claimRewardIndexTemp = useClaimedRewardIndex(tokenR)

  const getClaimedRewardIndex = async () => {
    const tmp: any = await claimRewardIndexTemp
    setClaimRewardIndex(tmp)
  }

  useEffect(() => {
    getClaimedRewardIndex()
  })

  const tokenAA = useToken(tokenA)?.symbol
  const tokenBB = useToken(tokenB)?.symbol
  const tokenRR = useToken(tokenR)?.symbol
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text mb="2px" color="primary">
        <span style={{ color: 'white' }}>{ts}</span> {amountRR}{' '}
        <span style={{ color: 'white' }}>{tokenRR} from Swap</span> {amountAA}{' '}
        <span style={{ color: 'white' }}>{tokenAA}</span> <span style={{ color: 'white' }}>for</span> {amountBB}{' '}
        <span style={{ color: 'white' }}>{tokenBB}</span>{' '}
        <span>[{claimRewardIndex && claimRewardIndex.gte(index) ? "Claimed" : "Unclaimed"}]</span>
      </Text>
    </Flex>
  )
}

export default ReferralTransactionRow
