/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Pagination, Modal } from '@mui/material'
import {
  AutoRenewIcon,
  Box,
  Button,
  Flex,
  useModal,
  Radio,
  AddIcon,
  TrashIcon,
  CloseIcon,
  FileIcon,
} from '@koda-finance/summitswap-uikit'
import { isAddress } from 'utils'
import { usePresaleContract } from 'hooks/useContract'
import { RowFixed } from 'components/Row'
import { RADIO_VALUES, ADDRESS_PER_PAGE, HEADERS_WHITELIST } from 'constants/presale'
import { PresaleInfo, FieldNames, FieldProps, LoadingForButton, LoadingButtonTypes } from '../types'
import { StyledText, usePaginationStyles } from './Shared'
import RemoveWhitelistModal from './RemoveWhitelistModal'
import AddWhitelistModal, { InputCSV, LabelCSV } from './AddWhitelistModal'
import ViewAddressesModal from './ViewAddressesModal'

interface Props {
  presaleAddress: string
  isMainLoading: boolean
  presaleInfo: PresaleInfo | undefined
  whitelistAddresses: string[]
  setIsMainLoading: React.Dispatch<React.SetStateAction<boolean>>
  setPresaleInfo: React.Dispatch<React.SetStateAction<PresaleInfo | undefined>>
  setWhitelistAddresses: React.Dispatch<React.SetStateAction<string[]>>
}

export const PlaceHolderParticipants = styled.div`
  width: 4px;
  height: 24px;
  background: ${({ theme }) => theme.colors.primaryDark};
  margin-right: 8px;
`

export const AddressBox = styled(Flex)`
  align-items: center;
  padding: 8px 8px 8px 12px;
  height: 45px;
  background: ${({ theme }) => theme.colors.inputColor};
  margin-bottom: 8px;
`

export const WhitelistRadio = styled(Radio)`
  flex-shrink: 0;
  height: 18px;
  width: 18px;
  &:after {
    flex-shrink: 0;
    left: 4.5px;
    top: 4.5px;
    height: 9px;
    width: 9px;
  }
`

const WhitelistSection = ({
  setIsMainLoading,
  presaleAddress,
  setPresaleInfo,
  isMainLoading,
  presaleInfo,
  whitelistAddresses,
  setWhitelistAddresses,
}: Props) => {
  const { account } = useWeb3React()

  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([])
  const [isAccountOwner, setIsAccountOwner] = useState(false)
  const [whitelistPage, setWhitelistPage] = useState(1)
  const [csvFileData, setCsvFileData] = useState<any>()
  const [isLoadingButton, setIsLoadingButton] = useState<LoadingForButton>({
    type: LoadingButtonTypes.NotSelected,
    error: '',
    isClicked: false,
  })
  const [isWhitelistModalOpen, setIsWhitelistModalOpen] = useState(false)
  const [newWhitelist, setNewWhitelist] = useState<FieldProps>({ value: '', error: '' })

  const presaleContract = usePresaleContract(presaleAddress)

  useEffect(() => {
    if (isLoadingButton?.error !== '') {
      setTimeout(() => {
        setIsLoadingButton((prevState) => ({ ...prevState, error: '' }))
      }, 3000)
    }
  }, [isLoadingButton])

  useEffect(() => {
    if (presaleInfo?.owner === account) {
      setIsAccountOwner(true)
    } else {
      setIsAccountOwner(false)
    }
  }, [presaleInfo, account])

  const selectAddressHandler = (address: string) => {
    if (selectedAddresses.includes(address)) {
      setSelectedAddresses((prevAddresses) => prevAddresses.filter((add) => add !== address))
    } else {
      setSelectedAddresses((prevAddresses) => [...prevAddresses, address])
    }
  }

  const closeRemoveWhitelistHandler = () => {
    closeRemoveWhitelistModal()
  }

  const removeWhitelistHandler = async () => {
    if (!presaleContract || !selectedAddresses.length || presaleInfo?.owner !== account) {
      return
    }
    try {
      setIsMainLoading(true)
      setIsLoadingButton({ type: LoadingButtonTypes.RemoveWhitelist, error: '', isClicked: true })
      const result = await presaleContract.removeWhiteList(selectedAddresses)
      closeRemoveWhitelistModal()
      await result.wait()
      setWhitelistAddresses(await presaleContract.getWhitelist())
      setNewWhitelist({ value: '', error: '' })
      setIsMainLoading(false)
      setIsLoadingButton({ type: LoadingButtonTypes.NotSelected, error: '', isClicked: false })
    } catch (err) {
      closeRemoveWhitelistModal()
      setIsMainLoading(false)
      setIsLoadingButton({
        type: LoadingButtonTypes.RemoveWhitelist,
        error: 'Removing Whitelist Failed',
        isClicked: false,
      })
      console.error(err)
    }
  }

  const [openRemoveWhitelistModal, closeRemoveWhitelistModal] = useModal(
    <RemoveWhitelistModal
      title={
        whitelistAddresses.length === selectedAddresses.length ? 'Remove All Whitelist' : 'Remove Selected Whitelist'
      }
      selectedNumber={selectedAddresses.length}
      onDismiss={closeRemoveWhitelistHandler}
      removeWhitelistHandler={removeWhitelistHandler}
    />
  )

  const data = selectedAddresses.map((address, index) => ({
    number: index + 1,
    wallet: address,
  }))

  const closeWhitelistAddressesModalHandler = () => {
    closeWhitelistAddressesModal()
  }

  const [openWhitelistAddressesModal, closeWhitelistAddressesModal] = useModal(
    <ViewAddressesModal
      title="Presale Whitelist"
      headers={HEADERS_WHITELIST}
      data={data}
      onDismiss={closeWhitelistAddressesModalHandler}
    />
  )

  const closAddwhitelistModalHandler = (_, reason) => {
    if (reason !== 'backdropClick') {
      setIsWhitelistModalOpen(false)
      setNewWhitelist((prevState) => (isMainLoading ? { ...prevState } : { error: '', value: '' }))
    }
    setCsvFileData(null)
  }

  const addWhitelistHandler = async () => {
    const list = newWhitelist.value.split(',').map((address) => {
      return address.trim()
    })
    if (!presaleContract || !list.length || presaleInfo?.owner !== account) {
      return
    }
    try {
      setIsMainLoading(true)
      setIsLoadingButton({ type: LoadingButtonTypes.AddWhitelist, error: '', isClicked: true })
      const result = await presaleContract.addWhiteList(list)
      await result.wait()
      setWhitelistAddresses(await presaleContract.getWhitelist())
      setNewWhitelist({ value: '', error: '' })
      setIsMainLoading(false)
      closAddwhitelistModalHandler('', 'Close Modal')
      setIsLoadingButton({ type: LoadingButtonTypes.NotSelected, error: '', isClicked: false })
    } catch (err) {
      setIsMainLoading(false)
      setIsLoadingButton({ type: LoadingButtonTypes.AddWhitelist, error: 'Adding Whitelist Failed', isClicked: false })
      setNewWhitelist((prev) => ({ ...prev, error: 'Adding Whitelist Failed' }))
      console.error(err)
    }
  }

  const onChangeSaleType = async (event: any) => {
    if (presaleInfo?.owner !== account || !presaleContract) {
      return
    }
    const type = event.target.value
    try {
      setIsMainLoading(true)
      setIsLoadingButton({
        type: LoadingButtonTypes.ChangeSaleType,
        isClicked: true,
        error: '',
      })
      const result = await presaleContract.toggleWhitelistPhase()
      await result.wait()
      setIsMainLoading(false)
      setPresaleInfo((prevState) =>
        prevState ? { ...prevState, isWhitelistEnabled: type === `${RADIO_VALUES.WHITELIST_ENABLED}` } : prevState
      )
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        isClicked: false,
        error: '',
      })
    } catch (err) {
      setIsMainLoading(false)
      setIsLoadingButton({
        type: LoadingButtonTypes.ChangeSaleType,
        isClicked: false,
        error: 'Changing Sale Type Failed.',
      })
      console.error(err)
    }
  }

  useEffect(() => {
    if (csvFileData) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        const rows = result.slice(result.indexOf('\n') + 1).split('\n')
        let error = ''
        const value = rows
          .map((row) => {
            const add = row.split(',')[1].slice(1, -1)
            if (!isAddress(add)) {
              error = 'Not Valid addresses'
            }
            return add
          })
          .join(',')
        setNewWhitelist({
          value,
          error,
        })
        setIsWhitelistModalOpen(true)
      }
      reader.readAsText(csvFileData)
    }
  }, [csvFileData])

  const paginationStyles = usePaginationStyles()

  const startIndex = whitelistPage * ADDRESS_PER_PAGE - ADDRESS_PER_PAGE
  const endIndex =
    startIndex + ADDRESS_PER_PAGE > whitelistAddresses.length
      ? whitelistAddresses.length
      : startIndex + ADDRESS_PER_PAGE
  const slicedAddresses = whitelistAddresses.slice(startIndex, endIndex)

  return (
    <Box>
      {isAccountOwner && (
        <>
          <Modal open={isWhitelistModalOpen} onClose={closAddwhitelistModalHandler}>
            <AddWhitelistModal
              isLoadingButton={isLoadingButton}
              isMainLoading={isMainLoading}
              newWhitelist={newWhitelist}
              setNewWhitelist={setNewWhitelist}
              addWhitelistHandler={addWhitelistHandler}
              closeModalHandler={closAddwhitelistModalHandler}
              setCsvFileData={setCsvFileData}
            />
          </Modal>

          <Flex alignItems="center">
            <StyledText marginRight="16px" fontSize="20px">
              Sale Type
            </StyledText>
            {isLoadingButton.isClicked && isLoadingButton.type === LoadingButtonTypes.ChangeSaleType && (
              <AutoRenewIcon spin color="sidebarColor" />
            )}
          </Flex>
          <Box marginTop="16px" onChange={onChangeSaleType}>
            <RowFixed marginBottom="8px">
              <Radio
                id="whitelist-public"
                disabled={isMainLoading}
                scale="sm"
                name={FieldNames.isWhitelistEnabled}
                value={`${RADIO_VALUES.WHITELIST_DISABLED}`}
                checked={`${presaleInfo?.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_DISABLED}`}
              />
              <label htmlFor="whitelist-public">
                <StyledText
                  bold={presaleInfo?.isWhitelistEnabled === RADIO_VALUES.WHITELIST_DISABLED}
                  marginLeft="8px"
                  color={
                    `${presaleInfo?.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_DISABLED}` ? 'linkColor' : ''
                  }
                >
                  Public
                </StyledText>
              </label>
            </RowFixed>
            <RowFixed>
              <Radio
                id="whitelist-only"
                disabled={isMainLoading}
                scale="sm"
                name={FieldNames.isWhitelistEnabled}
                value={`${RADIO_VALUES.WHITELIST_ENABLED}`}
                checked={`${presaleInfo?.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_ENABLED}`}
              />
              <label htmlFor="whitelist-only">
                <StyledText
                  marginLeft="8px"
                  bold={presaleInfo?.isWhitelistEnabled === RADIO_VALUES.WHITELIST_ENABLED}
                  color={
                    `${presaleInfo?.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_ENABLED}` ? 'linkColor' : ''
                  }
                >
                  Whitelist Only
                </StyledText>
              </label>
            </RowFixed>
            {isLoadingButton.type === LoadingButtonTypes.ChangeSaleType && isLoadingButton.error && (
              <StyledText color="failure" marginTop="4px" fontSize="10px">
                {isLoadingButton.error}
              </StyledText>
            )}
          </Box>
          <StyledText marginTop="24px" fontSize="20px" fontWeight={700}>
            Whitelist Customization
          </StyledText>
          <Flex flexWrap="wrap">
            <Box>
              <Button
                onClick={() => setIsWhitelistModalOpen(true)}
                marginTop="16px"
                startIcon={<AddIcon width="15px" color="currentColor" />}
                variant="awesome"
                scale="sm"
                marginRight="16px"
              >
                Add New Whitelist
              </Button>
              {isLoadingButton.type === LoadingButtonTypes.AddWhitelist && isLoadingButton.error && (
                <StyledText color="failure" marginTop="4px" fontSize="10px">
                  {isLoadingButton.error}
                </StyledText>
              )}
            </Box>
            <LabelCSV htmlFor="whitelist-uploader">
              <FileIcon marginRight="4px" width="18px" color="currentColor" />
              <InputCSV
                id="whitelist-uploader"
                onChange={(e) => setCsvFileData(e.target.files?.length ? e.target.files[0] : null)}
                onClick={(e: any) => {
                  e.target.value = null
                }}
                accept=".csv"
              />
              Import Whitelist
            </LabelCSV>
          </Flex>
        </>
      )}
      <Flex marginTop="16px" justifyContent="space-between">
        <Flex>
          <PlaceHolderParticipants />
          <StyledText fontWeight={700} color="primaryDark">
            Whitelist Participants ({whitelistAddresses.length})
          </StyledText>
        </Flex>
        {whitelistAddresses.length > 0 &&
          (selectedAddresses.length ? (
            <StyledText
              marginLeft="6px"
              fontSize="14px"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedAddresses([])}
            >
              Cancel Selection
            </StyledText>
          ) : isAccountOwner ? (
            <RowFixed style={{ cursor: 'pointer' }} onClick={() => setSelectedAddresses([...whitelistAddresses])}>
              <TrashIcon color="failure" width="12px" />
              <StyledText marginLeft="6px" color="failure" fontSize="14px">
                Remove All
              </StyledText>
            </RowFixed>
          ) : (
            <StyledText
              marginLeft="6px"
              fontSize="14px"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedAddresses([...whitelistAddresses])}
            >
              Select All
            </StyledText>
          ))}
      </Flex>
      {whitelistAddresses.length === 0 ? (
        <StyledText marginTop="8px" fontSize="14px" color="textDisabled">
          {isAccountOwner ? 'You haven’t added any whitelist participants' : 'Ask Owner to add whitelist participants'}
        </StyledText>
      ) : (
        <Box marginTop="8px">
          {slicedAddresses.map((address) => (
            <AddressBox key={address} justifyContent="space-between">
              <Flex alignContent="center" alignItems="center">
                <WhitelistRadio
                  checked={selectedAddresses.includes(address)}
                  onClick={() => selectAddressHandler(address)}
                />
                <StyledText fontSize="14px" marginLeft="16px" color="textSubtle">
                  {address}
                </StyledText>
              </Flex>
              <Box style={{ cursor: 'pointer' }} onClick={() => selectAddressHandler(address)}>
                <CloseIcon color="sidebarColor" />
              </Box>
            </AddressBox>
          ))}
          {selectedAddresses.length > 0 && (
            <Flex marginTop="8px" justifyContent="end">
              <Button onClick={openWhitelistAddressesModal} variant="tertiary" scale="sm" marginRight="8px">
                View Selected {`(${selectedAddresses.length})`}
              </Button>
              {isAccountOwner && (
                <Box>
                  <Button
                    onClick={openRemoveWhitelistModal}
                    startIcon={
                      !(isLoadingButton.isClicked && isLoadingButton.type === LoadingButtonTypes.RemoveWhitelist) && (
                        <TrashIcon width="14px" color="currentColor" />
                      )
                    }
                    endIcon={
                      isLoadingButton.isClicked &&
                      isLoadingButton.type === LoadingButtonTypes.RemoveWhitelist && (
                        <AutoRenewIcon spin color="currentColor" />
                      )
                    }
                    disabled={
                      isLoadingButton.isClicked ||
                      (isLoadingButton.isClicked && isLoadingButton.type === LoadingButtonTypes.RemoveWhitelist) ||
                      isMainLoading
                    }
                    variant="danger"
                    scale="sm"
                    marginRight="8px"
                  >
                    Remove
                    {whitelistAddresses.length === selectedAddresses.length ? 'All' : `(${selectedAddresses.length})`}
                  </Button>
                  {isLoadingButton.type === LoadingButtonTypes.RemoveWhitelist && isLoadingButton.error && (
                    <StyledText color="failure" marginTop="4px" fontSize="10px">
                      {isLoadingButton.error}
                    </StyledText>
                  )}
                </Box>
              )}
            </Flex>
          )}
          <Box height="24px" />
          {whitelistAddresses.length > 0 && (
            <Pagination
              variant="outlined"
              shape="rounded"
              sx={paginationStyles}
              count={Math.ceil(whitelistAddresses.length / ADDRESS_PER_PAGE)}
              page={whitelistPage}
              onChange={(_, value: number) => setWhitelistPage(value)}
            />
          )}
        </Box>
      )}
    </Box>
  )
}

export default WhitelistSection
