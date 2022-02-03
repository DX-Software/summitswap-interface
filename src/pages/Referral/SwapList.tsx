import { useActiveWeb3React } from 'hooks'
import { useReferralContract } from 'hooks/useContract'
import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { Box, Text } from '@summitswap-uikit'
import { REFERRAL_ADDRESS, REFERRAL_DEPLOYMENT_BLOCKNUMBER } from '../../constants'
import ReferralTransactionRow from './ReferralTransactionRow'

export default function SwapList() {
  const { account } = useActiveWeb3React()
  const referralContract = useReferralContract(REFERRAL_ADDRESS, true)

  const [swapList, setSwapList] = useState<any[]>([])

  useEffect(() => {
    async function fetchSwapList() {
      if (!account || !referralContract) return

      const referrerFilter = referralContract.filters.ReferralReward(account)
      const leadFilter = referralContract.filters.ReferralReward(null, account)

      const referrerLogs = await referralContract.queryFilter(referrerFilter, REFERRAL_DEPLOYMENT_BLOCKNUMBER, 'latest')
      const leadLogs = await referralContract.queryFilter(leadFilter, REFERRAL_DEPLOYMENT_BLOCKNUMBER, 'latest')

      let eventLogs: Array<any> = [...referrerLogs, ...leadLogs]
      eventLogs = eventLogs.map((eventLog) => eventLog.args)
      eventLogs = _.orderBy(eventLogs, (eventLog) => eventLog.timestamp.toNumber(), 'desc')

      // console.log(eventLogs)
      setSwapList(eventLogs)
    }

    fetchSwapList()
  }, [account, referralContract])

  return (
    <>
      {!!swapList.length && (
        <>
          <Text bold mb={2}>
            Referred swaps
          </Text>
          <Box mb={2}>
            {_.map(swapList, (x: any) => (
              <ReferralTransactionRow account={account} {...x} />
            ))}
          </Box>
        </>
      )}
    </>
  )
}
