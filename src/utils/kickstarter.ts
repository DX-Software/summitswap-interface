import BigNumber from "bignumber.js";
import { BackedKickstarter, Kickstarter, KickstarterAccount, KickstarterContribution, KickstarterFactory } from "types/kickstarter";

export function convertToKickstarterFactory(data?: { [key: string]: any }): KickstarterFactory | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
    totalKickstarter: data.totalKickstarter ? new BigNumber(data.totalKickstarter) : undefined,
    totalBackedKickstarter: data.totalBackedKickstarter ? new BigNumber(data.totalBackedKickstarter) : undefined,
    totalProjectGoals: data.totalProjectGoals ? new BigNumber(data.totalProjectGoals) : undefined,
    totalContribution: data.totalContribution ? new BigNumber(data.totalContribution) : undefined,
  }
}

export function convertToKickstarter(data?: { [key: string]: any }): Kickstarter | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
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
    createdAt: data.createdAt ? new BigNumber(data.createdAt) : undefined,
  }
}

export function convertToBackedKickstarter(data?: { [key: string]: any }): BackedKickstarter | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
    contributor: convertToKickstarterAccount(data.contributor),
    kickstarter: convertToKickstarter(data.kickstarter),
    amount: data.amount ? new BigNumber(data.amount): undefined,
    lastUpdated: data.lastUpdated ? new BigNumber(data.lastUpdated) : undefined,
  }
}

export function convertToKickstarterAccount(data?: { [key: string]: any }): KickstarterAccount | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
    totalKickstarter: data.totalKickstarter ? new BigNumber(data.totalKickstarter) : undefined,
    totalBackedKickstarter: data.totalBackedKickstarter ? new BigNumber(data.totalBackedKickstarter) : undefined,
    totalProjectGoals: data.totalProjectGoals ? new BigNumber(data.totalProjectGoals) : undefined,
    totalContribution: data.totalContribution ? new BigNumber(data.totalContribution) : undefined,
  }
}

export function convertToKickstarterContribution(data?: { [key: string]: any }): KickstarterContribution | undefined {
  if (!data) return undefined
  return {
    id: data.id || "",
    kickstarter: convertToKickstarter(data.kickstarter),
    contributor: convertToKickstarterAccount(data.contributor),
    amount: data.amount ? new BigNumber(data.amount): undefined,
    createdAt: data.createdAt ? new BigNumber(data.createdAt) : undefined,
  }
}
