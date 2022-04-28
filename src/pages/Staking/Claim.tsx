/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@koda-finance/summitswap-uikit'
import AppBody from 'pages/AppBody'
import { useWeb3React } from '@web3-react/core'
import { useToken } from 'hooks/Tokens'
import { useStakingContract } from 'hooks/useContract'
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

  const fetchPendingRewards = useCallback(async () => {
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
  }, [account, stakingContract])

  useEffect(() => {
    fetchPendingRewards()
  }, [fetchPendingRewards])

  const claim = useCallback(
    async (premiumTokenAddress: string) => {
      if (!stakingContract) {
        return
      }

      setIsLoading(true)
      try {
        const receipt = await stakingContract.claimPremium(premiumTokenAddress)
        await library.waitForTransaction(receipt.hash)
      } catch (err) {
        console.warn(err)
      }
      setIsLoading(false)

      fetchPendingRewards()
    },
    [fetchPendingRewards, library, stakingContract]
  )

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
        <Button disabled={isLoading || pendingKoda.lte(BigNumber.from(0))} onClick={() => claim(KODA.address)}>
          CLAIM
        </Button>
      </ClaimContainer>
      <ClaimContainer>
        <b>
          <TokenInfo>
            <CurrencyLogo currency={kapexToken ?? undefined} size="24px" />
            &nbsp;
            {utils.formatUnits(pendingKapex, KAPEX.decimals)}
            &nbsp; KAPEX
          </TokenInfo>
        </b>
        <Button
          style={{ justifySelf: 'right' }}
          disabled={isLoading || pendingKoda.lte(BigNumber.from(0))}
          onClick={() => claim(KAPEX.address)}
        >
          CLAIM
        </Button>
      </ClaimContainer>
    </AppBody>
  )
}
