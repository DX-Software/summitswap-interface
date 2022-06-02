import React from 'react'
import { Option } from 'react-dropdown'
import { Text, Box, AutoRenewIcon } from '@koda-finance/summitswap-uikit'
import { PresaleInfo, LoadingForButton, LoadingButtonTypes, FieldProps } from './types'
import { RowBetween } from '../../components/Row'
import { StyledDropdownWrapper, Card, MessageDiv, ButtonWithMessage } from './components'
import { MESSAGE_ERROR, MESSAGE_SUCCESS, WHITELIST_SALE, PUBLIC_SALE } from './contants'

interface Props {
  presaleInfo: PresaleInfo
  loadingForButton: LoadingForButton
  saleType: Option
  isLoading: boolean
  canPresaleBeFinalized: boolean
  newWhitelistAddresses: FieldProps
  removeWhitelistAddresses: FieldProps
  setIsAddWhitelistModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsRemoveWhitelistModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectSaleTypeHandler: (option: Option) => Promise<void>
  onPresaleFinalizeHandler: () => Promise<void>
  onWithdrawCancelledTokenHandler: () => Promise<void>
  onPresaleCancelHandler: () => Promise<void>
}

export default function OwnerZone({
  presaleInfo,
  loadingForButton,
  saleType,
  isLoading,
  newWhitelistAddresses,
  removeWhitelistAddresses,
  canPresaleBeFinalized,
  selectSaleTypeHandler,
  onPresaleFinalizeHandler,
  setIsAddWhitelistModalOpen,
  onWithdrawCancelledTokenHandler,
  setIsRemoveWhitelistModalOpen,
  onPresaleCancelHandler,
}: Props) {
  return (
    <Box width="50%">
      <Text bold fontSize="20px" ml="10px" mb="5px">
        Owner Zone
      </Text>
      <Card style={{ width: '100%' }}>
        <RowBetween>
          <Text bold>Sale Type </Text>
          <StyledDropdownWrapper
            disabled={loadingForButton.isClicked}
            value={saleType}
            options={[WHITELIST_SALE, PUBLIC_SALE]}
            onChange={selectSaleTypeHandler}
          />
        </RowBetween>
        <MessageDiv type={loadingForButton.error !== '' ? MESSAGE_ERROR : MESSAGE_SUCCESS}>
          {loadingForButton.type === LoadingButtonTypes.ChangeSaleType
            ? loadingForButton.isClicked
              ? 'Changing Sale Type'
              : loadingForButton.error
            : ''}
        </MessageDiv>
        {presaleInfo?.isWhitelistEnabled && (
          <>
            <Text bold>Whitelist Actions </Text>
            <ButtonWithMessage
              endIcon={
                newWhitelistAddresses.value &&
                isLoading &&
                !loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
              }
              msg={newWhitelistAddresses.value && isLoading ? 'Adding Addresses' : newWhitelistAddresses.error}
              buttonText="Add Addresses"
              type={isLoading ? MESSAGE_SUCCESS : MESSAGE_ERROR}
              variant="awesome"
              mt="5px"
              scale="xxs"
              onClick={() => setIsAddWhitelistModalOpen(true)}
            />
            <ButtonWithMessage
              endIcon={
                removeWhitelistAddresses.value &&
                isLoading &&
                !loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
              }
              msg={removeWhitelistAddresses.value && isLoading ? 'Removing Addresses' : removeWhitelistAddresses.error}
              buttonText="Remove Addresses"
              type={isLoading ? MESSAGE_SUCCESS : MESSAGE_ERROR}
              variant="awesome"
              mt="5px"
              scale="xxs"
              onClick={() => setIsRemoveWhitelistModalOpen(true)}
            />
          </>
        )}
        <Text bold>Pool Actions </Text>
        <RowBetween>
          <ButtonWithMessage
            endIcon={
              loadingForButton.type === LoadingButtonTypes.Finalize &&
              loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
            }
            msg={
              loadingForButton.type === LoadingButtonTypes.Finalize
                ? loadingForButton.isClicked
                  ? 'Finalizing Presale'
                  : loadingForButton.error
                : ''
            }
            buttonText="Finalize"
            type={loadingForButton.error !== '' ? MESSAGE_ERROR : MESSAGE_SUCCESS}
            disabled={
              !canPresaleBeFinalized ||
              presaleInfo?.isClaimPhase ||
              isLoading ||
              loadingForButton.isClicked ||
              presaleInfo?.isPresaleCancelled
            }
            variant="awesome"
            mt="10px"
            scale="xxs"
            onClick={onPresaleFinalizeHandler}
          />
          {presaleInfo?.isPresaleCancelled ? (
            <ButtonWithMessage
              endIcon={
                loadingForButton.type === LoadingButtonTypes.WithdrawCancelledTokens &&
                loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
              }
              msg={
                loadingForButton.type === LoadingButtonTypes.WithdrawCancelledTokens
                  ? loadingForButton.isClicked
                    ? 'Wirhdraing Tokens'
                    : loadingForButton.error
                  : ''
              }
              buttonText="Withdraw Cancelled Tokens"
              type={loadingForButton.error !== '' ? MESSAGE_ERROR : MESSAGE_SUCCESS}
              disabled={isLoading || loadingForButton.isClicked || presaleInfo.isWithdrawCancelledTokens}
              variant="awesome"
              mt="10px"
              scale="xxs"
              onClick={onWithdrawCancelledTokenHandler}
            />
          ) : (
            <ButtonWithMessage
              endIcon={
                loadingForButton.type === LoadingButtonTypes.CancelPool &&
                loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
              }
              msg={
                loadingForButton.type === LoadingButtonTypes.CancelPool
                  ? loadingForButton.isClicked
                    ? 'Cancelling Presale'
                    : loadingForButton.error
                  : ''
              }
              buttonText="Cancel"
              type={loadingForButton?.error !== '' ? MESSAGE_ERROR : MESSAGE_SUCCESS}
              disabled={
                presaleInfo?.isClaimPhase || presaleInfo?.isPresaleCancelled || isLoading || loadingForButton.isClicked
              }
              variant="text"
              ml="10px"
              scale="xxs"
              onClick={onPresaleCancelHandler}
            />
          )}
        </RowBetween>
      </Card>
    </Box>
  )
}
