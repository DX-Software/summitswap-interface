import React, { useState, useEffect, useCallback } from 'react'
import { ethers, BigNumber } from 'ethers'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Box } from '@koda-finance/summitswap-uikit'
import Modal from '@mui/material/Modal'
import checkSalePhase from 'utils/checkSalePhase'
import { usePresaleContract } from '../../hooks/useContract'
import { useToken } from '../../hooks/Tokens'
import { PresaleInfo, FieldNames, FieldProps, LoadingButtonTypes, LoadingForButton } from './types'
import OwnerZone from './OwnerZone'
import TokenDetails from './TokenDetails'
import PresaleProgress from './PresaleProgress'
import PresaleDetail from './PresaleDetail'
import WhitelistModal from './WhitelistModal'
import { WHITELIST_SALE, PUBLIC_SALE } from '../../constants/presale'

const StyledFlex = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
  margin-top: 70px;
  width: 90%;
  max-width: 1200px;
`

const BoxBuyBNB = styled(Box)`
  width: 60%;
  margin: 0 10px;
  max-width: 630px;
  margin-bottom: 20px;
  @media (max-width: 1200px) {
    width: 100%;
    max-width: 100%;
  }
  @media (max-width: 967px) {
    width: 52%;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`

const BoxPresaleDetail = styled(Box)`
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  width: 35%;
  max-width: 400px;
  @media (max-width: 1200px) {
    max-width: 100%;
    width: 100%;
  }
  @media (max-width: 967px) {
    width: 42%;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`

export default function Presale() {
  const { account } = useWeb3React()
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>([])
  const [canPresaleBeFinalized, setCanPresaleBeFinalized] = useState(false)
  const [isAccountTokensClaimed, setIsAccountTokensClaimed] = useState(false)
  const [saleType, setSaleType] = useState(WHITELIST_SALE)
  const [isLoading, setIsLoading] = useState(false)
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [newWhitelistAddresses, setNewWhitelistAddresses] = useState<FieldProps>({ value: '', error: '' })
  const [isAddWhitelistModalOpen, setIsAddWhitelistModalOpen] = useState(false)
  const [isRemoveWhitelistModalOpen, setIsRemoveWhitelistModalOpen] = useState(false)
  const [removeWhitelistAddresses, setRemoveWhitelistAddresses] = useState<FieldProps>({ value: '', error: '' })
  const [presaleAddress, setPresaleAddress] = useState('')
  const [loadingForButton, setLoadingForButton] = useState<LoadingForButton>({
    type: LoadingButtonTypes.NotSelected,
    error: '',
    isClicked: false,
  })

  const location = useLocation()

  useEffect(() => {
    const presaleAddressUrl = new URLSearchParams(location.search).get('address')
    if (!presaleAddress && ethers.utils.isAddress(presaleAddressUrl || '')) {
      setPresaleAddress(presaleAddressUrl || '')
    }
  }, [presaleAddress, location])

  useEffect(() => {
    if (loadingForButton?.error !== '') {
      setTimeout(() => {
        setLoadingForButton((prevState) =>
          prevState
            ? {
                ...prevState,
                error: '',
              }
            : prevState
        )
      }, 3000)
    }
  }, [loadingForButton])

  const presaleContract = usePresaleContract(presaleAddress)
  const token = useToken(presaleInfo?.presaleToken)

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

  useEffect(() => {
    async function getWhitelist() {
      setWhitelistAddresses(await presaleContract?.getWhitelist())
    }
    if (presaleInfo && presaleContract) getWhitelist()
  }, [presaleInfo, presaleContract])

  useEffect(() => {
    async function fetchIsTokenClaimed() {
      setIsAccountTokensClaimed(await presaleContract?.isTokenClaimed(account))
    }
    if (presaleContract && account && presaleContract && !isAccountTokensClaimed) {
      fetchIsTokenClaimed()
    }
  }, [presaleContract, account, isAccountTokensClaimed]) // remove

  useEffect(() => {
    if (presaleInfo?.isWhitelistEnabled) {
      setSaleType(WHITELIST_SALE)
    } else {
      setSaleType(PUBLIC_SALE)
    }
  }, [presaleInfo])

  const formatUnits = useCallback((amount: BigNumber | undefined, decimals: number) => {
    return amount ? ethers.utils.formatUnits(amount, decimals) : ''
  }, [])
  const parseUnits = useCallback((amount: string | undefined, decimals: number) => {
    return amount ? ethers.utils.parseUnits(amount, decimals) : ''
  }, [])

  useEffect(() => {
    async function fetchData() {
      const owner: string = await presaleContract?.owner()
      const info = await presaleContract?.getInfo()
      const obKeys = [
        FieldNames.presaleToken,
        FieldNames.router,
        FieldNames.presaleRate,
        FieldNames.listingRate,
        FieldNames.liquidyLockTimeInMins,
        FieldNames.minBuyBnb,
        FieldNames.maxBuyBnb,
        FieldNames.softcap,
        FieldNames.hardcap,
        FieldNames.liquidity,
        FieldNames.startPresaleTime,
        FieldNames.endPresaleTime,
        FieldNames.totalBought,
        FieldNames.feeType,
        FieldNames.refundType,
        FieldNames.isWhitelistEnabled,
        FieldNames.isClaimPhase,
        FieldNames.isPresaleCancelled,
        FieldNames.isWithdrawCancelledTokens,
      ]
      const preInfo: PresaleInfo = info.reduce(
        (acc: any, cur: string | BigNumber | number | boolean, i: number) => {
          acc[obKeys[i]] = cur
          return acc
        },
        { owner }
      )
      setPresaleInfo({ ...preInfo })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

  const addWhitelistAddressesChangeHanlder = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let error = ''
    if (e.target.value) {
      if (
        !e.target.value.split(',').every((val) => {
          return ethers.utils.isAddress(val.trim())
        })
      ) {
        error = 'Not valid addresses'
      }
    }
    setNewWhitelistAddresses({
      value: e.target.value,
      error,
    })
  }

  const closeAddWhitelistModalHandler = (_, reason) => {
    if (reason !== 'backdropClick') {
      setIsAddWhitelistModalOpen(false)
      setNewWhitelistAddresses((prevState) => (isLoading ? { ...prevState } : { error: '', value: '' }))
    }
  }

  const addWhitelistSubmitHandler = async () => {
    const list = newWhitelistAddresses.value.split(',').map((address) => {
      return address.trim()
    })
    if (!presaleContract || !list.length || presaleInfo?.owner !== account) {
      return
    }
    try {
      setIsLoading(true)
      const result = await presaleContract.addWhiteList(list)
      await result.wait()
      setWhitelistAddresses(await presaleContract.getWhitelist())
      setNewWhitelistAddresses({ value: '', error: '' })
      setIsLoading(false)
      closeAddWhitelistModalHandler('', 'Close Modal')
    } catch (err) {
      setIsLoading(false)
      setNewWhitelistAddresses((prev) => ({ ...prev, error: 'Adding Whitlist Failed' }))
      console.log(err)
    }
  }

  const removeWhitelistAddressesChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let error = ''
    if (e.target.value) {
      if (
        !e.target.value.split(',').every((val) => {
          return ethers.utils.isAddress(val.trim())
        })
      ) {
        error = 'Not valid addresses'
      }
    }
    setRemoveWhitelistAddresses({ value: e.target.value, error })
  }

  const closeRemoveWhitelistModalHandler = (_, reason) => {
    if (reason !== 'backdropClick') {
      setIsRemoveWhitelistModalOpen(false)
      setRemoveWhitelistAddresses((prevState) => (isLoading ? { ...prevState } : { error: '', value: '' }))
    }
  }

  const removeWhitelistSubmitHandler = async () => {
    const list = removeWhitelistAddresses.value.split(',').map((address) => {
      return address.trim()
    })
    if (!presaleContract || !list.length || presaleInfo?.owner !== account) {
      return
    }
    try {
      setIsLoading(true)
      const result = await presaleContract.removeWhiteList(list)
      await result.wait()
      setWhitelistAddresses(await presaleContract.getWhitelist())
      setRemoveWhitelistAddresses({ value: '', error: '' })
      closeRemoveWhitelistModalHandler('', 'Close Modal')
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setRemoveWhitelistAddresses((prev) => ({ ...prev, error: 'Removing Whitlist Failed' }))
      console.log(err)
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
      console.log(err)
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
      console.log(err)
    }
  }

  const selectSaleTypeHandler = async (option) => {
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
      console.log(err)
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
      console.log(err)
    }
  } // remove

  return (
    <>
      <Modal open={isAddWhitelistModalOpen} onClose={closeAddWhitelistModalHandler}>
        <WhitelistModal
          isLoading={isLoading}
          value={newWhitelistAddresses}
          onSubmit={addWhitelistSubmitHandler}
          onDismiss={closeAddWhitelistModalHandler}
          title="Add Addresses"
          onChangeHandler={addWhitelistAddressesChangeHanlder}
          buttonText="Add Addresses"
        />
      </Modal>
      <Modal open={isRemoveWhitelistModalOpen} onClose={closeRemoveWhitelistModalHandler}>
        <WhitelistModal
          isLoading={isLoading}
          value={removeWhitelistAddresses}
          onSubmit={removeWhitelistSubmitHandler}
          onDismiss={closeRemoveWhitelistModalHandler}
          title="Remove Addresses"
          onChangeHandler={removeWhitelistAddressesChangeHandler}
          buttonText="Remove Addresses"
        />
      </Modal>
      <StyledFlex>
        <BoxBuyBNB>
          <PresaleProgress
            token={token}
            isLoading={isLoading}
            presaleInfo={presaleInfo}
            presaleContract={presaleContract}
            loadingForButton={loadingForButton}
            whitelistAddresses={whitelistAddresses}
            setIsLoading={setIsLoading}
            setPresaleInfo={setPresaleInfo}
            setLoadingForButton={setLoadingForButton}
          />
          {account === presaleInfo?.owner && (
            <TokenDetails formatUnits={formatUnits} token={token} presaleInfo={presaleInfo} />
          )}
        </BoxBuyBNB>
        <BoxPresaleDetail>
          {presaleInfo && account === presaleInfo.owner && (
            <OwnerZone
              presaleInfo={presaleInfo}
              loadingForButton={loadingForButton}
              saleType={saleType}
              isLoading={isLoading}
              newWhitelistAddresses={newWhitelistAddresses}
              removeWhitelistAddresses={removeWhitelistAddresses}
              canPresaleBeFinalized={canPresaleBeFinalized}
              selectSaleTypeHandler={selectSaleTypeHandler}
              onPresaleFinalizeHandler={onPresaleFinalizeHandler}
              setIsAddWhitelistModalOpen={setIsAddWhitelistModalOpen}
              onWithdrawCancelledTokenHandler={onWithdrawCancelledTokenHandler}
              setIsRemoveWhitelistModalOpen={setIsRemoveWhitelistModalOpen}
              onPresaleCancelHandler={onPresaleCancelHandler}
            />
          )}
          <PresaleDetail
            presalePhase={checkSalePhase(presaleInfo)}
            token={token}
            presaleInfo={presaleInfo}
            presaleAddress={presaleAddress}
            formatUnits={formatUnits}
          />

          {account !== presaleInfo?.owner && (
            <TokenDetails formatUnits={formatUnits} token={token} presaleInfo={presaleInfo} />
          )}
        </BoxPresaleDetail>
      </StyledFlex>
    </>
  )
}
