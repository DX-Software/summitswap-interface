import React from 'react'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { Button, Modal } from '@koda-finance/summitswap-uikit'
import MaterialBox from '@mui/material/Box'
import MessageDiv from 'components/MessageDiv'
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from 'constants/presale'
import { FieldProps } from './types'

export interface ModalProps {
  title: string
  value: FieldProps
  buttonText: string
  isLoading: boolean
  onChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onDismiss: (_, reason) => void
  onSubmit: () => void
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

const WhitelistModal = ({ title, value, buttonText, isLoading, onChangeHandler, onDismiss, onSubmit }: ModalProps) => (
  <MaterialBox sx={style}>
    <Modal title={title} onDismiss={() => onDismiss('', '')}>
      <TextareaAutosize
        value={value.value}
        style={{ borderRadius: '5px', padding: '15px' }}
        minRows={3}
        maxRows={15}
        onChange={onChangeHandler}
        placeholder="Follow this format to add addresses e.g 0x23233..,0x32323..."
      />
      <MessageDiv marginY="10px" type={value.error ? MESSAGE_ERROR : MESSAGE_SUCCESS}>
        {value.error
          ? value.error
          : isLoading
          ? title.includes('Remove')
            ? 'Removing Addresses.'
            : 'Adding Addresses.'
          : ''}
      </MessageDiv>
      <Button
        onClick={onSubmit}
        disabled={value.error !== '' || isLoading || value.value === ''}
        style={{ borderRadius: '11px' }}
        variant="awesome"
        scale="xxs"
      >
        {buttonText}
      </Button>
    </Modal>
  </MaterialBox>
)

export default WhitelistModal
