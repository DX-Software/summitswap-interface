import { Statuses } from './types'

const oneDayTimestamp = 60 * 60 * 24

export const getDayRemaining = (endTimestamp: number): number => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const timeRemaining = endTimestamp > currentTimestamp ? endTimestamp - currentTimestamp : 0
  return Math.ceil(timeRemaining / oneDayTimestamp)
}

// TODO: Add ENDED Kickstarter status
export const getKickstarterStatus = (endTimestamp: number): Statuses => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  if (currentTimestamp > endTimestamp) return Statuses.COMPLETED
  if (currentTimestamp + 7 * oneDayTimestamp > endTimestamp) return Statuses.END_SOON
  return Statuses.ONGOING
}
