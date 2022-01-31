import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Box, Text, Button } from '@summitswap-uikit'
import { Token, WETH, Currency } from '@summitswap-libs'
import { useReferralContract } from 'hooks/useContract'

import { useWeb3React } from '@web3-react/core'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import CurrencyLogo from 'components/CurrencyLogo'
import TokenCard from './TokenCard'
import { BUSDs, REFERRAL_ADDRESS, CHAIN_ID, KAPEXs } from '../../constants'

const StyledContainer = styled(Box)`
  display: grid;
  grid-column-gap: 16px;
  grid-row-gap: 8px;
`

const ClaimButtonsWrapper = styled.div`
  margin-bottom: 20px;
  float: right;
  display: flex;
  gap: 10px;
`

const CurrencyLogoWrapper = styled(Box)`
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 5px;
  padding: 3px;
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => `${theme.colors.sidebarBackground}99`};
`

const RewardedTokens: React.FC = () => {
  const { account } = useWeb3React()

  const [hasClaimedAll, setHasClaimedAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rewardTokens, setRewardTokens] = useState<string[]>([])
  const [canClaimAll, setCanClaimAll] = useState(true)
  const [claimToken, setClaimToken] = useState<Token>(KAPEXs[CHAIN_ID])
  const [claimableTokens, setClaimableTokens] = useState<Token[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const refContract = useReferralContract(REFERRAL_ADDRESS, true)

  useEffect(() => {
    const fetchRewardTokens = async () => {
      if (!account) return
      if (!refContract) return

      const balancesLength = Number(await refContract.getBalancesLength(account))

      const balances = await Promise.all(
        Array(balancesLength)
          .fill(0)
          .map((_, balanceIndex) => {
            return refContract.hasBalance(account, balanceIndex)
          })
      )

      setRewardTokens(balances)
    }

    fetchRewardTokens()
  }, [account, refContract])

  useEffect(() => {
    const tokenList: Token[] = [BUSDs[CHAIN_ID], KAPEXs[CHAIN_ID]]
    const uniqueTokenAddresses = [...new Set(tokenList.map((o) => o.address))]
    const uniqueTokenList = uniqueTokenAddresses.map((o) => tokenList.find((oo) => oo.address === o)) as Token[]

    setClaimableTokens(uniqueTokenList)
  }, [])

  async function handleClaimAll() {
    if (!refContract) return

    setIsLoading(true)

    try {
      await refContract.claimAllRewardsInOutput()
      setHasClaimedAll(true)
    } catch {
      setRewardTokens([...rewardTokens])
    }

    setIsLoading(false)
  }

  async function handleClaimAllIn() {
    if (!refContract) return

    setIsLoading(true)

    try {
      await refContract.claimAllRewardsIn(claimToken.address ?? WETH[CHAIN_ID].address)
      setHasClaimedAll(true)
    } catch {
      setRewardTokens([...rewardTokens])
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
      {!rewardTokens.length && (
        <Text bold mt={4}>
          Invite people to see your rewards here
        </Text>
      )}

      {!!rewardTokens.length && (
        <>
          <Text bold mt={3} mb={2}>
            Rewarded Tokens
          </Text>
          <StyledContainer>
            {rewardTokens.map((x) => (
              <TokenCard
                key={x}
                tokenAddress={x}
                hasClaimedAll={hasClaimedAll}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setCanClaimAll={setCanClaimAll}
              />
            ))}
          </StyledContainer>
          <ClaimButtonsWrapper>
            {!hasClaimedAll && (
              <Button mt={3} onClick={handleClaimAllIn} disabled={isLoading || !canClaimAll}>
                CLAIM ALL IN&nbsp;
                <CurrencyLogoWrapper
                  onClick={(e) => {
                    setModalOpen(true)
                    e.stopPropagation()
                  }}
                >
                  <CurrencyLogo currency={claimToken} size="24px" />
                  &nbsp;{claimToken?.symbol}
                </CurrencyLogoWrapper>
              </Button>
            )}
            <Button mt={3} onClick={handleClaimAll} disabled={hasClaimedAll || isLoading || !canClaimAll}>
              {hasClaimedAll ? 'CLAIMED ALL' : 'CLAIM ALL IN REWARDED'}
            </Button>
          </ClaimButtonsWrapper>
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

export default RewardedTokens
