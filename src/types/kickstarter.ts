import BigNumber from "bignumber.js"

export type KickstarterFactory = {
  id: string
  totalKickstarter?: BigNumber
  totalBackedKickstarter?: BigNumber
  totalProjectGoals?: BigNumber
  totalContribution?: BigNumber
}

export type Kickstarter = {
  id: string
  owner?: Account
  title?: string
  creator?: string
  imageUrl?: string
  projectDescription?: string
  rewardDescription?: string
  minContribution?: BigNumber
  totalContribution?: BigNumber
  totalContributor?: BigNumber
  projectGoals?: BigNumber
  rewardDistributionTimestamp?: BigNumber
  hasDistributedRewards?: boolean
  startTimestamp?: BigNumber
  endTimestamp?: BigNumber
  createdAt?: BigNumber
}

export type BackedKickstarter = {
  id: string
  contributor?: Account
  kickstarter?: Kickstarter
  amount?: BigNumber
  lastUpdated?: BigNumber
}

export type Account = {
  id: string
  totalKickstarter?: BigNumber
  totalBackedKickstarter?: BigNumber
  totalProjectGoals?: BigNumber
  totalContribution?: BigNumber
}

export type Contribution = {
  id: string
  kickstarter?: Kickstarter
  contributor?: Account
  amount?: BigNumber
  createdAt?: BigNumber
}
