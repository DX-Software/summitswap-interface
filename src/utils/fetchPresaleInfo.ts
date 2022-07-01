import { Contract, BigNumber } from 'ethers'
import { FieldNames, PresaleInfo } from '../pages/CustomPresale/types'

export default async function fetchPresaleInfo(presaleContract: Contract | null) {
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