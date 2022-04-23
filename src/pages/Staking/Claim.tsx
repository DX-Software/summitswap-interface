/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Radio, Input, Progress, Button } from '@koda-finance/summitswap-uikit'
import AppBody from 'pages/AppBody'
import { useWeb3React } from '@web3-react/core'
import { useToken } from 'hooks/Tokens'
import { useStakingContract, useTokenContract } from 'hooks/useContract'
import { BigNumber, utils } from 'ethers'
import CurrencyLogo from 'components/CurrencyLogo'
import NavBar from './Navbar'

const ClaimContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const TokenInfo = styled.div`
  display: inline-flex;
  align-items: center;
`

export default function Claim() {
  const { account, library } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [premiumTokenAddress, setPremiumTokenAddress] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [pendingReward, setPendingReward] = useState(BigNumber.from(0))

  const premiumTokenContract = useTokenContract(premiumTokenAddress)
  const premiumToken = useToken(premiumTokenAddress)

  useEffect(() => {
    async function fetchStakingTokenAddress() {
      if (!stakingContract) {
        setPremiumTokenAddress(undefined)
        return
      }

      const fetchedStakingTokenAddress = (await stakingContract.premiumToken()) as string

      setPremiumTokenAddress(fetchedStakingTokenAddress)
    }

    fetchStakingTokenAddress()
  }, [stakingContract])

  useEffect(() => {
    async function fetchPendingReward() {
      if (!stakingContract || !account) {
        setPendingReward(BigNumber.from(0))
        return
      }

      setIsLoading(true)
      const fetchedPendingReward = (await stakingContract.premiumOf(account)) as BigNumber
      setIsLoading(false)

      setPendingReward(fetchedPendingReward)
    }

    fetchPendingReward()
  }, [account, stakingContract])

  const claim = useCallback(() => {
    async function claimRewards() {
      if (!stakingContract) {
        return
      }

      setIsLoading(true)
      await stakingContract.claimPremium()
      setIsLoading(false)
    }

    claimRewards()
  }, [stakingContract])

  return (
    <AppBody>
      <br />
      <NavBar activeIndex={1} />
      <ClaimContainer>
        <p>
          Pending rewards:{' '}
          <b>
            <TokenInfo>
              {utils.formatUnits(pendingReward, premiumToken?.decimals)}
              &nbsp;
              <CurrencyLogo currency={premiumToken ?? undefined} size="24px" />
              &nbsp; KAPEX
            </TokenInfo>
          </b>
        </p>
        <Button disabled={isLoading || pendingReward.lte(BigNumber.from(0))} onClick={claim}>
          CLAIM
        </Button>
      </ClaimContainer>
    </AppBody>
  )
}
