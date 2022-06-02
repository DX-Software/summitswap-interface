import React, { InputHTMLAttributes } from 'react'
import { FormikProps } from 'formik'
import styled from 'styled-components'
import { HelpCircle } from 'react-feather'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { Text, Button, Input, Radio, Modal, BaseButtonProps } from '@koda-finance/summitswap-uikit'
import Box from '@mui/material/Box'
import { MouseoverTooltip } from '../../components/Tooltip'
import { RowBetween } from '../../components/Row'
import DropdownWrapper from '../../components/DropdownWrapper'
import { Values, ModalProps } from './types'
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from './contants'

export const StyledDropdownWrapper = styled(DropdownWrapper)`
  width: 120px;
`
export const Card = styled.div`
  background: #011724;
  border-radius: 20px;
  padding: 25px 28px;
  width: 90%;
`

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  boxShadow: '24',
  p: '4',
}

export const MessageDiv = styled.div<{ type: string }>`
  height: 10px;
  fontsize: 10px;
  margintop: 5px;
  marginbottom: 5px;
  color: ${(props) => (props.type === MESSAGE_ERROR ? '#ED4B9E' : 'green')};
`

interface ButtonProps extends BaseButtonProps {
  buttonText: string
  msg: string
  type: string
  onClick: () => Promise<void> | void
}

export const ButtonWithMessage = ({ buttonText, msg, type, ...rest }: ButtonProps) => {
  return (
    <Box>
      <Button style={{ borderRadius: '11px' }} {...rest}>
        {buttonText}
      </Button>
      <MessageDiv type={type}>{msg}</MessageDiv>
    </Box>
  )
}

export const WhitelistModal = ({
  title,
  value,
  buttonText,
  isLoading,
  onChangeHandler,
  onDismiss,
  onSubmit,
}: ModalProps) => (
  <Box sx={style}>
    <Modal title={title} onDismiss={() => onDismiss('', '')}>
      <TextareaAutosize
        value={value.value}
        style={{ borderRadius: '5px', padding: '15px' }}
        minRows={3}
        onChange={onChangeHandler}
        placeholder="Follow this format to add addresses e.g 0x23233..,0x32323..."
      />
      {value.error !== '' ? (
        <MessageDiv type={MESSAGE_ERROR}>{value.error}</MessageDiv>
      ) : (
        <MessageDiv type={MESSAGE_SUCCESS}>
          {isLoading ? (title.includes('Remove') ? 'Removing Addresses' : 'Adding Addresses') : ''}
        </MessageDiv>
      )}
      <Button
        onClick={onSubmit}
        disabled={value.error !== '' || isLoading || value.value === ''}
        style={{ borderRadius: '11px' }}
        mt="10px"
        variant="awesome"
        scale="xxs"
      >
        {buttonText}
      </Button>
    </Modal>
  </Box>
)

export const FormCard = styled.div`
  background: #011724;
  border-radius: 20px;
  padding: 25px 28px;
  width: 85%;
  margin-top: 20px;
`
export const commonInputStyles = `
  width: 250px;
  border-radius: 7px;
`

export const RadioContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
  font-size: 12px;
  flex-direction: column;
  ${commonInputStyles}
  label {
    width: fit-content;
  }
`

export const StyledRadio = styled(Radio)`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  box-sizing: content-box;
  &:after {
    border-radius: 50%;
    content: '';
    height: 10px;
    width: 10px;
    left: 4px;
    top: 4px;
    position: absolute;
  }
`
export const StyledDateTimeInput = styled(Input)`
  ::-webkit-calendar-picker-indicator {
    filter: invert(100%) sepia(1%) saturate(2177%) hue-rotate(118deg) brightness(119%) contrast(97%);
    &:hover {
      cursor: pointer;
    }
  }
  height: 55px;
  ${commonInputStyles}
`

export const StyledInput = styled(Input)`
  ${commonInputStyles}
`

interface InputFieldProps {
  formik: FormikProps<Values>
  message: string
  label: string
  inputAttributes: InputHTMLAttributes<HTMLInputElement>
}

export function InputField({ formik, message, inputAttributes, label }: InputFieldProps) {
  const propertyName = inputAttributes.name as keyof Values
  return (
    <div>
      <label htmlFor={propertyName}>
        <RowBetween ml="3px" mb="5px">
          <Text bold fontSize="14px">
            {label}
          </Text>
          <MouseoverTooltip size="12px" text={message}>
            <span>
              <HelpCircle size={18} />
            </span>
          </MouseoverTooltip>
        </RowBetween>
        <StyledInput
          value={formik.values[propertyName]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name={propertyName}
          id={propertyName}
          isWarning={formik.touched[propertyName] && !!formik.errors[propertyName]}
          {...inputAttributes}
        />
      </label>
      <Text style={{ height: '10px' }} ml="3px" mt="2px" fontSize="10px" color="#ED4B9E">
        {formik.touched[propertyName] && formik.errors[propertyName] ? formik.errors[propertyName] : ''}
      </Text>
    </div>
  )
}
