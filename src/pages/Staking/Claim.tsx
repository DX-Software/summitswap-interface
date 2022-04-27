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
import { KAPEX, KODA } from '../../constants'

const ClaimContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px;
  background-color: ${(props) => props.theme.colors.card};
  border-radius: 10px;
  padding: 10px;
`

const TokenInfo = styled.div`
  display: inline-flex;
  align-items: center;
`

export default function Claim() {
  const { account, library } = useWeb3React()

  const stakingContract = useStakingContract(true)

  const [isLoading, setIsLoading] = useState(false)
  const [pendingKoda, setPendingKoda] = useState(BigNumber.from(0))
  const [pendingKapex, setPendingKapex] = useState(BigNumber.from(0))

  const kodaToken = useToken(KODA.address)
  const kapexToken = useToken(KAPEX.address)

  useEffect(() => {
    async function fetchPendingRewards() {
      if (!stakingContract || !account) {
        setPendingKoda(BigNumber.from(0))
        setPendingKapex(BigNumber.from(0))
        return
      }

      setIsLoading(true)
      const fetchedPendingKoda = (await stakingContract.premiumOf(KODA.address, account)) as BigNumber
      setIsLoading(false)

      setPendingKoda(fetchedPendingKoda)


      setIsLoading(true)
      const fetchedPendingKapex = (await stakingContract.premiumOf(KAPEX.address, account)) as BigNumber
      setIsLoading(false)

      setPendingKapex(fetchedPendingKapex)
    }

    fetchPendingRewards()
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
      <p>Pending rewards</p>
      <ClaimContainer>
        <b>
          <TokenInfo>
            <CurrencyLogo currency={kodaToken ?? undefined} size="24px" />
            &nbsp;
            {utils.formatUnits(pendingKoda, KODA.decimals)}
            &nbsp; KODA
          </TokenInfo>
        </b>
        <Button disabled={isLoading || pendingKoda.lte(BigNumber.from(0))} onClick={claim}>
          CLAIM
        </Button>
      </ClaimContainer>
      <ClaimContainer>
        <b>
          <TokenInfo>
            <CurrencyLogo currency={kapexToken ?? undefined} size="24px" />
            &nbsp;
            {utils.formatUnits(pendingKoda, KAPEX.decimals)}
            &nbsp; KAPEX
          </TokenInfo>
        </b>
        <Button style={{justifySelf: 'right'}} disabled={isLoading || pendingKoda.lte(BigNumber.from(0))} onClick={claim}>
          CLAIM
        </Button>
      </ClaimContainer>
    </AppBody>
  )
}
