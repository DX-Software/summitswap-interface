import React, { useState, useEffect } from 'react'
import { Box, Text } from '@koda-finance/summitswap-uikit'
import _ from 'lodash'
import useReferralHistories from 'hooks/useReferralHistories'
import { CHAIN_ID } from 'constants/index'
import { REFERRAL_CLIENT } from 'constants/graphs'
import { useActiveWeb3React } from '../../hooks'
import ReferralTransactionRow from './ReferralTransactionRow'
import { ReferralReward } from './types'
import RewardedTokens from './RewardedTokens'



export default function SwapList() {
  const { account, chainId } = useActiveWeb3React()
  const referralHistories = useReferralHistories(account)

  return (
    <>
      <Text bold mb={2}>
        Referred swap history
      </Text>
      {CHAIN_ID !== chainId || REFERRAL_CLIENT === ""
        ? <Text bold>Swap history is not supported on current network!</Text>
        : (referralHistories.length === 0)
        ? <Text bold> No history to be displayed!</Text>
        : (
          <Box mb={2}>
            {_.map(referralHistories, (referralHistory: ReferralReward) => (
              <ReferralTransactionRow key={`${referralHistory.id}-${referralHistory.timestamp}`} account={account} {...referralHistory} />
            ))}
          </Box>
        )
      }
      <RewardedTokens />
    </>
  )
}
