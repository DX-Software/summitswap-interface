import React from 'react'
import { Flex, Text } from '@summitswap-uikit'
import web3 from 'web3'
import { useActiveWeb3React } from 'hooks'
import { BigNumber } from 'ethers'
import { useToken } from '../../hooks/Tokens'

interface Props {
  account: string | null
  timestamp: any
  inputToken: string
  outputToken: string
  inputTokenAmount: BigNumber
  outputTokenAmount: BigNumber
  referrer: string
  referrerReward: BigNumber
  lead: string
  leadReward: BigNumber 
}

const ReferralTransactionRow: React.FC<Props> = ({
  account,
  timestamp,
  inputToken,
  outputToken,
  inputTokenAmount,
  outputTokenAmount,
  referrer,
  referrerReward,
  lead,
  leadReward,
}) => {
  const rewardAmount = account === referrer ? referrerReward.toString() : leadReward.toString()

  const amountRR = web3.utils.fromWei(rewardAmount, 'ether')
  const amountAA = web3.utils.fromWei(inputTokenAmount.toString(), 'ether')
  const amountBB = web3.utils.fromWei(outputTokenAmount.toString(), 'ether')
  const ts = `${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getFullYear() - 2000}/${
    new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getMonth() + 1
  }/${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getDate()}`

  const tokenAA = useToken(inputToken)?.symbol
  const tokenBB = useToken(outputToken)?.symbol

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text mb="2px" color="primary">
        <span style={{ color: 'white' }}>{ts}</span> {amountRR}{' '}
        <span style={{ color: 'white' }}>{tokenBB} from Swap</span> {amountAA}{' '}
        <span style={{ color: 'white' }}>{tokenAA}</span> <span style={{ color: 'white' }}>for</span> {amountBB}{' '}
        <span style={{ color: 'white' }}>{tokenBB}</span>
      </Text>
    </Flex>
  )
}

export default ReferralTransactionRow
