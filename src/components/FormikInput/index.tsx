import React, { InputHTMLAttributes } from 'react'
import { FormikProps } from 'formik'
import { Input, Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { HelpCircle } from 'react-feather'
import { MouseoverTooltip } from '../Tooltip'
import { RowBetween } from '../Row'

export interface StandardTokenValues {
  name?: string
  symbol?: string
  supply?: string
  decimals?: string
}

export interface LiquidityTokenValues {
  name?: string
  symbol?: string
  supply?: string
  charityAddress?: string
  taxFeeBps?: string
  liquidityFeeBps?: string
  charityFeeBps?: string
  taxes?: string
}

interface InputFieldProps {
  formik: FormikProps<StandardTokenValues> | FormikProps<LiquidityTokenValues>
  message: string
  label: string
  inputAttributes: InputHTMLAttributes<HTMLInputElement>
}

const StyledInputField = styled(Input)`
  border-radius: 10px;
  height: 45px;
`

const InputFormik = ({ formik, message, inputAttributes, label }: InputFieldProps) => {
  const propertyName = inputAttributes.name as keyof (StandardTokenValues | LiquidityTokenValues)
  return (
    <div>
      <label htmlFor={propertyName}>
        <RowBetween ml="3px" mb="5px" mt="20px">
          <Text bold fontSize="18px">
            {label}
          </Text>
          <MouseoverTooltip text={message}>
            <span>
              <HelpCircle size={20} />
            </span>
          </MouseoverTooltip>
        </RowBetween>
        <StyledInputField
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

export default InputFormik
