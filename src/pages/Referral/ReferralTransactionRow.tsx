import React from 'react'
import { Flex, Text } from '@koda-finance/summitswap-uikit'
import web3 from 'web3'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useToken } from '../../hooks/Tokens'
import { ReferralReward } from './types'

const ReferralTransactionRow: React.FC<ReferralReward> = ({
  timestamp,
  inputToken: inputTokenAddress,
  outputToken: outputTokenAddress,
  inputTokenAmount,
  outputTokenAmount,
  referrer,
  referrerReward,
  leadReward,
}) => {
  const { account } = useWeb3React()

  const rewardAmount = account === referrer ? referrerReward : leadReward

  const date = `${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getFullYear() - 2000}/${
    new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getMonth() + 1
  }/${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getDate()}`

  const inputToken = useToken(inputTokenAddress)
  const outputToken = useToken(outputTokenAddress)

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text mb="2px" color="primary">
        <span style={{ color: 'white' }}>{date}</span> {ethers.utils.formatUnits(rewardAmount, outputToken?.decimals)}{' '}
        <span style={{ color: 'white' }}>{outputToken?.symbol} from Swap</span>{' '}
        {ethers.utils.formatUnits(inputTokenAmount, inputToken?.decimals)}{' '}
        <span style={{ color: 'white' }}>{inputToken?.symbol}</span>
        <span style={{ color: 'white' }}> to</span> {ethers.utils.formatUnits(outputTokenAmount, outputToken?.decimals)}{' '}
        <span style={{ color: 'white' }}>{outputToken?.symbol}</span>
      </Text>
    </Flex>
  )
}

export default ReferralTransactionRow
