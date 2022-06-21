import React, { InputHTMLAttributes } from 'react'
import { FormikProps } from 'formik'
import { Input, Text, Box, Button } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { HelpCircle } from 'react-feather'
import { MouseoverTooltip } from '../../components/Tooltip'
import { RowBetween } from '../../components/Row'
import CustomLightSpinner from '../../components/CustomLightSpinner'
import DropdownWrapper from '../../components/DropdownWrapper'

export interface StandardTokenValues {
  name: string
  symbol: string
  supply: string
  decimals: string
}

export interface LiquidityTokenValues {
  name: string
  symbol: string
  supply: string
  charityAddress: string
  taxFeeBps: string
  liquidityFeeBps: string
  charityFeeBps: string
  taxes: string
}

export interface BabyTokenValues {
  name: string
  symbol: string
  supply: string
  rewardToken: string
  marketingWallet: string
  tokenFeeBps: string
  liquidityFeeBps: string
  marketingFeeBps: string
  minimumTokenBalanceForDividends: string
  taxes: string
}

interface InputFieldProps {
  formik: FormikProps<StandardTokenValues> | FormikProps<LiquidityTokenValues> | FormikProps<BabyTokenValues>
  message: string
  label: string
  inputAttributes: InputHTMLAttributes<HTMLInputElement>
}

const StyledInputField = styled(Input)`
  border-radius: 10px;
  height: 45px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`

export const StyledDropdownWrapper = styled(DropdownWrapper)`
  font-size: 20px;
  width: 100%;
  & .Dropdown-control {
    padding-left: 26px;
    margin: 0;
  }
  & .Dropdown-option {
    color: #fff;
    margin-top: 10px;
    transition: 0.3s all ease-out;
    border-radius: 10px;
  }
  & .Dropdown-option:hover {
    background-color: #00d5a5;
    border-radius: 10px;
    font-weight: 700;
    color: #333;
    margin-left: 10px;
  }
  & .Dropdown-option.is-selected {
    background-color: #00d5a5;
    color: #fff !important;
    border-radius: 10px;
  }
`

export const PaginationButton = styled(Button)<{ isSelected: boolean }>`
  height: 17px;
  margin: 3px;
  background: ${(props) => (props.isSelected ? '' : '#fff')};
  opacity: ${(props) => (props.isSelected ? '1' : '0.5')};
  padding: 0;
  width: ${(props) => (props.isSelected ? '45px' : '17px')};
  @media (max-width: 480px) {
    display: none;
  }
`

const LoadingCard = styled(Box)`
  width: 80%;
  max-width: 600px;
  padding: 30px;
  height: 467px;
  background: #000f18;
  border-radius: 20px;
  height: fit-content;
  padding-bottom: 50px;
`

export const LoadingTokenCard = () => (
  <LoadingCard>
    <Text mb={30} fontSize="27px" textAlign="center" fontWeight="700" fontFamily="Roboto">
      Generating Token
    </Text>
    <Box display="flex">
      <CustomLightSpinner src="/images/blue-loader.svg" size="30%" />
    </Box>
  </LoadingCard>
)

export const InputFormik = ({ formik, message, inputAttributes, label }: InputFieldProps) => {
  const propertyName = inputAttributes.name as keyof (StandardTokenValues | LiquidityTokenValues | BabyTokenValues)
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
