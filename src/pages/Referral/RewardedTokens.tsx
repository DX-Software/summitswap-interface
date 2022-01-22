import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Text, Button } from '@summitswap-uikit'
import { useReferralContract } from 'hooks/useContract'

import { useWeb3React } from '@web3-react/core'
import TokenCard from './TokenCard'
import { REFERRAL_ADDRESS } from '../../constants'

const StyledContainer = styled(Box)`
  display: grid;
  grid-column-gap: 16px;
  grid-row-gap: 8px;
`

const RewardedTokens: React.FC = () => {
  const { account } = useWeb3React()

  const [rewardTokens, setRewardTokens] = useState<string[]>([])

  const refContract = useReferralContract(REFERRAL_ADDRESS, true)

  useEffect(() => {
    const fetchRewardTokens = async () => {
      if (!account) return
      if (!refContract) return

      const balancesLength = Number(await refContract.getBalancesLength(account))

      const balances = await Promise.all(
        Array(balancesLength)
          .fill(0)
          .map((_, balanceIndex) => {
            return refContract.hasBalance(account, balanceIndex)
          })
      )

      setRewardTokens(balances)
    }

    fetchRewardTokens()
  }, [account, refContract])

  return (
    <>
      {!rewardTokens.length && <Text bold mt={4}>Invite people to see your rewards here</Text>}

      {!!rewardTokens.length && (
        <>
          <Text bold mt={3} mb={3}>
            Rewarded Tokens
          </Text>
          <StyledContainer>
            {rewardTokens.map((x) => (
              <TokenCard key={x} tokenAddress={x} />
            ))}
          </StyledContainer>
        </>
      )}
    </>
  )
}

export default RewardedTokens
