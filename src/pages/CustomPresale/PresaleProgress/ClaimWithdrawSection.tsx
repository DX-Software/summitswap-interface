import React, { useState, useEffect } from 'react'
import { BigNumber, ethers, Contract } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { AutoRenewIcon, Button } from '@koda-finance/summitswap-uikit'
import { Token } from '@koda-finance/summitswap-sdk'
import MessageDiv from 'components/MessageDiv'
import { PresaleInfo, LoadingButtonTypes, LoadingForButton } from '../types'
import { MESSAGE_ERROR, MESSAGE_SUCCESS, WITHDRAW_BNB, EMERGENCY_WITHDRAW_BNB } from '../../../constants/presale'
import { TextSubHeading } from '../StyledTexts'
import Section from './Section'

interface Props {
  token: Token | null | undefined
  youBought: BigNumber | undefined
  isLoading: boolean
  presaleInfo: PresaleInfo | undefined
  presaleContract: Contract | null
  loadingForButton: LoadingForButton
  setYouBought: React.Dispatch<React.SetStateAction<BigNumber | undefined>>
  setPresaleInfo: React.Dispatch<React.SetStateAction<PresaleInfo | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setLoadingForButton: React.Dispatch<React.SetStateAction<LoadingForButton>>
}

const ClaimWithdrawSection = ({
  token,
  youBought,
  isLoading,
  presaleInfo,
  presaleContract,
  loadingForButton,
  setLoadingForButton,
  setPresaleInfo,
  setYouBought,
  setIsLoading,
}: Props) => {
  const { account } = useWeb3React()
  const [isAccountTokensClaimed, setIsAccountTokensClaimed] = useState(false)

  useEffect(() => {
    async function fetchIsTokenClaimed() {
      setIsAccountTokensClaimed(await presaleContract?.isTokenClaimed(account))
    }
    if (presaleContract && account && presaleContract && !isAccountTokensClaimed) {
      fetchIsTokenClaimed()
    }
  }, [presaleContract, account, isAccountTokensClaimed])

  const onClaimHandler = async () => {
    if (!presaleContract || !account) {
      return
    }
    try {
      setIsLoading(true)
      setLoadingForButton({
        type: LoadingButtonTypes.Claim,
        isClicked: true,
        error: '',
      })
      const result = await presaleContract.claim()
      await result.wait()
      setLoadingForButton({
        type: LoadingButtonTypes.NotSelected,
        isClicked: false,
        error: '',
      })
      setIsLoading(false)
      setIsAccountTokensClaimed(true)
    } catch (err) {
      setIsLoading(false)
      setLoadingForButton({
        type: LoadingButtonTypes.Claim,
        isClicked: false,
        error: 'Claim Tokens Failed.',
      })
      console.error(err)
    }
  }

  const onWithdrawBnbHandler = async () => {
    if (!presaleContract || !account || youBought?.eq(0) || presaleInfo?.isClaimPhase) {
      return
    }
    try {
      setIsLoading(true)
      setLoadingForButton({
        type: LoadingButtonTypes.Withdraw,
        isClicked: true,
        error: '',
      })
      const result = await presaleContract[presaleInfo?.isPresaleCancelled ? WITHDRAW_BNB : EMERGENCY_WITHDRAW_BNB]()
      await result.wait()
      const yourBoughtAmount = youBought
      setYouBought(BigNumber.from(0))
      setPresaleInfo((prevState) =>
        prevState && yourBoughtAmount
          ? {
              ...prevState,
              totalBought: prevState.totalBought.sub(yourBoughtAmount),
            }
          : prevState
      )
      setIsLoading(false)
      setLoadingForButton({
        type: LoadingButtonTypes.NotSelected,
        isClicked: false,
        error: '',
      })
    } catch (err) {
      setIsLoading(false)
      setLoadingForButton({
        type: LoadingButtonTypes.Withdraw,
        isClicked: false,
        error: 'Withdrawal Failed.',
      })
      console.error(err)
    }
  }

  return (
    <Section>
      <TextSubHeading>
        {token?.name}:{' '}
        {presaleInfo && youBought
          ? ethers.utils.formatUnits(presaleInfo.presaleRate.mul(youBought), 36).toString()
          : '0.0'}
      </TextSubHeading>
      {isAccountTokensClaimed ? (
        <MessageDiv marginBottom="15px" type={MESSAGE_SUCCESS}>
          Tokens Alredy Claimed.
        </MessageDiv>
      ) : (
        <MessageDiv marginBottom="15px" type={loadingForButton.error !== '' ? MESSAGE_ERROR : MESSAGE_SUCCESS}>
          {loadingForButton.type === LoadingButtonTypes.Claim ||
          loadingForButton.type === LoadingButtonTypes.Withdraw ||
          loadingForButton.type === LoadingButtonTypes.EmergencyWithdraw
            ? loadingForButton.isClicked
              ? loadingForButton.type === LoadingButtonTypes.Claim
                ? 'Claiming Tokens'
                : 'Withdrawing Bnb'
              : loadingForButton.error
            : ''}
        </MessageDiv>
      )}
      {youBought?.gt(0) && !presaleInfo?.isClaimPhase ? (
        <Button
          endIcon={
            (loadingForButton.type === LoadingButtonTypes.Withdraw ||
              loadingForButton.type === LoadingButtonTypes.EmergencyWithdraw) &&
            loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
          }
          disabled={
            presaleInfo?.isClaimPhase ||
            isAccountTokensClaimed ||
            youBought?.eq(0) ||
            loadingForButton?.error !== '' ||
            isLoading ||
            loadingForButton?.isClicked
          }
          onClick={onWithdrawBnbHandler}
        >
          {presaleInfo?.isPresaleCancelled ? 'Withdraw Bnb' : 'Emergency Withdraw'}
        </Button>
      ) : (
        <Button
          endIcon={
            loadingForButton.type === LoadingButtonTypes.Claim &&
            loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
          }
          disabled={
            youBought?.eq(0) ||
            !presaleInfo?.isClaimPhase ||
            isLoading ||
            loadingForButton.isClicked ||
            isAccountTokensClaimed
          }
          onClick={onClaimHandler}
        >
          Claim Your Tokens
        </Button>
      )}
    </Section>
  )
}

export default ClaimWithdrawSection
