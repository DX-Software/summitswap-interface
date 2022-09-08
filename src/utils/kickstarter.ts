import BigNumber from "bignumber.js"
import { BackedKickstarter, ContactMethod, Kickstarter, KickstarterAccount, KickstarterApprovalStatus, KickstarterContribution, KickstarterFactory, KickstarterProgressStatus } from "types/kickstarter"

const oneDayTimestamp = 60 * 60 * 24

export function convertToKickstarterFactory(data?: { [key: string]: any } | null): KickstarterFactory | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
    totalKickstarter: data.totalKickstarter ? new BigNumber(data.totalKickstarter) : undefined,
    totalBackedKickstarter: data.totalBackedKickstarter ? new BigNumber(data.totalBackedKickstarter) : undefined,
    totalProjectGoals: data.totalProjectGoals ? new BigNumber(data.totalProjectGoals) : undefined,
    totalContribution: data.totalContribution ? new BigNumber(data.totalContribution) : undefined,
  }
}

export function convertToKickstarter(data?: { [key: string]: any } | null): Kickstarter | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
    paymentToken: data.paymentToken,
    tokenSymbol: data.tokenSymbol,
    approvalStatus: data.approvalStatus ? getKickstarterApprovalById(data.approvalStatus.toString()) : undefined,
    owner: data.owner,
    title: data.title,
    creator: data.creator,
    imageUrl: data.imageUrl,
    projectDescription: data.projectDescription,
    rewardDescription: data.rewardDescription,
    minContribution: data.minContribution ? new BigNumber(data.minContribution) : undefined,
    totalContribution: data.totalContribution ? new BigNumber(data.totalContribution) : undefined,
    totalContributor: data.totalContributor ? new BigNumber(data.totalContributor) : undefined,
    projectGoals: data.projectGoals ? new BigNumber(data.projectGoals) : undefined,
    rewardDistributionTimestamp: data.rewardDistributionTimestamp ? new BigNumber(data.rewardDistributionTimestamp) : undefined,
    startTimestamp: data.startTimestamp ? new BigNumber(data.startTimestamp) : undefined,
    endTimestamp: data.endTimestamp ? new BigNumber(data.endTimestamp) : undefined,
    percentageFeeAmount: data.percentageFeeAmount ? new BigNumber(data.percentageFeeAmount) : undefined,
    fixFeeAmount: data.fixFeeAmount ? new BigNumber(data.fixFeeAmount) : undefined,
    rejectedReason: data.rejectedReason,
    createdAt: data.createdAt ? new BigNumber(data.createdAt) : undefined,
  }
}

export function convertToBackedKickstarter(data?: { [key: string]: any } | null): BackedKickstarter | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
    contributor: convertToKickstarterAccount(data.contributor),
    kickstarter: convertToKickstarter(data.kickstarter),
    amount: data.amount ? new BigNumber(data.amount): undefined,
    lastUpdated: data.lastUpdated ? new BigNumber(data.lastUpdated) : undefined,
  }
}

export function convertToKickstarterAccount(data?: { [key: string]: any } | null): KickstarterAccount | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
    totalKickstarter: data.totalKickstarter ? new BigNumber(data.totalKickstarter) : undefined,
    totalBackedKickstarter: data.totalBackedKickstarter ? new BigNumber(data.totalBackedKickstarter) : undefined,
    totalProjectGoals: data.totalProjectGoals ? new BigNumber(data.totalProjectGoals) : undefined,
    totalContribution: data.totalContribution ? new BigNumber(data.totalContribution) : undefined,
  }
}

export function convertToKickstarterContribution(data?: { [key: string]: any } | null): KickstarterContribution | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
    kickstarter: convertToKickstarter(data.kickstarter),
    contributor: convertToKickstarterAccount(data.contributor),
    amount: data.amount ? new BigNumber(data.amount): undefined,
    createdAt: data.createdAt ? new BigNumber(data.createdAt) : undefined,
  }
}

export const getDayRemaining = (endTimestamp: number): number => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const timeRemaining = endTimestamp > currentTimestamp ? endTimestamp - currentTimestamp : 0
  return Math.ceil(timeRemaining / oneDayTimestamp)
}

export const getKickstarterStatus = (endTimestamp: number): KickstarterProgressStatus => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const dayRemaining = getDayRemaining(endTimestamp)

  if (currentTimestamp > endTimestamp) return KickstarterProgressStatus.COMPLETED
  if (dayRemaining <= 7) return KickstarterProgressStatus.END_SOON
  return KickstarterProgressStatus.ONGOING
}

export const getKickstarterStatusLabel = (endTimestamp: number, showInDays = false) => {
  const dayRemaining = getDayRemaining(endTimestamp)
  const kickstarterStatus = getKickstarterStatus(endTimestamp)
  if (!showInDays && kickstarterStatus === KickstarterProgressStatus.COMPLETED) return "Completed"
  if (showInDays || dayRemaining <= 7) return `${dayRemaining} day${dayRemaining > 1 ? "s" : ""} left`
  return "Ongoing"
}

export const getKickstarterApprovalById = (id: string) => {
  if (id === "0") return KickstarterApprovalStatus.WAITING_FOR_APPROVAL
  if (id === "1") return KickstarterApprovalStatus.APPROVED
  return KickstarterApprovalStatus.REJECTED
}

export const getKickstarterApprovalStatusLabel = (approvalStatus?: KickstarterApprovalStatus) => {
  if (approvalStatus === KickstarterApprovalStatus.WAITING_FOR_APPROVAL) return "Waiting for Approval"
  if (approvalStatus === KickstarterApprovalStatus.APPROVED) return "Approved"
  if (approvalStatus === KickstarterApprovalStatus.REJECTED) return "Rejected"
  return ""
}

export const getKickstarterContactMethodById = (id: string) => {
  if (ContactMethod.EMAIL.toString() === id) return ContactMethod.EMAIL
  if (ContactMethod.TELEGRAM.toString() === id) return ContactMethod.TELEGRAM
  if (ContactMethod.DISCORD.toString() === id) return ContactMethod.DISCORD
  if (ContactMethod.TWITTER.toString() === id) return ContactMethod.TWITTER
  return undefined
}
