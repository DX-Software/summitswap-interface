import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Text, Button } from '@summitswap-uikit'
import { useTokenContract, useReferralContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import { REFERRAL_ADDRESS } from '../../constants'

interface Props {
  tokenAddress: string
  hasClaimedAll: boolean
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setCanClaimAll: React.Dispatch<React.SetStateAction<boolean>>
}

const StyledContainer = styled(Box)`
  padding: 16px;
  background: ${({ theme }) => theme.colors.menuItemBackground};
  display: flex;
  border-radius: 20px;
  justify-content: space-between;
  align-items: center;
  > div:first-of-type {
    font-size: 20px;
  }
`

const TokenCard: React.FC<Props> = ({ tokenAddress, hasClaimedAll, isLoading, setIsLoading, setCanClaimAll }) => {
  const { account } = useWeb3React()

  const [balance, setBalance] = useState<BigNumber | undefined>(undefined)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [hasReferralEnough, setHasReferralEnough] = useState(true)
  const [claimed, setClaimed] = useState(false)

  const tokenContract = useTokenContract(tokenAddress, true)
  const refContract = useReferralContract(REFERRAL_ADDRESS, true)

  useEffect(() => {
    const handleGetBasicInfo = async () => {
      if (!tokenContract) return
      if (!refContract) return

      const newBalance = (await refContract.balances(tokenAddress, account)) as BigNumber
      const referralAddressBalance = await tokenContract.balanceOf(REFERRAL_ADDRESS)
      const hasReferralEnoughBalance = referralAddressBalance.gte(newBalance)

      setTokenSymbol(await tokenContract.symbol())
      setBalance(newBalance)
      setHasReferralEnough(hasReferralEnoughBalance)

      
      if (!hasReferralEnoughBalance) {
        setCanClaimAll(false)
      }

      setIsLoading(false)
    }

    handleGetBasicInfo()
  }, [tokenContract, refContract, tokenAddress, account, setIsLoading, setCanClaimAll])

  const handleClaim = async () => {
    if (!tokenContract) return
    if (!refContract) return

    setIsLoading(true)

    try {
      await refContract?.claimReward(tokenAddress)
      setClaimed(true)
    } catch (err) {
      const newBalance = (await refContract.balances(tokenAddress, account)) as BigNumber
      const referralAddressBalance = await tokenContract.balanceOf(REFERRAL_ADDRESS)

      setBalance(newBalance)
      setHasReferralEnough(referralAddressBalance.gte(newBalance))
    }

    setIsLoading(false)
  }

  return (
    <>
      {tokenSymbol && balance && (
        <>
          <StyledContainer>
            <Text>
              {tokenSymbol} {ethers.utils.formatEther(balance)}
            </Text>
            <Button onClick={handleClaim} disabled={isLoading || !hasReferralEnough || claimed || hasClaimedAll}>
              {claimed || hasClaimedAll ? 'CLAIMED' : 'CLAIM'}
            </Button>
          </StyledContainer>

          {!hasReferralEnough && (
            <Text color="primary" fontSize="14px">
              Doesn&apos;t have enough reward tokens in pool, please contact the project owners
            </Text>
          )}
        </>
      )}
    </>
  )
}

export default TokenCard
