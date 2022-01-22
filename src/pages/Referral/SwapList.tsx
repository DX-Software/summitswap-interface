import ReferralTransactionRow from 'components/PageHeader/ReferralTransactionRow'
import { useActiveWeb3React } from 'hooks'
import { useReferralContract } from 'hooks/useContract'
import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { Box } from '@summitswap-uikit'
import { REFERRAL_ADDRESS } from '../../constants'

export default function SwapList() {
  const { account } = useActiveWeb3React()
  const referralContract = useReferralContract(REFERRAL_ADDRESS, true)

  const [swapList, setSwapList] = useState<any[]>([])

  useEffect(() => {
    async function fetchSwapList() {
      if (account && referralContract) {
        const swapListLength = Number(await referralContract.getSwapListCount(account))
        const fetchedSwapList = await Promise.all(
          Array(swapListLength)
            .fill(0)
            .map((val, swapIndex) => {
              return referralContract.swapList(account, swapIndex)
            })
        ).then((o) => _.orderBy(o, ['timestamp'], ['desc']))

        setSwapList(fetchedSwapList)
      }
    }

    fetchSwapList()
  }, [account, referralContract])

  return (
    <>
      {!!swapList.length && (
        <Box mb={2}>
          {_.map(swapList, (x: any) => (
            <ReferralTransactionRow {...x} />
          ))}
        </Box>
      )}
    </>
  )
}
