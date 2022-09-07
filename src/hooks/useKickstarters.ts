import BigNumber from "bignumber.js"

export type Kickstarter = {
  id: string
  owner: {
    id: string
  }
  title: string
  creator: string
  imageUrl: string
  projectDescription: string
  rewardDescription: string
  minContribution: BigNumber
  totalContributor: number
  totalContribution: BigNumber
  projectGoals: BigNumber
  rewardDistributionTimestamp: number
  hasDistributedRewards: boolean
  startTimestamp: number
  endTimestamp: number
  createdAt: number
}
