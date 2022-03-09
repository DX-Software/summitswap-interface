import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { Box, Text } from '@summitswap-uikit'
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
  const [isLoading, setIsLoading] = useState(true)

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

      await Promise.all(
        queries.map(async (o) => {
          const referrerLogsOnInterval = await referralContract.queryFilter(referrerFilter, o[0], o[1])
          const leadLogsOnInterval = await referralContract.queryFilter(leadFilter, o[0], o[1])

          referrerLogs = [...referrerLogs, ...referrerLogsOnInterval]
          leadLogs = [...leadLogs, ...leadLogsOnInterval]

          let eventLogs = [...referrerLogs, ...leadLogs].map((oo) => oo.args) as ReferralReward[]
          eventLogs = _.orderBy(eventLogs, (eventLog) => eventLog.timestamp.toNumber(), 'desc')

          setSwapList(eventLogs)
          setIsLoading(false)
        })
      )
    }

    fetchSwapList()
  }, [account, library, referralContract])

  return isLoading ? (
    <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="90px" />
  ) : (
    <>
      {swapList.length ? (
        <>
          <Text bold mb={2}>
            Referred swaps
          </Text>
          <Box mb={2}>
            {_.map(swapList, (swap: any) => (
              <ReferralTransactionRow account={account} {...swap} />
            ))}
          </Box>
          <RewardedTokens />
        </>
      ) : (
        <>
          <Text bold> No history to be displayed! </Text>
        </>
      )}
    </>
  )
}
