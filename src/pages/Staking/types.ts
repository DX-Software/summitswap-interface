import { BigNumber } from "ethers"

export interface Deposit {
  id: number
  user: string
  depositAt: number
  lockFor: number
  amount: BigNumber
  penalty: number
  apy: BigNumber
}
