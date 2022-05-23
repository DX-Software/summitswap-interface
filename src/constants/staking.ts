import { BigNumber } from 'ethers'
import { KODA, KAPEX } from '.'

export const LOCKING_PERIODS = {
  _0Months: 0,
  _3Months: 7948800,
  _6Months: 15811200,
  _12Months: 31536000,
}

export const APYS = {
  [KODA.address]: {
    [LOCKING_PERIODS._0Months]: BigNumber.from(55),
    [LOCKING_PERIODS._3Months]: BigNumber.from(80),
    [LOCKING_PERIODS._6Months]: BigNumber.from(105),
    [LOCKING_PERIODS._12Months]: BigNumber.from(150),
  },
  [KAPEX.address]: {
    [LOCKING_PERIODS._0Months]: BigNumber.from(0),
    [LOCKING_PERIODS._3Months]: BigNumber.from(80),
    [LOCKING_PERIODS._6Months]: BigNumber.from(105),
    [LOCKING_PERIODS._12Months]: BigNumber.from(150),
  },
}

export const STATUSES = {
  1: 'ROYAL',
  2: 'VIP',
  3: '1144',
}

export const maximumKodaYearlyReward = BigNumber.from('9000000000000000000')
