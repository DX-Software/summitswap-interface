import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Text, Button } from '@summitswap-uikit'
import { useTokenContract, useReferralContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import { REFERRAL_ADDRESS } from '../../constants'

interface Props {
  tokenAddress: string
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

const TokenCard: React.FC<Props> = ({ tokenAddress }) => {
  const { account } = useWeb3React()

  const [balance, setBalance] = useState<BigNumber | undefined>(undefined)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [hasReferralEnough, setHasReferralEnough] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [claimed, setClaimed] = useState(false)

  const tokenContract = useTokenContract(tokenAddress, true)
  const refContract = useReferralContract(REFERRAL_ADDRESS, true)

  useEffect(() => {
    const handleGetBasicInfo = async () => {
      if (!tokenContract) return
      if (!refContract) return

      const newBalance = (await refContract.balances(tokenAddress, account)) as BigNumber
      const referralAddressBalance = await tokenContract.balanceOf(REFERRAL_ADDRESS)

      setTokenSymbol(await tokenContract.symbol())
      setBalance(newBalance)
      setHasReferralEnough(referralAddressBalance.gte(newBalance))

      setIsLoading(false)
    }

    handleGetBasicInfo()
  }, [tokenContract, refContract, tokenAddress, account])

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
        <StyledContainer>
          <Text>
            {tokenSymbol} {ethers.utils.formatEther(balance)}
          </Text>
          <Button onClick={handleClaim} disabled={isLoading || !hasReferralEnough || claimed}>
            {claimed ? 'CLAIMED' : 'CLAIM'}
          </Button>
        </StyledContainer>
      )}

      {!isLoading && !hasReferralEnough && (
        <Text color="primary" fontSize="14px">
          Doesn&apos;t have enough reward tokens in pool, please contact the project owners
        </Text>
      )}
    </>
  )
}

export default TokenCard
