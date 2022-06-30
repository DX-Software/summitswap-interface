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

const StyledFlex = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
  margin-top: 70px;
  width: 90%;
  max-width: 1200px;
`

const BoxProgressPresale = styled(Box)`
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
    async function getWhitelist() {
      setWhitelistAddresses(await presaleContract?.getWhitelist())
    }
    if (presaleInfo && presaleContract) getWhitelist()
  }, [presaleInfo, presaleContract])

  const formatUnits = useCallback((amount: BigNumber | undefined, decimals: number) => {
    return amount ? ethers.utils.formatUnits(amount, decimals) : ''
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
        <BoxProgressPresale>
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
        </BoxProgressPresale>
        <BoxPresaleDetail>
          {presaleInfo && account === presaleInfo.owner && (
            <OwnerZone
              presaleInfo={presaleInfo}
              loadingForButton={loadingForButton}
              account={account}
              isLoading={isLoading}
              presaleContract={presaleContract}
              newWhitelistAddresses={newWhitelistAddresses}
              removeWhitelistAddresses={removeWhitelistAddresses}
              setIsLoading={setIsLoading}
              setPresaleInfo={setPresaleInfo}
              setLoadingForButton={setLoadingForButton}
              setIsAddWhitelistModalOpen={setIsAddWhitelistModalOpen}
              setIsRemoveWhitelistModalOpen={setIsRemoveWhitelistModalOpen}
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
