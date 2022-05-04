import { BigNumber } from 'ethers'
import { KODA, KAPEX } from '.'

export const APYs = {
  [KODA.address]: {
    0: BigNumber.from(55),
    7889229: BigNumber.from(80),
    15778458: BigNumber.from(105),
    31556916: BigNumber.from(150),
  },
  [KAPEX.address]: {
    0: BigNumber.from(0),
    7889229: BigNumber.from(80),
    15778458: BigNumber.from(105),
    31556916: BigNumber.from(150),
  },
}

export const maximumKodaReward = BigNumber.from('24657534000000000')
