import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Text, Button } from '@summitswap-uikit'
import { useTokenContract, useReferralContract } from 'hooks/useContract'
import web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import { REFERRAL_ADDRESS } from '../../constants'

interface Props {
  addr: string
  isProcessing: boolean
  setProcessing: any
}

const StyledContainer = styled(Box)`
  padding: 16px;
  background: ${({ theme }) => theme.colors.menuItemBackground};
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:first-of-type {
    font-size: 20px;
  }
`

const TokenCard: React.FC<Props> = ({ addr, isProcessing, setProcessing }) => {
  const { account } = useWeb3React()
  const [balance, setBalance] = useState(0.0)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [isNotEnoughLiquidity, setIsNotEnoughLiquidity] = useState(false)

  const tokenContract = useTokenContract(addr, true)
  const refContract = useReferralContract(REFERRAL_ADDRESS)

  const getIsLiquidityNotEnough = useCallback(async (claimBalance) => {
    const referralAddressBalance = await tokenContract?.balanceOf(REFERRAL_ADDRESS)
    return !referralAddressBalance.gte(web3.utils.hexToNumberString(claimBalance._hex))
  }, [tokenContract])

  useEffect(() => {
    const handleGetBasicInfo = async () => {
      const newTokenSymbol = await tokenContract?.symbol()
      const newTokenName = await tokenContract?.name()
      setTokenSymbol(newTokenSymbol)
      setTokenName(newTokenName)
      const newBalance = await refContract?.rewardBalance(account, addr)
      const isLiquidityNotEnough = await getIsLiquidityNotEnough(newBalance)
      setIsNotEnoughLiquidity(isLiquidityNotEnough)
      setBalance(parseFloat(web3.utils.fromWei(web3.utils.hexToNumberString(newBalance._hex))))
    }
    handleGetBasicInfo()
  }, [tokenContract, refContract, addr, account, getIsLiquidityNotEnough])

  const handleClaim = async () => {
    try {
      setProcessing(true)
      await refContract?.claimReward(addr)
      setTimeout(async () => {
        try {
          const newBalance = await refContract?.rewardBalance(account, addr)
          setBalance(parseFloat(web3.utils.fromWei(web3.utils.hexToNumberString(newBalance._hex))))
          setProcessing(false)
        } catch {
          setProcessing(false)
        }
      }, 20000)
    } catch {
      setProcessing(false)
      const newBalance = await refContract?.rewardBalance(account, addr)
      const isLiquidityNotEnough = await getIsLiquidityNotEnough(newBalance)
      setIsNotEnoughLiquidity(isLiquidityNotEnough)
    }
  }

  return (
    <>
      {balance !== 0 && (
        <>
          <StyledContainer>
            <Text>
              {balance.toFixed(5)} {tokenSymbol}
            </Text>
            <Button onClick={handleClaim} disabled={isProcessing || balance === 0 || isNotEnoughLiquidity}>
              CLAIM
            </Button>
          </StyledContainer>
          {isNotEnoughLiquidity && (
            <Text color='primary' fontSize='14px'>
              Not enough liquidity for Claim, please contact the owners of {tokenName}
            </Text>
          )}
        </>
      )}
    </>
  )
}

export default TokenCard
