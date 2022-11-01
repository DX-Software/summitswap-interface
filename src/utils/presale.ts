import { BigNumber, Contract } from 'ethers'
import { CONTACT_INFO_DELIMITER } from 'constants/presale'
import { FieldNames, PresaleInfo, PresalePhases, FeeInfo, ProjectDetails } from '../pages/PresaleApplication/types'

export async function fetchPresaleInfo(presaleContract: Contract | null) {
  const owner: string = await presaleContract?.owner()
  const info = await presaleContract?.getPresaleInfo()

  const obKeys = [
    FieldNames.presaleToken,
    FieldNames.router0,
    FieldNames.router1,
    FieldNames.listingToken,
    FieldNames.presaleRate,
    FieldNames.listingRate,
    FieldNames.liquidyLockTimeInMins,
    FieldNames.minBuy,
    FieldNames.maxBuy,
    FieldNames.softcap,
    FieldNames.hardcap,
    FieldNames.liquidity,
    FieldNames.startPresaleTime,
    FieldNames.endPresaleTime,
    FieldNames.claimIntervalDay,
    FieldNames.claimIntervalHour,
    FieldNames.totalBought,
    FieldNames.maxClaimPercentage,
    FieldNames.refundType,
    FieldNames.listingChoice,
    FieldNames.isWhitelistEnabled,
    FieldNames.isClaimPhase,
    FieldNames.isPresaleCancelled,
    FieldNames.isWithdrawCancelledTokens,
    FieldNames.isVestingEnabled,
    FieldNames.isApproved,
  ]
  const preInfo: PresaleInfo = info.reduce(
    (acc: any, cur: string | BigNumber | number | boolean, i: number) => {
      acc[obKeys[i]] = cur
      return acc
    },
    { owner }
  )
  return preInfo
}

export async function fetchFeeInfo(presaleContract: Contract | null) {
  const info = await presaleContract?.getFeeInfo()

  const obKeys = [
    FieldNames.paymentToken,
    FieldNames.feePaymentToken,
    FieldNames.feePresaleToken,
  ]
  const feeInfo: FeeInfo = info.reduce((acc: any, cur: string | BigNumber, i: number) => {
    acc[obKeys[i]] = cur
    return acc
  }, {})
  return feeInfo
}

export async function fetchProjectDetails(presaleContract: Contract | null) {
  const [
    logoUrl,
    projectName,
    contactName,
    contactPosition,
    email,
    contactMethod,
    description,
    combinedSocialIds,
  ] = await presaleContract?.getProjectsDetails()

  const [websiteUrl, discordId, twitterId, telegramId] = combinedSocialIds.split( CONTACT_INFO_DELIMITER )

  return {
    logoUrl,
    projectName,
    websiteUrl,
    contactName,
    contactPosition,
    email,
    telegramId,
    contactMethod,
    description,
    discordId,
    twitterId,
  } as ProjectDetails
}


export const checkSalePhase = (presale: PresaleInfo | undefined) => {
  if (presale) {
    if (presale.isPresaleCancelled) {
      return PresalePhases.PresaleCancelled
    }
    if (presale.isClaimPhase) {
      return PresalePhases.ClaimPhase
    }
    if (presale.startPresaleTime.mul(1000).lt(BigNumber.from(Date.now()))) {
      if (presale.endPresaleTime.mul(1000).gt(BigNumber.from(Date.now()))) {
        return PresalePhases.PresalePhase
      }
      return PresalePhases.PresaleEnded
    }
    return PresalePhases.PresaleNotStarted
  }
  return ''
}

export const getUtcDate = (date: string, time: string) => {
  const date2 = new Date(date)
  const [hours, mins] = time.split(':')
  return new Date(Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), Number(hours), Number(mins)))
}
