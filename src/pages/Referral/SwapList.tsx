import React, { useState, useEffect } from 'react'
import { Box, Text } from '@koda-finance/summitswap-uikit'
import _ from 'lodash'
import useReferralHistories from 'hooks/useReferralHistories'
import { useActiveWeb3React } from '../../hooks'
import ReferralTransactionRow from './ReferralTransactionRow'
import { ReferralReward } from './types'
import RewardedTokens from './RewardedTokens'



export default function SwapList() {
  const { account } = useActiveWeb3React()
  const referralHistories = useReferralHistories(account)

  return (
    <>
      <Text bold mb={2}>
        Referred swap history
      </Text>
      <Box mb={2}>
        {_.map(referralHistories, (referralHistory: ReferralReward) => (
          <ReferralTransactionRow key={`${referralHistory.timestamp}`} account={account} {...referralHistory} />
        ))}
      </Box>
      {referralHistories.length}
      {(referralHistories.length === 0) && (
        <Text bold> No history to be displayed! </Text>
      )}
      <RewardedTokens />
    </>
  )
}
