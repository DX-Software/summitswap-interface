import { Token } from '@koda-finance/summitswap-sdk'
import { Button, Input, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { Contract, ethers } from 'ethers'
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { REFERRAL_ADDRESS } from '../../constants'

interface Props {
  token: Token | undefined
  tokenContract: Contract | null
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setIsTokensSentToReferral: Dispatch<SetStateAction<boolean>>
  isLiquidityLocked: boolean
  referralRewardAmount: string | undefined
  setReferralRewardAmount: Dispatch<SetStateAction<string | undefined>>
}

export default function SendReferralRewards({
  token,
  tokenContract,
  isLoading,
  isLiquidityLocked,
  setIsTokensSentToReferral,
  setIsLoading,
  referralRewardAmount,
  setReferralRewardAmount
}: Props) {
  const { account, library } = useWeb3React()

  const sendTokensToReferralContract = useCallback(() => {
    async function send() {
      if (!tokenContract || !referralRewardAmount || !library) {
        setIsTokensSentToReferral(false)
        return
      }

      if (parseInt(referralRewardAmount) <= 0) {
        return
      }

      const receipt = await tokenContract.transfer(REFERRAL_ADDRESS, ethers.utils.parseEther(referralRewardAmount))

      setIsLoading(true)
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)

      setIsTokensSentToReferral(true)
    }

    send()
  }, [tokenContract, referralRewardAmount, library, setIsLoading, setIsTokensSentToReferral])

  return (
    <article>
      <p>
        Send some of <b>{token?.symbol ?? 'YOUR TOKEN'}</b> to the referral contract for referral rewards
        <br />
      </p>
      {token && account && (
        <>
          <Input
            disabled={!isLiquidityLocked || isLoading}
            type="number"
            placeholder="Enter token amount"
            onChange={(o) => setReferralRewardAmount(o.target.value)}
            style={{ marginTop: '10px', marginBottom: '10px' }}
          />
          <p>
            {!(+(referralRewardAmount || '') > 0) && isLiquidityLocked && (
              <Text color="red">Please enter positive number</Text>
            )}
          </p>
        </>
      )}
    </article>
  )
}
