import { Token } from '@koda-finance/summitswap-sdk'
import { BigNumber, ethers } from 'ethers'
import { getRouterContract } from 'utils'
import { CHAIN_ID, NULL_ADDRESS } from '../constants'

async function convertOutputToReward(library, refContract, outputToken: Token, outputTokenAmount: BigNumber, claimToken: Token): Promise<number> {
  try {
    if (!refContract) return 0
    let claimRewardAmount
    const wbnbAddress = await refContract.wbnb()
    const summitSwapRouterContract = getRouterContract(CHAIN_ID, library)

    const pancakeSwapAddress = await refContract.pancakeswapRouter()
    let pancakeSwapRouterContract
    if (pancakeSwapAddress !== NULL_ADDRESS) {
      pancakeSwapRouterContract = getRouterContract(CHAIN_ID, library, undefined, pancakeSwapAddress)
    }

    if (outputToken.address === claimToken.address) {
      claimRewardAmount = outputTokenAmount
    } else if (claimToken.symbol === "BNB") {
      const path = [
        outputToken.address,
        wbnbAddress
      ]
      const summitSwapRewardAmount = await summitSwapRouterContract.getAmountsOut(outputTokenAmount, path)
      if (!pancakeSwapRouterContract) {
        claimRewardAmount = summitSwapRewardAmount[1]
      } else {
        let pancakeSwapRewardAmount
        try {
          pancakeSwapRewardAmount = await pancakeSwapRouterContract.getAmountsOut(outputTokenAmount, path)
        } catch (err) {
          console.log("Error: ", err)
        }
  
        if (summitSwapRewardAmount >= pancakeSwapRewardAmount) {
          claimRewardAmount = summitSwapRewardAmount[1]
        } else {
          claimRewardAmount = pancakeSwapRewardAmount[1]
        }
      }
    } else {
      const path = [
        outputToken.address,
        wbnbAddress,
        claimToken.address
      ]
      const summitSwapRewardAmount = await summitSwapRouterContract.getAmountsOut(outputTokenAmount, path)
      if (!pancakeSwapRouterContract) {
        claimRewardAmount = summitSwapRewardAmount[2]
      } else {
        let pancakeSwapRewardAmount
        try {
          pancakeSwapRewardAmount = await pancakeSwapRouterContract.getAmountsOut(outputTokenAmount, path)
        } catch (err) {
          console.log("Error: ", err)
        }
    
        if (summitSwapRewardAmount >= pancakeSwapRewardAmount) {
          claimRewardAmount = summitSwapRewardAmount[2]
        } else {
          claimRewardAmount = pancakeSwapRewardAmount[2]
        }
      }
    }

    const feeDenominator = await refContract.feeDenominator()
    let claimingFee
    if (claimToken.symbol === "BNB") {
      claimingFee = await refContract.claimingFee(wbnbAddress)
    } else {
      claimingFee = await refContract.claimingFee(claimToken.address)
    }

    const claimFee = claimRewardAmount.mul(claimingFee).div(feeDenominator)
    const claimRewardAmountAfterFee = claimRewardAmount.sub(claimFee)

    return Number(ethers.utils.formatUnits(claimRewardAmountAfterFee, claimToken.decimals))

  } catch (err) {
    console.log("Error: ", err)
    return 0
  }
}

export default convertOutputToReward
