import { STATUSES } from "./types"

const oneDayTimestamp = 60 * 60 * 24

export const getDayRemaining = (endTimestamp: number): number => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const timeRemaining = endTimestamp > currentTimestamp ? endTimestamp - currentTimestamp : 0
    return Math.ceil(timeRemaining / oneDayTimestamp)
}

export const getKickstarterStatus = (endTimestamp: number): STATUSES => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  if (currentTimestamp > endTimestamp) return STATUSES.COMPLETED
  if (currentTimestamp + 7 * oneDayTimestamp > endTimestamp) return STATUSES.END_SOON
  return STATUSES.ONGOING
}
