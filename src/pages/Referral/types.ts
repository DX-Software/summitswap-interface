import { BigNumber } from 'ethers'
import { Result } from 'ethers/lib/utils';

export interface ReferralReward extends Result {
  timestamp: any
  inputToken: string
  outputToken: string
  inputTokenAmount: BigNumber
  outputTokenAmount: BigNumber
  referrer: string
  referrerReward: BigNumber
  lead: string
  leadReward: BigNumber
}

export interface Influencer {
  outputToken: string;
  referee: string;
  referrer: string;
}