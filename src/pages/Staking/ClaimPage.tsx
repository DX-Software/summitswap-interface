import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@koda-finance/summitswap-uikit'
import AppBody from 'pages/AppBody'
import { useWeb3React } from '@web3-react/core'
import { useToken } from 'hooks/Tokens'
import { useStakingContract } from 'hooks/useContract'
import { BigNumber, utils } from 'ethers'
import CurrencyLogo from 'components/CurrencyLogo'
import useKodaPrice from 'hooks/useKodaPrice'
import CustomLightSpinner from 'components/CustomLightSpinner'
import NavBar from './Navbar'
import { KODA } from '../../constants'

const ClaimContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 10px;
  background-color: ${(props) => props.theme.colors.card};
  border-radius: 10px;
  padding: 10px;
`

const TokenInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export default function ClaimPage() {
  const { account, library } = useWeb3React()

  const kodaPrice = useKodaPrice()

  const stakingContract = useStakingContract(true)

  const [isLoading, setIsLoading] = useState(false)
  const [pendingKoda, setPendingKoda] = useState<BigNumber>()

  const kodaToken = useToken(KODA.address)

  const fetchPendingRewards = useCallback(async () => {
    setPendingKoda(undefined)

    if (!stakingContract || !account) {
      setPendingKoda(BigNumber.from(0))
      return
    }

    setIsLoading(true)
    const fetchedPendingKoda = (await stakingContract.premiumOf(KODA.address, account)) as BigNumber
    setPendingKoda(fetchedPendingKoda)
    setIsLoading(false)
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
        fetchPendingRewards()
      } catch (err) {
        console.warn(err)
      }
      setIsLoading(false)
    },
    [fetchPendingRewards, library, stakingContract]
  )

  return (
    <AppBody>
      <br />
      <NavBar activeIndex={1} />
      <p>Pending rewards</p>
      {pendingKoda && (
        <ClaimContainer>
          <TokenInfo>
            <CurrencyLogo currency={kodaToken ?? undefined} size="24px" />
            <AmountContainer>
              <b>
                {utils.formatUnits(pendingKoda, KODA.decimals)}
                &nbsp;KODA
              </b>
              {(+utils.formatUnits(pendingKoda, KODA.decimals) * kodaPrice).toFixed(8)}$
            </AmountContainer>
          </TokenInfo>
          <Button disabled={isLoading || pendingKoda.lte(BigNumber.from(0))} onClick={() => claim(KODA.address)}>
            CLAIM
          </Button>
        </ClaimContainer>
      )}
      {isLoading && <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="45px" />}
    </AppBody>
  )
}
