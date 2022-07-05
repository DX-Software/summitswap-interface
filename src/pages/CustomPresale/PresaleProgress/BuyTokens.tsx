import { Token } from '@koda-finance/summitswap-sdk'
import { AutoRenewIcon, Button, Input, Progress, Text, useWalletModal } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, Contract, ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import checkSalePhase from 'utils/checkSalePhase'
import login from 'utils/login'
import { TranslateString } from 'utils/translateTextHelpers'
import MessageDiv from '../../../components/MessageDiv'
import { RowBetween } from '../../../components/Row'
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from '../../../constants/presale'
import { TextSubHeading } from '../StyledTexts'
import { FieldProps, LoadingForButton, PresaleInfo, PresalePhases } from '../types'
import ProgressBox from './ProgressBox'
import Section from './Section'

interface Props {
  token: Token | null | undefined
  youBought: BigNumber | undefined
  isLoading: boolean
  presaleInfo: PresaleInfo | undefined
  presaleContract: Contract | null
  loadingForButton: LoadingForButton
  whitelistAddresses: string[]
  setYouBought: React.Dispatch<React.SetStateAction<BigNumber | undefined>>
  setPresaleInfo: React.Dispatch<React.SetStateAction<PresaleInfo | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const InputBnb = styled(Input)`
  background: #011d2c;
  width: 45%;
  ${(props) => (props.isWarning ? '' : 'border: 0.557844px solid #00d5a5')};
  text-align: center;
  border-radius: 50px;
`

const BuyTokens = ({
  token,
  youBought,
  isLoading,
  presaleInfo,
  presaleContract,
  loadingForButton,
  whitelistAddresses,
  setPresaleInfo,
  setYouBought,
  setIsLoading,
}: Props) => {
  const { account, activate, deactivate } = useWeb3React()
  const [buyBnbAmount, setBuyBnbAmount] = useState<FieldProps>({ value: '', error: '' })
  const [isAccountWhitelisted, setIsAccountWhitelisted] = useState(false)

  useEffect(() => {
    if (whitelistAddresses && account) {
      setIsAccountWhitelisted(whitelistAddresses.includes(account))
    }
  }, [whitelistAddresses, account])

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )
  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const buyBnbAmountChangeHandler = (e: any) => {
    let error = ''
    const bigAmount = BigNumber.from(e.target.value ? ethers.utils.parseUnits(e.target.value, 18) : '0')
    if (!bigAmount.isZero()) {
      if (checkSalePhase(presaleInfo) === PresalePhases.PresalePhase) {
        if (bigAmount.lt(0)) {
          error = 'Buy Bnb Amount should be a positive number'
        } else if (presaleInfo && bigAmount.add(presaleInfo.totalBought).gt(presaleInfo.hardcap)) {
          error = 'Buy Bnb Amount should be less than hardcap'
        } else if (youBought && presaleInfo && bigAmount.add(youBought).gt(presaleInfo.maxBuyBnb)) {
          error = 'Buy Bnb amount should be less max bnb amount'
        } else if (presaleInfo && bigAmount.lt(presaleInfo.minBuyBnb)) {
          error = 'Buy Bnb amount should be greater min bnb amount'
        }
      } else {
        error = 'Not Presale Phase'
      }
    }
    setBuyBnbAmount({ value: e.target.value, error })
  }

  const onBuyBnbHandler = async () => {
    const bnbVal = ethers.utils.parseUnits(buyBnbAmount.value, 18)
    if (!presaleContract || !account || !(presaleInfo && (!presaleInfo.isWhitelistEnabled || isAccountWhitelisted))) {
      return
    }
    try {
      setIsLoading(true)
      const result = await presaleContract.buy({
        value: bnbVal,
      })
      await result.wait()
      setPresaleInfo((prevState) =>
        prevState
          ? {
              ...prevState,
              totalBought: prevState.totalBought.add(bnbVal),
            }
          : prevState
      )
      setYouBought((prev) => prev?.add(bnbVal))
      setBuyBnbAmount({ error: '', value: '' })
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setBuyBnbAmount((prevState) => ({ ...prevState, error: 'Buying Failed' }))
      console.error(err)
    }
  }
  return (
    <Section>
      <InputBnb
        value={buyBnbAmount.value}
        onChange={buyBnbAmountChangeHandler}
        isWarning={buyBnbAmount.error !== ''}
        type="number"
        placeholder="Enter BNB Amount"
      />
      <MessageDiv marginTop="15px" type={isLoading && !loadingForButton.isClicked ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
        {buyBnbAmount.value && !loadingForButton.isClicked && isLoading ? 'Buying Tokens' : buyBnbAmount.error}
      </MessageDiv>
      <TextSubHeading marginBottom="15px" marginTop="15px" textAlign="center">
        Your Progress
      </TextSubHeading>
      <ProgressBox marginBottom={1} width="100%">
        <Progress
          primaryStep={youBought && presaleInfo ? youBought.mul(100).div(presaleInfo.maxBuyBnb).toNumber() : 0}
        />
      </ProgressBox>
      <RowBetween>
        <TextSubHeading>
          {youBought && presaleInfo ? youBought.mul(100).div(presaleInfo.maxBuyBnb).toNumber() : 0}%
        </TextSubHeading>
        <TextSubHeading>
          {`${youBought ? formatUnits(youBought, 18) : '0.0'}/${formatUnits(presaleInfo?.maxBuyBnb || 0, 18)} BNB`}
        </TextSubHeading>
      </RowBetween>
      <Text marginBottom="15px" style={{ height: '17px' }} fontSize="17px">
        {presaleInfo && buyBnbAmount.value && !buyBnbAmount.error
          ? ` Estimated ${token?.symbol}: ${
              Number(formatUnits(presaleInfo.presaleRate || 0, 18)) * Number(buyBnbAmount.value)
            }`
          : ''}
      </Text>
      {account ? (
        <Button
          endIcon={
            buyBnbAmount.value &&
            isLoading &&
            !loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
          }
          disabled={buyBnbAmount.error !== '' || isLoading || loadingForButton.isClicked || !buyBnbAmount.value}
          marginTop="15px"
          onClick={onBuyBnbHandler}
        >
          Buy With BNB
        </Button>
      ) : (
        <Button marginTop="15px" onClick={onPresentConnectModal}>
          {TranslateString(292, 'CONNECT WALLET')}
        </Button>
      )}
    </Section>
  )
}

export default BuyTokens
