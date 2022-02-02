import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Text, Button } from '@summitswap-uikit'
import { useTokenContract, useReferralContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import CurrencyLogo from 'components/CurrencyLogo'
import { Token, WETH } from '@summitswap-libs'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { useToken } from 'hooks/Tokens'
import { REFERRAL_ADDRESS, BUSDs, CHAIN_ID, KAPEXs } from '../../constants'

interface Props {
  tokenAddress: string
  hasClaimedAll: boolean
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setCanClaimAll: React.Dispatch<React.SetStateAction<boolean>>
}

const CurrencyLogoWrapper = styled(Box)`
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 5px;
  padding: 3px;
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => `${theme.colors.sidebarBackground}99`};
`

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

const ClaimWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
  gap: 10px;
  align-items: center;
`

const TokenCard: React.FC<Props> = ({ tokenAddress, hasClaimedAll, isLoading, setIsLoading, setCanClaimAll }) => {
  const { account } = useWeb3React()

  const [balance, setBalance] = useState<BigNumber | undefined>(undefined)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [hasReferralEnough, setHasReferralEnough] = useState(true)
  const [claimed, setClaimed] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [claimToken, setClaimToken] = useState<Token | undefined>()
  const [claimableTokens, setClaimableTokens] = useState<Token[]>([])
  const [rewardTokenAddress, setRewardTokenAddress] = useState<string>()

  const outputToken = useToken(tokenAddress)
  const rewardToken = useToken(rewardTokenAddress)
  const tokenContract = useTokenContract(tokenAddress, true)
  const refContract = useReferralContract(true)

  useEffect(() => {
    if (!outputToken) return
    if (!rewardToken) return

    const tokenList: Token[] = [BUSDs[CHAIN_ID], KAPEXs[CHAIN_ID], outputToken, rewardToken]
    const uniqueTokenAddresses = [...new Set(tokenList.map((o) => o.address))]
    const uniqueTokenList = uniqueTokenAddresses.map((o) => tokenList.find((oo) => oo.address === o)) as Token[]

    setClaimableTokens(uniqueTokenList)
  }, [outputToken, rewardToken])

  useEffect(() => {
    if (!outputToken) return

    setClaimToken(outputToken)
  }, [outputToken])

  useEffect(() => {
    async function fetchRewardToken() {
      if (!refContract) return
      if (!tokenAddress) return

      const feeInfo = await refContract.feeInfo(tokenAddress)

      setRewardTokenAddress(feeInfo.tokenR)
    }

    fetchRewardToken()
  }, [tokenAddress, refContract])

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
    if (!claimToken) return

    setIsLoading(true)

    try {
      await refContract.claimRewardIn(tokenAddress, claimToken.address ?? WETH[CHAIN_ID].address)
      setClaimed(true)
    } catch (err) {
      const newBalance = (await refContract.balances(tokenAddress, account)) as BigNumber
      const referralAddressBalance = await tokenContract.balanceOf(REFERRAL_ADDRESS)

      setBalance(newBalance)
      setHasReferralEnough(referralAddressBalance.gte(newBalance))
    }

    setIsLoading(false)
  }

  const handleTokenSelect = useCallback((inputCurrency) => {
    setClaimToken(inputCurrency)
  }, [])

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <>
      {tokenSymbol && balance && (
        <>
          <StyledContainer>
            <Text>
              {tokenSymbol} {ethers.utils.formatEther(balance)}
            </Text>

            <ClaimWrapper>
              <Button onClick={handleClaim} disabled={isLoading || !hasReferralEnough || claimed || hasClaimedAll}>
                {claimed || hasClaimedAll ? 'CLAIMED IN' : 'CLAIM IN'}&nbsp;
                <CurrencyLogoWrapper
                  onClick={(e) => {
                    if (isLoading || !hasReferralEnough || claimed || hasClaimedAll) return

                    setModalOpen(true)
                    e.stopPropagation()
                  }}
                >
                  <CurrencyLogo currency={claimToken} size="24px" />
                  &nbsp;{claimToken?.symbol}
                </CurrencyLogoWrapper>
              </Button>
            </ClaimWrapper>
          </StyledContainer>

          {!hasReferralEnough && (
            <Text color="primary" fontSize="14px">
              Doesn&apos;t have enough reward tokens in pool, please contact the project owners
            </Text>
          )}
        </>
      )}
      <CurrencySearchModal
        isOpen={modalOpen}
        onDismiss={handleDismissSearch}
        onCurrencySelect={handleTokenSelect}
        selectedCurrency={claimToken}
        otherSelectedCurrency={null}
        tokens={claimableTokens}
        isAddedByUserOn={false}
        showETH
      />
    </>
  )
}

export default TokenCard
