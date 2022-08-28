import React from 'react'
import {
  AutoRenewIcon,
  AddIcon,
  Button,
  Modal as SummitModal,
  darkColors,
  lightColors,
} from '@koda-finance/summitswap-uikit'
import { TextareaAutosize, Box as MaterialBox } from '@mui/material'
import { isAddress } from 'ethers/lib/utils'
import { FieldProps, LoadingButtonTypes, LoadingForButton } from '../types'
import { StyledText } from './Shared'

interface Props {
  isMainLoading: boolean
  newWhitelist: FieldProps
  isLoadingButton: LoadingForButton
  setNewWhitelist: React.Dispatch<React.SetStateAction<FieldProps>>
  closeModalHandler: (_: any, reason: any) => void
  addWhitelistHandler: (addresses: string) => void
}
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  boxShadow: '24',
  textAlign: 'center',
  p: '4',
}

const AddWhitelistModal = ({
  isLoadingButton,
  newWhitelist,
  setNewWhitelist,
  isMainLoading,
  closeModalHandler,
  addWhitelistHandler,
}: Props) => {
  const newWhitelistChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let error = ''
    if (e.target.value) {
      if (
        !e.target.value.split(',').every((val) => {
          return isAddress(val.trim())
        })
      ) {
        error = 'Not valid addresses'
      }
    }
    setNewWhitelist({
      value: e.target.value,
      error,
    })
  }

  return (
    <MaterialBox sx={style}>
      <SummitModal title="Add Whitelist" onDismiss={() => closeModalHandler('', '')}>
        <TextareaAutosize
          value={newWhitelist.value}
          style={{ borderRadius: '5px', padding: '15px', background: darkColors.background, color: lightColors.text }}
          minRows={3}
          maxRows={15}
          onChange={newWhitelistChangeHandler}
          placeholder="Follow this format to add addresses e.g 0x23233..,0x32323..."
        />
        <StyledText style={{ height: '10px' }} fontSize="12px" color={newWhitelist.error ? 'failure' : 'primary'}>
          {newWhitelist.error ? newWhitelist.error : isMainLoading && 'Adding Addresses.'}
        </StyledText>
        <Button
          endIcon={
            isLoadingButton.isClicked &&
            isLoadingButton.type === LoadingButtonTypes.AddWhitelist && <AutoRenewIcon spin color="currentColor" />
          }
          startIcon={
            !(isLoadingButton.isClicked && isLoadingButton.type === LoadingButtonTypes.AddWhitelist) && (
              <AddIcon width="15px" color="currentColor" />
            )
          }
          marginTop="12px"
          onClick={() => addWhitelistHandler(newWhitelist.value)}
          disabled={
            newWhitelist.error !== '' || isMainLoading || newWhitelist.value === '' || isLoadingButton.isClicked
          }
          variant="awesome"
          scale="sm"
        >
          Add New Whitelist
        </Button>
      </SummitModal>
    </MaterialBox>
  )
}

export default AddWhitelistModal
