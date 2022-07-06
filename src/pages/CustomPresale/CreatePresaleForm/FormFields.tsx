import React from 'react'
import styled, { css } from 'styled-components'
import { HelpCircle } from 'react-feather'
import { Text, Input, Radio, Box } from '@koda-finance/summitswap-uikit'
import { MouseoverTooltip } from 'components/Tooltip'
import { RowBetween } from 'components/Row'
import { Values, InputFieldPropsFormik } from '../types'

const commonInputStyles = css`
  width: 350px;
  border-radius: 7px;
  @media (max-width: 1250px) {
    width: 245px;
  }
  @media (max-width: 725px) {
    width: 275px;
  }
  @media (max-width: 350px) {
    width: 200px;
  }
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

export function InputField({ formik, message, inputAttributes, label }: InputFieldPropsFormik) {
  const propertyName = inputAttributes.name as keyof Values
  return (
    <Box marginX={3} marginBottom={1}>
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
    </Box>
  )
}
