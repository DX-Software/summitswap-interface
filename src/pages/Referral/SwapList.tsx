import React, { useState, useEffect } from 'react'
import { Box, Text } from '@koda-finance/summitswap-uikit'
import _ from 'lodash'
import { Event } from 'ethers'
import CustomLightSpinner from '../../components/CustomLightSpinner'
import { useReferralContract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks'
import { MAX_QUERYING_BLOCK_AMOUNT, REFERRAL_DEPLOYMENT_BLOCKNUMBER } from '../../constants'
import ReferralTransactionRow from './ReferralTransactionRow'
import { ReferralReward } from './types'
import RewardedTokens from './RewardedTokens'



export default function SwapList() {
  const { account, library } = useActiveWeb3React()
  const referralContract = useReferralContract(true)

  const [swapList, setSwapList] = useState<ReferralReward[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSwapList([])
  }, [account])

  useEffect(() => {
    async function fetchSwapList() {
      if (!account || !referralContract || !library) return

      const referrerFilter = referralContract.filters.ReferralReward(account)
      const leadFilter = referralContract.filters.ReferralReward(null, account)

      const latestBlocknumber = await library.getBlockNumber()

      let referrerLogs = [] as Event[]
      let leadLogs = [] as Event[]

      const queries: [start: number, end: number][] = []

      for (
        let blockNumber = REFERRAL_DEPLOYMENT_BLOCKNUMBER;
        blockNumber < latestBlocknumber;
        blockNumber += MAX_QUERYING_BLOCK_AMOUNT
      ) {
        queries.push([blockNumber, Math.min(latestBlocknumber, blockNumber + MAX_QUERYING_BLOCK_AMOUNT - 1)])
      }

      for (let i = 0; i < queries.length; i++) {
        try {
          const referrerLogsOnInterval = await referralContract.queryFilter(referrerFilter, queries[i][0], queries[i][1])
          const leadLogsOnInterval = await referralContract.queryFilter(leadFilter, queries[i][0], queries[i][1])
  
          referrerLogs = [...referrerLogs, ...referrerLogsOnInterval]
          leadLogs = [...leadLogs, ...leadLogsOnInterval]
  
          let eventLogs = [...referrerLogs, ...leadLogs].map((oo) => oo.args) as ReferralReward[]
          eventLogs = _.orderBy(eventLogs, (eventLog) => eventLog.timestamp.toNumber(), 'desc')
  
          setSwapList(eventLogs)
        } catch (err) {
          console.log("Error: ", err)
        }
      }
      setIsLoading(false)
    }

    // fetchSwapList()
  }, [account, library, referralContract])

  return (
    <>
      {/* <Text bold mb={2}>
        Referred swap histories
      </Text>
      <Box mb={2}>
        {_.map(swapList, (swap: ReferralReward) => (
          <ReferralTransactionRow key={`${swap.timestamp}`} account={account} {...swap} />
        ))}
      </Box>
      {isLoading && (
        <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="45px" />
      )}
      {(swapList.length === 0 && !isLoading) && (
        <Text bold> No history to be displayed! </Text>
      )} */}
      <RewardedTokens />
    </>
  )
}
