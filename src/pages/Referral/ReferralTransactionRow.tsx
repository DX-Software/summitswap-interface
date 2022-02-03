import React from 'react'
import { Flex, Text } from '@summitswap-uikit'
import web3 from 'web3'
import { useActiveWeb3React } from 'hooks'
import { BigNumber, ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useToken } from '../../hooks/Tokens'

interface Props {
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
  timestamp,
  inputToken: inputTokenAddress,
  outputToken: outputTokenAddress,
  inputTokenAmount,
  outputTokenAmount,
  referrer,
  referrerReward,
  lead,
  leadReward,
}) => {
  const { account } = useWeb3React()

  const rewardAmount = account === referrer ? referrerReward : leadReward
  // ethers.utils.formatUnits(balance, outputTokenAddress?.decimals)

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
        <span style={{ color: 'white' }}> to</span>{' '}
        {ethers.utils.formatUnits(outputTokenAmount, outputToken?.decimals)}{' '}
        <span style={{ color: 'white' }}>{outputToken?.symbol}</span>
      </Text>
    </Flex>
  )
}

export default ReferralTransactionRow
