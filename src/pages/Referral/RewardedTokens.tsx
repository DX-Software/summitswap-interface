import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Box, Text, Button } from '@koda-finance/summitswap-uikit'
import { Token, WETH } from '@koda-finance/summitswap-sdk'
import { useReferralContract } from 'hooks/useContract'

import { useWeb3React } from '@web3-react/core'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import CurrencyLogo from 'components/CurrencyLogo'
import { useTokenPrices, useTokenPrice } from 'hooks/useTokenPrice'
import { ethers, BigNumber } from 'ethers'
import convertOutputToReward from 'utils/convertOutputToReward'
import TokenCard from './TokenCard'
import { BUSD, CHAIN_ID, KAPEX, WBNB } from '../../constants'
import { useClaimingFeeModal } from './useClaimingFeeModal'

interface RewardedTokensProps {
  tokens?: Array<Token>
}

enum ClaimAllType {
  CLAIM_IN_SPECIFIC_TOKEN,
  CLAIM_IN_REWARDED_TOKEN,
}

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

const CurrencyLogoWrapper = styled(Box)<{ disabled: boolean }>`
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 5px;
  padding: 3px;
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => `${theme.colors.sidebarBackground}99`};
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
`

const RewardedTokens: React.FC<RewardedTokensProps> = ({tokens}) => {
  const { account, library } = useWeb3React()
  const bnbPriceInUsd = useTokenPrice(WBNB)
  const [hasClaimedAll, setHasClaimedAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rewardTokens, setRewardTokens] = useState<string[]>([])
  const [canClaimAll, setCanClaimAll] = useState(true)
  const [claimToken, setClaimToken] = useState<Token>(KAPEX)
  const [claimableTokens, setClaimableTokens] = useState<Token[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [isClaimInSpecificTokenValid, setIsClaimInSpecificTokenValid] = useState<boolean>(false)
  const [isClaimInRewardedTokenValid, setIsClaimInRewardedTokenValid] = useState<boolean>(false)

  const tokenPrices = useTokenPrices(tokens ?? [])
  const refContract = useReferralContract(true)

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
    const tokenList: Token[] = [BUSD, KAPEX].filter((o) => !!o)
    const uniqueTokenAddresses = [...new Set(tokenList.map((o) => o.address))]
    const uniqueTokenList = uniqueTokenAddresses.map((o) => tokenList.find((oo) => oo.address === o)) as Token[]

    setClaimableTokens(uniqueTokenList)
  }, [])

  useEffect(() => {
    const handleClaimInSpecificTokenValid = async () => {
      const _isClaimInSpecificTokenValid = await getIsClaimAllTokenValid(ClaimAllType.CLAIM_IN_SPECIFIC_TOKEN)
      setIsClaimInSpecificTokenValid(_isClaimInSpecificTokenValid)
    }
    handleClaimInSpecificTokenValid()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refContract, claimToken, tokens, tokenPrices, rewardTokens])

  useEffect(() => {
    const handleIsClaimInRewardedTokenValid = async () => {
      const _isClaimInRewardedTokenValid = await getIsClaimAllTokenValid(ClaimAllType.CLAIM_IN_REWARDED_TOKEN)
      setIsClaimInRewardedTokenValid(_isClaimInRewardedTokenValid)
    }
    handleIsClaimInRewardedTokenValid()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refContract, tokens, tokenPrices, rewardTokens])

  async function getIsClaimAllTokenValid(claimAllType: ClaimAllType): Promise<boolean> {
    if (!tokens || tokens.length === 0) return false
    if (!tokenPrices || !refContract) return false
    if (rewardTokens.length === 0) return false
    if (claimAllType === ClaimAllType.CLAIM_IN_SPECIFIC_TOKEN && !claimToken) return false

    try {
      let estimatedGasInBNB
      if (claimAllType === ClaimAllType.CLAIM_IN_SPECIFIC_TOKEN) {
        const claimTokenAddress = claimToken.address ?? WETH[CHAIN_ID].address
        estimatedGasInBNB = await refContract.estimateGas.claimAllRewardsIn(claimTokenAddress)
      } else {
        estimatedGasInBNB = await refContract.estimateGas.claimAllRewardsInOutput()
      }
      const estimatedGasFormatted = ethers.utils.formatUnits(estimatedGasInBNB.mul(2), 8)
      const estimatedGasInUsd = Number(estimatedGasFormatted) * bnbPriceInUsd

      let tokenPriceInUsd = 0

      for (let i = 0; i < rewardTokens.length; i++) {
        const rewardToken = rewardTokens[i]
        const outputToken = tokens.find((o) => o.address === rewardToken)
        if (outputToken) {
          let outputTokenAmount
          if (claimAllType === ClaimAllType.CLAIM_IN_SPECIFIC_TOKEN) {
            outputTokenAmount = (await refContract.balances(rewardToken, account)) as BigNumber
          } else {
            outputTokenAmount = (await refContract.balances(rewardToken, account)) as BigNumber
          }
          const claimInToken: Token = claimAllType === ClaimAllType.CLAIM_IN_SPECIFIC_TOKEN
            ? claimToken
            : outputToken
          const tokenRewardAmount = await convertOutputToReward(
            library,
            refContract,
            outputToken,
            outputTokenAmount,
            claimInToken
          )
          const tokenPrice = tokenPrices[claimInToken.coingeckoId ?? WBNB.coingeckoId!].usd ?? 0
          const totalTokenPriceInUsd = tokenRewardAmount * tokenPrice
          tokenPriceInUsd += totalTokenPriceInUsd
        }
      }

      return tokenPriceInUsd >= estimatedGasInUsd
    } catch (err) {
      console.log("Error: ", err)
      return true
    }
  }

  const [openClaimingFeeModal, closeClaimingFeeModal] = useClaimingFeeModal({
    symbol: claimToken?.symbol as string,
    onConfirm: claimAllInClaimToken,
  })

  async function claimAllInClaimToken() {
    if (!refContract) return
    if (!claimToken) return

    closeClaimingFeeModal()
    if (!(await getIsClaimAllTokenValid(ClaimAllType.CLAIM_IN_SPECIFIC_TOKEN))) {
      setIsClaimInSpecificTokenValid(false)
      return
    }

    setIsLoading(true)

    try {
      await refContract.claimAllRewardsIn(claimToken.address ?? WETH[CHAIN_ID].address)
      setHasClaimedAll(true)
      setRewardTokens([])
    } catch {
      setRewardTokens([...rewardTokens])
    }

    setIsLoading(false)
  }

  async function handleClaimAllInRewarded() {
    if (!refContract) return

    if (!(await getIsClaimAllTokenValid(ClaimAllType.CLAIM_IN_REWARDED_TOKEN))) {
      setIsClaimInRewardedTokenValid(false)
      return
    }

    setIsLoading(true)

    try {
      await refContract.claimAllRewardsInOutput()
      setHasClaimedAll(true)
      setRewardTokens([])
    } catch {
      setRewardTokens([...rewardTokens])
    }

    setIsLoading(false)
  }

  async function handleClaimAllInClaimToken() {
    if (!claimToken) return

    if (claimToken.address === BUSD.address || claimToken.address === undefined) {
      openClaimingFeeModal()
    } else {
      await claimAllInClaimToken()
    }
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
                bnbPriceInUsd={bnbPriceInUsd}
                selectedToken={tokens?.find((o) => o.address === x)}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setCanClaimAll={setCanClaimAll}
              />
            ))}
          </StyledContainer>
          {rewardTokens.length > 0 && (
            <ClaimButtonsWrapper>
              {!hasClaimedAll && (
                <Button mt={3} onClick={handleClaimAllInClaimToken} disabled={isLoading || !canClaimAll || !isClaimInSpecificTokenValid}>
                  CLAIM ALL IN&nbsp;
                  <CurrencyLogoWrapper
                    onClick={(e) => {
                      if (isLoading || !canClaimAll) return

                      setModalOpen(true)
                      e.stopPropagation()
                    }}
                    disabled={isLoading || !canClaimAll}
                  >
                    <CurrencyLogo currency={claimToken} size="24px" />
                    &nbsp;{claimToken?.symbol}
                  </CurrencyLogoWrapper>
                </Button>
              )}
              {(!hasClaimedAll && isClaimInRewardedTokenValid) && (
                <Button mt={3} onClick={handleClaimAllInRewarded} disabled={hasClaimedAll || isLoading || !canClaimAll}>
                  CLAIM ALL IN REWARDED
                </Button>
              )}
            </ClaimButtonsWrapper>
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
        showUnknownTokens={false}
        showETH
      />
    </>
  )
}

export default RewardedTokens
