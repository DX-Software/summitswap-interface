import { BigNumber, Contract } from 'ethers'
import { FieldNames, PresaleInfo, PresalePhases } from '../pages/CustomPresale/types'

export async function fetchPresaleInfo(presaleContract: Contract | null) {
  const owner: string = await presaleContract?.owner()
  const info = await presaleContract?.getInfo()
  const obKeys = [
    FieldNames.presaleToken,
    FieldNames.router,
    FieldNames.presaleRate,
    FieldNames.listingRate,
    FieldNames.liquidyLockTimeInMins,
    FieldNames.minBuyBnb,
    FieldNames.maxBuyBnb,
    FieldNames.softcap,
    FieldNames.hardcap,
    FieldNames.liquidity,
    FieldNames.startPresaleTime,
    FieldNames.endPresaleTime,
    FieldNames.totalBought,
    FieldNames.feeType,
    FieldNames.refundType,
    FieldNames.isWhitelistEnabled,
    FieldNames.isClaimPhase,
    FieldNames.isPresaleCancelled,
    FieldNames.isWithdrawCancelledTokens,
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
