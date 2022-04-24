import { referralClient } from 'apollo/client'
import { REFERRAL_HISTORIES } from 'apollo/queries'
import { useEffect, useState } from 'react'

type ReferralHistoriesResponse = {
  account: Account | null
}

type Account = {
  id: string
  referralRewards: ReferralRewardResponse[]
}

type ReferralRewardResponse = {
  id: string
  timestamp: string
  inputToken: Token
  outputToken: Token
  inputTokenAmount: string
  outputTokenAmount: string
  referrer: {
    id: string
  }
  leadInf: {
    id: string
  }
  referrerReward: string
  leadReward: string
}

type Token = {
  id: string
  name: string
  symbol: string
}

type ReferralReward = {
  id: string
  timestamp: string
  inputToken: string
  inputTokenName: string
  inputTokenSymbol: string
  inputTokenAmount: string
  outputToken: string
  outputTokenName: string
  outputTokenSymbol: string
  outputTokenAmount: string
  referrer: string
  referrerReward: string
  lead: string
  leadReward: string
}

const useReferralHistories = (walletAddress?: string | null, outputTokenAddress?: string | null): ReferralReward[] => {
  const [data, setData] = useState<ReferralReward[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _walletAddress = walletAddress?.toLowerCase() || ""
        const _outputTokenAddress = outputTokenAddress?.toLowerCase() || ""
        console.log("fetching referral histories")
        const referralHistories = await referralClient.query({
          query: REFERRAL_HISTORIES(_walletAddress, _outputTokenAddress),
          fetchPolicy: 'cache-first',
        });
        if (referralHistories.data.account === null) {
          setData([])
          return
        }
        const dataTemp: ReferralReward[] = []
        referralHistories.data.account.referralRewards.forEach((referralReward: ReferralRewardResponse) => {
          dataTemp.push({
            id: referralReward.id,
            timestamp: referralReward.timestamp,
            inputToken: referralReward.inputToken.id,
            inputTokenName: referralReward.inputToken.name,
            inputTokenSymbol: referralReward.inputToken.symbol,
            inputTokenAmount: referralReward.inputTokenAmount,
            outputToken: referralReward.outputToken.id,
            outputTokenName: referralReward.outputToken.name,
            outputTokenSymbol: referralReward.outputToken.symbol,
            outputTokenAmount: referralReward.outputTokenAmount,
            referrer: referralReward.referrer.id,
            referrerReward: referralReward.referrerReward,
            lead: referralReward.leadInf.id,
            leadReward: referralReward.leadReward,
          })
        })
        setData(dataTemp)
      } catch (error) {
        console.error("Failed to fetch referral histories", error)
      }
    }

    fetchData()
  }, [setData, walletAddress, outputTokenAddress])

  return data
}

export default useReferralHistories
