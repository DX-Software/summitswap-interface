import React, { useState, useEffect } from 'react'
import { Option } from 'react-dropdown'
import { Contract } from 'ethers'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Box, AutoRenewIcon, Button } from '@koda-finance/summitswap-uikit'
import { RowBetween } from '../../components/Row'
import DropdownWrapper from '../../components/DropdownWrapper'
import MessageDiv from '../../components/MessageDiv'
import { MESSAGE_ERROR, MESSAGE_SUCCESS, WHITELIST_SALE, PUBLIC_SALE } from '../../constants/presale'
import { PresaleInfo, LoadingForButton, LoadingButtonTypes, FieldProps } from './types'
import { TextHeading, TextSubHeading } from './StyledTexts'

export const StyledDropdownWrapper = styled(DropdownWrapper)`
  width: 120px;
`

interface Props {
  presaleInfo: PresaleInfo
  loadingForButton: LoadingForButton
  isLoading: boolean
  newWhitelistAddresses: FieldProps
  removeWhitelistAddresses: FieldProps
  presaleContract: Contract | null
  setPresaleInfo: React.Dispatch<React.SetStateAction<PresaleInfo | undefined>>
  setLoadingForButton: React.Dispatch<React.SetStateAction<LoadingForButton>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setIsAddWhitelistModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsRemoveWhitelistModalOpen: React.Dispatch<React.SetStateAction<boolean>>
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

const OwnerZone = ({
  presaleInfo,
  loadingForButton,
  isLoading,
  newWhitelistAddresses,
  removeWhitelistAddresses,
  presaleContract,
  setIsLoading,
  setPresaleInfo,
  setLoadingForButton,
  setIsAddWhitelistModalOpen,
  setIsRemoveWhitelistModalOpen,
}: Props) => {
  const { account } = useWeb3React()

  const [saleType, setSaleType] = useState(WHITELIST_SALE)
  const [canPresaleBeFinalized, setCanPresaleBeFinalized] = useState(false)

  useEffect(() => {
    if (presaleInfo?.isWhitelistEnabled) {
      setSaleType(WHITELIST_SALE)
    } else {
      setSaleType(PUBLIC_SALE)
    }
  }, [presaleInfo])

  useEffect(() => {
    if (presaleInfo && account && !canPresaleBeFinalized) {
      if (
        !presaleInfo.isPresaleCancelled &&
        (presaleInfo.hardcap.eq(presaleInfo.totalBought) ||
          (presaleInfo.totalBought.gte(presaleInfo.softcap) && presaleInfo.endPresaleTime.mul(1000).lt(Date.now())))
      ) {
        setCanPresaleBeFinalized(true)
      }
    }
  }, [presaleInfo, account, canPresaleBeFinalized])

  const selectSaleTypeHandler = async (option: Option) => {
    if (presaleInfo?.owner !== account || !presaleContract) {
      return
    }
    const type = option.value
    try {
      setIsLoading(true)
      setLoadingForButton({
        type: LoadingButtonTypes.ChangeSaleType,
        isClicked: true,
        error: '',
      })
      const result = await presaleContract.toggleWhitelistPhase()
      await result.wait()
      setIsLoading(false)
      setSaleType({ value: type, label: type })
      setPresaleInfo((prevState) =>
        prevState ? { ...prevState, isWhitelistEnabled: type === WHITELIST_SALE.value } : prevState
      )
      setLoadingForButton({
        type: LoadingButtonTypes.NotSelected,
        isClicked: false,
        error: '',
      })
    } catch (err) {
      setSaleType((prevState) => ({
        ...prevState,
      }))

      setIsLoading(false)
      setLoadingForButton({
        type: LoadingButtonTypes.ChangeSaleType,
        isClicked: false,
        error: 'Changing Sale Type Failed.',
      })
      console.error(err)
    }
  }

  const onPresaleCancelHandler = async () => {
    if (!presaleContract || presaleInfo?.owner !== account) {
      return
    }
    try {
      setIsLoading(true)
      setLoadingForButton({
        isClicked: true,
        type: LoadingButtonTypes.CancelPool,
        error: '',
      })
      const result = await presaleContract.cancelPresale()
      await result.wait()

      setPresaleInfo((prevState) =>
        prevState ? { ...prevState, isPresaleCancelled: true, isClaimPhase: false } : prevState
      )
      setLoadingForButton({
        isClicked: false,
        type: LoadingButtonTypes.NotSelected,
        error: '',
      })
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setLoadingForButton({
        isClicked: false,
        type: LoadingButtonTypes.CancelPool,
        error: 'Cancelling Failed.',
      })
      console.error(err)
    }
  }

  const onWithdrawCancelledTokenHandler = async () => {
    if (presaleInfo?.owner !== account || !presaleContract) {
      return
    }
    try {
      setIsLoading(true)
      setLoadingForButton({
        isClicked: true,
        type: LoadingButtonTypes.WithdrawCancelledTokens,
        error: '',
      })
      const result = await presaleContract.withdrawCancelledTokens()
      await result.wait()
      setPresaleInfo((prevState) => (prevState ? { ...prevState, isWithdrawCancelledTokens: true } : prevState))
      setLoadingForButton({
        isClicked: false,
        type: LoadingButtonTypes.NotSelected,
        error: '',
      })
      setIsLoading(true)
    } catch (err) {
      setLoadingForButton({
        isClicked: false,
        type: LoadingButtonTypes.WithdrawCancelledTokens,
        error: 'Withdrawal Failed.',
      })
      setIsLoading(false)
      console.error(err)
    }
  }

  const onPresaleFinalizeHandler = async () => {
    if (!presaleContract || presaleInfo?.owner !== account || !canPresaleBeFinalized) {
      return
    }
    try {
      setIsLoading(true)
      setLoadingForButton({
        type: LoadingButtonTypes.Finalize,
        isClicked: true,
        error: '',
      })
      const result = await presaleContract.finalize()
      await result.wait()

      setPresaleInfo((prevState) =>
        prevState
          ? {
              ...prevState,
              isClaimPhase: true,
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
        type: LoadingButtonTypes.Finalize,
        isClicked: false,
        error: 'Finalizing Presale Failed.',
      })
      console.error(err)
    }
  }

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
          onChange={(option: Option) => option.value !== saleType.value && selectSaleTypeHandler(option)}
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

export default OwnerZone
