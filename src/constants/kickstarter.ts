/* eslint-disable import/prefer-default-export */
import { NULL_ADDRESS } from "constants/index"

export const KICKSTARTER_FACTORY_ADDRESS = `${process.env.REACT_APP_KICKSTARTER_FACTORY_ADDRESS}`
export const PER_PAGE = 6

export const INITIAL_PROJECT_CREATION = {
  title: '',
  creator: '',
  projectDescription: '',
  rewardDescription: '',
  paymentToken: NULL_ADDRESS,
  projectGoals: '0',
  minContribution: '0',
  endTimestamp: '',
  rewardDistributionTimestamp: '',
}
