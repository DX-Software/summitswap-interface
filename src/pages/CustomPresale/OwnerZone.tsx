import React from 'react'
import { Option } from 'react-dropdown'
import styled from 'styled-components'
import { Box, AutoRenewIcon, Button } from '@koda-finance/summitswap-uikit'
import { RowBetween } from '../../components/Row'
import DropdownWrapper from '../../components/DropdownWrapper'
import MessageDiv from '../../components/MessageDiv'
import { MESSAGE_ERROR, MESSAGE_SUCCESS, WHITELIST_SALE, PUBLIC_SALE } from '../../constants/presale'
import { PresaleInfo, LoadingForButton, LoadingButtonTypes, FieldProps } from './types'
import { TextHeading, TextSubHeading } from './BuyTokens'

export const StyledDropdownWrapper = styled(DropdownWrapper)`
  width: 120px;
`

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

const RemoveAddressButton = styled(Button)`
  background: #011724;
  border: 2px solid #0fd6a9;
  border-radius: 50px;
  height: 36px;
  box-shadow: 0 0;
  &:disabled {
    background: #011724;
    border: 2px solid #0fd6a9;
    opacity: 0.6;
  }
`

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
    <Box marginBottom="30px" padding="25px" width="100%" borderRadius="20px" background="#011724">
      <RowBetween>
        <TextHeading>
          Sale Type{' '}
          <MessageDiv type={loadingForButton.error !== '' ? MESSAGE_ERROR : MESSAGE_SUCCESS}>
            {loadingForButton.type === LoadingButtonTypes.ChangeSaleType
              ? loadingForButton.isClicked
                ? 'Changing Sale Type.'
                : loadingForButton.error
              : ''}
          </MessageDiv>
        </TextHeading>
        <StyledDropdownWrapper
          disabled={loadingForButton.isClicked}
          value={saleType}
          options={[WHITELIST_SALE, PUBLIC_SALE]}
          onChange={selectSaleTypeHandler}
        />
      </RowBetween>
      <TextSubHeading marginTop="30px">Whitelist actions :</TextSubHeading>
      <Button
        endIcon={
          newWhitelistAddresses.value &&
          isLoading &&
          !loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
        }
        disabled={!presaleInfo.isWhitelistEnabled || !!removeWhitelistAddresses.value}
        onClick={() => setIsAddWhitelistModalOpen(true)}
        style={{ boxShadow: '0 0' }}
        height="36px"
        marginTop="15px"
        scale="sm"
      >
        Add address
      </Button>
      <br />
      <RemoveAddressButton
        endIcon={
          removeWhitelistAddresses.value &&
          isLoading &&
          !loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
        }
        disabled={!presaleInfo.isWhitelistEnabled || !!newWhitelistAddresses.value}
        onClick={() => setIsRemoveWhitelistModalOpen(true)}
        marginTop="15px"
        scale="sm"
      >
        Remove address
      </RemoveAddressButton>
      <MessageDiv marginTop="10px" type={MESSAGE_ERROR}>
        {removeWhitelistAddresses.error ? removeWhitelistAddresses.error : newWhitelistAddresses.error}
      </MessageDiv>

      <TextSubHeading marginTop="10px">Pool actions :</TextSubHeading>
      <Button
        endIcon={
          loadingForButton.type === LoadingButtonTypes.Finalize &&
          loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
        }
        disabled={
          !canPresaleBeFinalized ||
          !!loadingForButton.error ||
          presaleInfo?.isClaimPhase ||
          isLoading ||
          loadingForButton.isClicked ||
          presaleInfo?.isPresaleCancelled
        }
        onClick={onPresaleFinalizeHandler}
        height="36px"
        variant="awesome"
        marginTop="15px"
        scale="sm"
      >
        Finalize
      </Button>
      <br />
      {presaleInfo?.isPresaleCancelled ? (
        <Button
          disabled={
            !!loadingForButton.error || isLoading || loadingForButton.isClicked || presaleInfo.isWithdrawCancelledTokens
          }
          endIcon={
            loadingForButton.type === LoadingButtonTypes.WithdrawCancelledTokens &&
            loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
          }
          height="36px"
          variant="danger"
          marginTop="15px"
          scale="sm"
          onClick={onWithdrawCancelledTokenHandler}
        >
          Withdraw Cancelled Tokens
        </Button>
      ) : (
        <Button
          endIcon={
            loadingForButton.type === LoadingButtonTypes.CancelPool &&
            loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
          }
          disabled={
            !!loadingForButton.error ||
            presaleInfo?.isClaimPhase ||
            presaleInfo?.isPresaleCancelled ||
            isLoading ||
            loadingForButton.isClicked
          }
          height="36px"
          variant="danger"
          marginTop="15px"
          scale="sm"
          onClick={onPresaleCancelHandler}
        >
          Cancel
        </Button>
      )}
      <MessageDiv marginTop="10px" type={MESSAGE_ERROR}>
        {(loadingForButton.type === LoadingButtonTypes.Finalize ||
          loadingForButton.type === LoadingButtonTypes.CancelPool ||
          loadingForButton.type === LoadingButtonTypes.WithdrawCancelledTokens) &&
          loadingForButton.error}
      </MessageDiv>
    </Box>
  )
}
