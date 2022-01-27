import React from 'react'
import { Flex, Text } from '@summitswap-uikit'
import web3 from 'web3'
import { BigNumber } from 'ethers'
import { useToken } from '../../hooks/Tokens'

interface Props {
  timestamp: any
  inputToken: string
  outputToken: string
  rewardToken: string
  inputTokenAmount: BigNumber
  outputTokenAmount: BigNumber
  referrerReward: BigNumber
}

const ReferralTransactionRow: React.FC<Props> = ({ timestamp, inputTokenAmount, outputTokenAmount, inputToken, outputToken, rewardToken, referrerReward }) => {
  const amountRR = web3.utils.fromWei(referrerReward.toString(), 'ether')
  const amountAA = web3.utils.fromWei(inputTokenAmount.toString(), 'ether')
  const amountBB = web3.utils.fromWei(outputTokenAmount.toString(), 'ether')
  const ts = `${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getFullYear() - 2000}/${
    new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getMonth() + 1
  }/${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getDate()}`

  const tokenAA = useToken(inputToken)?.symbol
  const tokenBB = useToken(outputToken)?.symbol
  const tokenRR = useToken(rewardToken)?.symbol
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text mb="2px" color="primary">
        <span style={{ color: 'white' }}>{ts}</span> {amountRR}{' '}
        <span style={{ color: 'white' }}>{tokenRR} from Swap</span> {amountAA}{' '}
        <span style={{ color: 'white' }}>{tokenAA}</span> <span style={{ color: 'white' }}>for</span> {amountBB}{' '}
        <span style={{ color: 'white' }}>{tokenBB}</span>
      </Text>
    </Flex>
  )
}

export default ReferralTransactionRow
