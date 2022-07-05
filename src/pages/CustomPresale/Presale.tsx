import React, { useState, useEffect, useCallback } from 'react'
import { ethers, BigNumber } from 'ethers'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Box } from '@koda-finance/summitswap-uikit'
import Modal from '@mui/material/Modal'
import fetchPresaleInfo from 'utils/fetchPresaleInfo'
import { usePresaleContract } from '../../hooks/useContract'
import { useToken } from '../../hooks/Tokens'
import { PresaleInfo, FieldProps, LoadingButtonTypes, LoadingForButton } from './types'
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

const Presale = () => {
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

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract)
      setPresaleInfo({ ...preInfo })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

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
      console.error(err)
    }
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
      console.error(err)
    }
  }

  return (
    <>
      <Modal open={isAddWhitelistModalOpen} onClose={closeAddWhitelistModalHandler}>
        <WhitelistModal
          title="Add Addresses"
          buttonText="Add Addresses"
          isLoading={isLoading}
          value={newWhitelistAddresses}
          onSubmit={addWhitelistSubmitHandler}
          onDismiss={closeAddWhitelistModalHandler}
          setWhitelistAddresses={setNewWhitelistAddresses}
        />
      </Modal>
      <Modal open={isRemoveWhitelistModalOpen} onClose={closeRemoveWhitelistModalHandler}>
        <WhitelistModal
          title="Remove Addresses"
          buttonText="Remove Addresses"
          isLoading={isLoading}
          value={removeWhitelistAddresses}
          onSubmit={removeWhitelistSubmitHandler}
          onDismiss={closeRemoveWhitelistModalHandler}
          setWhitelistAddresses={setRemoveWhitelistAddresses}
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
          {account === presaleInfo?.owner && <TokenDetails token={token} presaleInfo={presaleInfo} />}
        </BoxProgressPresale>
        <BoxPresaleDetail>
          {presaleInfo && account === presaleInfo.owner && (
            <OwnerZone
              presaleInfo={presaleInfo}
              loadingForButton={loadingForButton}
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
          <PresaleDetail token={token} presaleInfo={presaleInfo} presaleAddress={presaleAddress} />

          {account !== presaleInfo?.owner && <TokenDetails token={token} presaleInfo={presaleInfo} />}
        </BoxPresaleDetail>
      </StyledFlex>
    </>
  )
}

export default Presale
