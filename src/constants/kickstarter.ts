/* eslint-disable import/prefer-default-export */

export const KICKSTARTER_FACTORY_ADDRESS = `${process.env.REACT_APP_KICKSTARTER_FACTORY_ADDRESS}`
export const PER_PAGE = 6

export const INITIAL_PROJECT_CREATION = {
  title: '',
  creator: '',
  projectDescription: '',
  rewardDescription: '',
  currency: '',
  goals: '0',
  minimumBacking: '0',
  projectDueDate: '',
  rewardDistribution: '',
}
