import React, { useState, useEffect, useCallback } from 'react'
import { ethers, BigNumber } from 'ethers'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import Modal from '@mui/material/Modal'
import { usePresaleContract } from '../../hooks/useContract'
import { useToken } from '../../hooks/Tokens'
import { PresaleInfo, PresalePhases, FieldNames, FieldProps, LoadingButtonTypes, LoadingForButton } from './types'
import { RowBetween } from '../../components/Row'

import OwnerZone from './OwnerZone'
import PresaleDashboard from './PresaleDashboard'
import BuyTokens from './BuyTokens'
import { WhitelistModal } from './components'
import { WHITELIST_SALE, PUBLIC_SALE } from './contants'

export default function Presale() {
  const { account } = useWeb3React()
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>([])
  const [contributors, setContributors] = useState<string[]>([])
  const [iseAccountWhitelisted, setIsAccountWhitelisted] = useState(false)
  const [isPresalePhase, setIsPresalePhase] = useState(false)
  const [youBought, setYouBought] = useState<BigNumber>()
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [presaleCountDown, setPresaleCountDown] = useState<BigNumber>() // TODO:: May be used in the design proved by vincent
  const [canPresaleBeFinalized, setCanPresaleBeFinalized] = useState(false)
  const [isAccountTokensClaimed, setIsAccountTokensClaimed] = useState(false)
  const [saleType, setSaleType] = useState(WHITELIST_SALE)
  const [buyBnbAmount, setBuyBnbAmount] = useState<FieldProps>({ value: '', error: '' })
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
    if (!presaleAddress && ethers.utils.isAddress(location.pathname.substring(9))) {
      setPresaleAddress(location.pathname.substring(9))
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
  const token = useToken(presaleInfo?.presaleToken) // TODO:: will be used later in vincent design

  useEffect(() => {
    if (whitelistAddresses && account) {
      setIsAccountWhitelisted(whitelistAddresses.includes(account))
    }
  }, [whitelistAddresses, account])

  const checkPhase = useCallback(() => {
    if (presaleInfo) {
      if (presaleInfo.isPresaleCancelled) {
        return PresalePhases.PresaleCancelled
      }
      if (presaleInfo.isClaimPhase) {
        return PresalePhases.ClaimPhase
      }
      if (presaleInfo.startPresaleTime.mul(1000).lt(BigNumber.from(Date.now()))) {
        if (presaleInfo.endPresaleTime.mul(1000).gt(BigNumber.from(Date.now()))) {
          return PresalePhases.PresalePhase
        }
        return PresalePhases.PresaleEnded
      }
      return PresalePhases.PresaleNotStarted
    }
    return ''
  }, [presaleInfo])

  useEffect(() => {
    if (checkPhase() === PresalePhases.PresaleNotStarted) {
      const timer = setTimeout(() => {
        if (presaleInfo) {
          const presaleStartTime = presaleInfo.startPresaleTime.mul(1000)
          if (presaleStartTime.lt(BigNumber.from(currentTime))) {
            setIsPresalePhase(true)
          }
          setPresaleCountDown(presaleStartTime.sub(currentTime).div(1000))
          setCurrentTime(Date.now())
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [presaleInfo, isPresalePhase, currentTime, checkPhase])

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
    async function getContributorsnWhitelist() {
      setContributors(await presaleContract?.showContributors())
      setWhitelistAddresses(await presaleContract?.getWhitelist())
    }
    if (presaleInfo && presaleContract) getContributorsnWhitelist()
  }, [presaleInfo, presaleContract])

  useEffect(() => {
    async function fetchIsTokenClaimed() {
      setIsAccountTokensClaimed(await presaleContract?.isTokenClaimed(account))
    }
    if (presaleContract && account && presaleContract && !isAccountTokensClaimed) {
      fetchIsTokenClaimed()
    }
  }, [presaleContract, account, isAccountTokensClaimed])

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
        (acc: any, cur: string | BigNumber | boolean, i: number) => {
          acc[obKeys[i]] = cur
          return acc
        },
        { owner }
      )
      setPresaleInfo({ ...preInfo })

      setYouBought(await presaleContract?.bought(account))
    }
    if (presaleContract && account) {
      fetchData()
    }
  }, [presaleContract, account])

  const isValidAdd = (add: string) => ethers.utils.isAddress(add.trim())

  const addWhitelistAddressesChangeHanlder = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let error = ''
    if (e.target.value) {
      if (!e.target.value.split(',').every(isValidAdd)) {
        error = 'Not valid addresses'
      }
    }
    setNewWhitelistAddresses({
      value: e.target.value,
      error,
    })
  }
  const addWhitelistSubmitHandler = async () => {
    const list = newWhitelistAddresses.value.split(',').map((address) => {
      // use this to check address ethers.utils.isAddress(e.target.value)
      return address.trim()
    })
    if (!presaleContract || !list.length || !account) {
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

  const closeAddWhitelistModalHandler = (_, reason) => {
    if (reason !== 'backdropClick') {
      setIsAddWhitelistModalOpen(false)
      setNewWhitelistAddresses((prevState) => (isLoading ? { ...prevState } : { error: '', value: '' }))
    }
  }

  const removeWhitelistAddressesChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let error = ''
    if (e.target.value) {
      if (!e.target.value.split(',').every(isValidAdd)) {
        error = 'Not valid addresses'
      }
    }
    setRemoveWhitelistAddresses({ value: e.target.value, error })
  }

  const removeWhitelistSubmitHandler = async () => {
    const list = removeWhitelistAddresses.value.split(',').map((address) => {
      return address.trim()
    })
    if (!presaleContract || !list.length || !account) {
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

  const closeRemoveWhitelistModalHandler = (_, reason) => {
    if (reason !== 'backdropClick') {
      setIsRemoveWhitelistModalOpen(false)
      setRemoveWhitelistAddresses((prevState) => (isLoading ? { ...prevState } : { error: '', value: '' }))
    }
  }

  const buyBnbAmountChangeHandler = (e: any) => {
    let error = ''
    const bigAmount = BigNumber.from(e.target.value ? parseUnits(e.target.value, 18) : '0')
    if (!bigAmount.isZero()) {
      if (bigAmount.lt(0)) {
        error = 'Buy Bnb Amount should be a positive number'
      } else if (presaleInfo && bigAmount.add(presaleInfo.totalBought).gt(presaleInfo.hardcap)) {
        error = 'Buy Bnb Amount should be less than hardcap'
      } else if (youBought && presaleInfo && bigAmount.add(youBought).gt(presaleInfo.maxBuyBnb)) {
        error = 'Buy Bnb amount should be less max bnb amount'
      } else if (presaleInfo && bigAmount.lt(presaleInfo.minBuyBnb)) {
        error = 'Buy Bnb amount should be greater min bnb amount'
      }
    }
    setBuyBnbAmount({ value: e.target.value, error })
  }

  const onBuyBnbHandler = async () => {
    const bnbVal = parseUnits(buyBnbAmount.value, 18)
    if (!presaleContract || !account || !(presaleInfo && (!presaleInfo.isWhitelistEnabled || iseAccountWhitelisted))) {
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
    } catch (e) {
      setIsLoading(false)
      setBuyBnbAmount((prevState) => ({ ...prevState, error: 'Buying Failed' }))
      console.log(e)
    }
  }
  // add Is Loading
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
      const result = await presaleContract[presaleInfo?.isPresaleCancelled ? 'widhrawBnb' : 'emergencyWithdraw']()
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
    } catch (e) {
      setIsLoading(false)
      setLoadingForButton({
        type: LoadingButtonTypes.Withdraw,
        isClicked: false,
        error: 'Withdrawl Failed.',
      })
      console.log(e)
    }
  }

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
      const result = await presaleContract.enablewhitelist(type === WHITELIST_SALE.value)
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
        error: 'Withdrawl Failed.',
      })
      setIsLoading(true)

      console.log(err)
    }
  }

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
      <RowBetween style={{ width: '90%' }}>
        {account && (
          <BuyTokens
            loadingForButton={loadingForButton}
            isLoading={isLoading}
            presalePhase={checkPhase()}
            isAccountTokensClaimed={isAccountTokensClaimed}
            youBought={youBought}
            buyBnbAmount={buyBnbAmount}
            presaleInfo={presaleInfo}
            contributors={contributors}
            onBuyBnbHandler={onBuyBnbHandler}
            onClaimHandler={onClaimHandler}
            onWithdrawBnbHandler={onWithdrawBnbHandler}
            buyBnbAmountChangeHandler={buyBnbAmountChangeHandler}
            formatUnits={formatUnits}
          />
        )}
        {account && account === presaleInfo?.owner && (
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
      </RowBetween>
      <PresaleDashboard
        presaleInfo={presaleInfo}
        presaleAddress={presaleAddress}
        whitelistAddresses={whitelistAddresses}
        formatUnits={formatUnits}
      />
    </>
  )
}
