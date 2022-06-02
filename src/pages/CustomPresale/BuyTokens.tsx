import React from 'react'
import { BigNumber } from 'ethers'
import { HelpCircle } from 'react-feather'
import { Text, AutoRenewIcon, Input, Progress } from '@koda-finance/summitswap-uikit'
import { RowBetween } from '../../components/Row'
import { MouseoverTooltip } from '../../components/Tooltip'
import { Card, ButtonWithMessage, MessageDiv } from './components'
import { PresaleInfo, FieldProps, PresalePhases, LoadingButtonTypes, LoadingForButton } from './types'
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from './contants'

interface Props {
  isAccountTokensClaimed: boolean // check this in this component
  isLoading: boolean
  presalePhase: PresalePhases | ''
  presaleInfo: PresaleInfo | undefined
  youBought: BigNumber | undefined
  loadingForButton: LoadingForButton
  buyBnbAmount: FieldProps
  contributors: string[] // also set contributors in this component
  buyBnbAmountChangeHandler: React.ChangeEventHandler<HTMLInputElement> | undefined
  onClaimHandler: () => Promise<void>
  onWithdrawBnbHandler: () => Promise<void>
  onBuyBnbHandler: () => Promise<void>
  formatUnits: (amount: BigNumber | undefined, decimals: number) => string
}

export default function BuyTokens({
  loadingForButton,
  isLoading,
  presalePhase,
  isAccountTokensClaimed,
  youBought,
  buyBnbAmount,
  presaleInfo,
  contributors,
  onBuyBnbHandler,
  onClaimHandler,
  onWithdrawBnbHandler,
  buyBnbAmountChangeHandler,
  formatUnits,
}: Props) {
  return (
    <Card style={{ width: '55%' }}>
      <RowBetween>
        <Text bold fontSize="14px">
          {`${formatUnits(presaleInfo?.totalBought, 18)}BNB`}
        </Text>
        <Text bold fontSize="14px">
          {`${formatUnits(presaleInfo?.hardcap, 18)}BNB`}
        </Text>
      </RowBetween>
      <Progress primaryStep={presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toNumber()} />
      {presaleInfo?.isClaimPhase && youBought?.gt(0) ? (
        isAccountTokensClaimed ? (
          <MessageDiv type={MESSAGE_SUCCESS}>Tokens Alredy Claimed</MessageDiv>
        ) : (
          presaleInfo?.isClaimPhase && (
            <ButtonWithMessage
              endIcon={
                loadingForButton.type === LoadingButtonTypes.Claim &&
                loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
              }
              msg={
                loadingForButton.type === LoadingButtonTypes.Claim
                  ? loadingForButton.isClicked
                    ? 'Claiming Tokens'
                    : loadingForButton.error
                  : ''
              }
              type={loadingForButton.error !== '' ? MESSAGE_ERROR : MESSAGE_SUCCESS}
              buttonText="Claim"
              disabled={isLoading || loadingForButton.isClicked || isAccountTokensClaimed}
              variant="awesome"
              mt="5px"
              scale="xxs"
              onClick={onClaimHandler}
            />
          )
        )
      ) : (
        presaleInfo?.totalBought.lt(presaleInfo?.hardcap) &&
        presalePhase === PresalePhases.PresalePhase && (
          <>
            <label htmlFor="hello">
              <RowBetween ml="3px" mb="5px">
                <Text bold fontSize="14px">
                  Buy Bnb Amount{' '}
                </Text>
                <MouseoverTooltip size="12px" text="message">
                  <span>
                    <HelpCircle size={18} />
                  </span>
                </MouseoverTooltip>
              </RowBetween>
              <Input
                value={buyBnbAmount.value}
                onChange={buyBnbAmountChangeHandler}
                isWarning={buyBnbAmount.error !== ''}
                type="number"
                placeholder="0.00"
              />
            </label>
            <ButtonWithMessage
              endIcon={
                buyBnbAmount.value &&
                isLoading &&
                !loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
              }
              msg={buyBnbAmount.value && isLoading ? 'Buying Tokens' : buyBnbAmount.error}
              buttonText="Buy Bnb"
              type={isLoading ? MESSAGE_SUCCESS : MESSAGE_ERROR}
              disabled={buyBnbAmount.error !== '' || isLoading || loadingForButton.isClicked || !buyBnbAmount.value}
              variant="awesome"
              mt="5px"
              scale="xxs"
              onClick={onBuyBnbHandler}
            />
          </>
        )
      )}
      {youBought?.gt(0) && !presaleInfo?.isClaimPhase && (
        <ButtonWithMessage
          endIcon={
            loadingForButton.type === LoadingButtonTypes.Claim &&
            loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
          }
          msg={
            loadingForButton.type === LoadingButtonTypes.EmergencyWithdraw ||
            loadingForButton.type === LoadingButtonTypes.Withdraw
              ? loadingForButton.isClicked
                ? 'Withdrawing Bnb'
                : loadingForButton.error
              : ''
          }
          buttonText={presaleInfo?.isPresaleCancelled ? 'Withdraw Bnb' : 'Emergency Withdraw'}
          type={loadingForButton?.error !== '' ? MESSAGE_ERROR : MESSAGE_SUCCESS}
          disabled={loadingForButton?.error !== '' || isLoading || loadingForButton?.isClicked}
          variant="tertiary"
          mt="5px"
          scale="xxs"
          onClick={onWithdrawBnbHandler}
        />
      )}
      <br />
      <RowBetween>
        <Text bold>Status</Text>
        <Text>{presalePhase}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Unsold Tokens</Text>
        <Text>
          {presaleInfo
            ? formatUnits(
                presaleInfo.presaleRate
                  .mul(presaleInfo.hardcap)
                  .sub(presaleInfo.presaleRate.mul(presaleInfo.totalBought)),
                36
              )
            : ''}
        </Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Min Buy(Bnb)</Text>
        <Text>{formatUnits(presaleInfo?.minBuyBnb, 18)}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Max Buy(Bnb)</Text>
        <Text>{formatUnits(presaleInfo?.maxBuyBnb, 18)}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>You Bought(Bnb)</Text>
        <Text>{formatUnits(youBought, 18)}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Contributors</Text>
        <Text>{contributors.length}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Total Contributors</Text>
        {/* <StyledDropdownWrapper options={['Hide  ', 'Show']} onChange={selectSaleTypeHandler} value="Hide" /> */}
      </RowBetween>
      {/* show contributors here */}
    </Card>
  )
}
