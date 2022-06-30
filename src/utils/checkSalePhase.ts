import { BigNumber } from 'ethers'
import { PresaleInfo, PresalePhases } from 'pages/CustomPresale/types'

const checkSalePhase = (presale: PresaleInfo | undefined) => {
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

export default checkSalePhase