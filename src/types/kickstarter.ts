import BigNumber from "bignumber.js"

export enum OrderDirection {
  ASC = "asc",
  DESC = "desc",
}

export enum OrderKickstarterBy {
  TITLE = "title",
  CREATOR = "creator",
  TOTAL_CONTRIBUTION = "totalContribution",
  PROJECT_GOALS = "projectGoals",
  START_TIMESTAMP = "startTimestamp",
  END_TIMESTAMP = "endTimestamp",
  CREATED_AT = "createdAt",
}

export type KickstarterFactory = {
  id: string
  totalKickstarter?: BigNumber
  totalBackedKickstarter?: BigNumber
  totalProjectGoals?: BigNumber
  totalContribution?: BigNumber
}

export type Kickstarter = {
  id: string
  owner?: KickstarterAccount
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
  startTimestamp?: BigNumber
  endTimestamp?: BigNumber
  createdAt?: BigNumber
}

export type BackedKickstarter = {
  id: string
  contributor?: KickstarterAccount
  kickstarter?: Kickstarter
  amount?: BigNumber
  lastUpdated?: BigNumber
}

export type KickstarterAccount = {
  id: string
  totalKickstarter?: BigNumber
  totalBackedKickstarter?: BigNumber
  totalProjectGoals?: BigNumber
  totalContribution?: BigNumber
}

export type KickstarterContribution = {
  id: string
  kickstarter?: Kickstarter
  contributor?: KickstarterAccount
  amount?: BigNumber
  createdAt?: BigNumber
}
