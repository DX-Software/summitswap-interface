import { useEffect, useState } from 'react'
import { gql } from 'graphql-request'
import { referralClient } from 'utils/graphql'

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

const useReferralHistories = (walletAddress: string, outputTokenAddress = ""): ReferralReward[] => {
  const [data, setData] = useState<ReferralReward[]>([])

  useEffect(() => {
    const query = gql`
      query referralHistories($id: String!, $outputToken: String!) {
        account(id: $id, orderBy: timestamp, orderDirection: desc) {
          id
          referralRewards {
            id
            referrer {
              id
            }
            leadInf {
              id
            }
            timestamp
            inputToken {
              id
              name
              symbol
            }
            outputToken(where: {outputToken_contains: $outputToken}) {
              id
              name
              symbol
            }
            inputTokenAmount
            outputTokenAmount
            referrerReward
            leadReward
          }
        }
      }
    `
    const fetchData = async () => {
      try {
        const referralHistories = await referralClient.request<ReferralHistoriesResponse>(query, {
          id: walletAddress.toLowerCase(),
          outputToken: outputTokenAddress
        })
        if (referralHistories.account === null) return;
        const dataTemp: ReferralReward[] = []
        referralHistories.account.referralRewards.forEach((referralReward: ReferralRewardResponse) => {
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
