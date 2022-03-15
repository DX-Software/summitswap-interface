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

export interface InfInfo {
  lead: string;
  leadFee: BigNumber;
  refFee: BigNumber;
  isActive: boolean;
  isLead: boolean;
}

export interface FeeInfo {
  tokenR: string;
  refFee: BigNumber;
  devFee: BigNumber;
  promRefFee: BigNumber;
  promStart: BigNumber;
  promEnd: BigNumber;
}

export type PaginatedRewards = { [key: string]: ReferralReward[] }