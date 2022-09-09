import BigNumber from "bignumber.js"

export enum KickstarterProgressStatus {
  ONGOING = "ongoing",
  END_SOON = "end_soon",
  COMPLETED = "completed",
}

export enum KickstarterApprovalStatusId {
  WAITING_FOR_APPROVAL = "0",
  APPROVED = "1",
  REJECTED = "2",
}

export enum KickstarterApprovalStatus {
  WAITING_FOR_APPROVAL = "waiting_for_approval",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum WithdrawalFeeMethod {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount"
}

export enum ContactMethod {
  EMAIL = "email",
  TELEGRAM = "telegram",
  DISCORD = "discord",
  TWITTER = "twitter",
}

export enum OrderDirection {
  ASC = "asc",
  DESC = "desc",
}

export enum OrderKickstarterBy {
  TITLE = "title",
  CREATOR = "creator",
  STATUS = "status",
  MIN_CONTRIBUTION = "minContribution",
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
  totalContribution?: BigNumber
  totalWaitingForApprovalKickstarter?: BigNumber
  totalApprovedKickstarter?: BigNumber
  totalRejectedKickstarter?: BigNumber
}

export type Kickstarter = {
  id: string
  paymentToken?: string
  tokenSymbol?: string
  approvalStatus?: KickstarterApprovalStatus
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
  percentageFeeAmount?: BigNumber
  fixFeeAmount?: BigNumber
  rejectedReason?: string
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
  totalContribution?: BigNumber
}

export type KickstarterContribution = {
  id: string
  kickstarter?: Kickstarter
  contributor?: KickstarterAccount
  amount?: BigNumber
  createdAt?: BigNumber
}
