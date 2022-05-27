/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, InputHTMLAttributes, useCallback } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useFormik, FormikProps } from 'formik'
import { useWeb3React } from '@web3-react/core'
import { Token, WETH } from '@koda-finance/summitswap-sdk'

import { Input, Text, Radio, Button, AutoRenewIcon } from '@koda-finance/summitswap-uikit'
import { HelpCircle } from 'react-feather'
import { useFactoryPresaleContract, useTokenContract } from '../../hooks/useContract'
import TokenDropdown from '../../components/TokenDropdown'
import { RowBetween, AutoRow } from '../../components/Row'
import { Values, ValueErrors, FieldNames, FieldValues } from './types'
import { MouseoverTooltip } from '../../components/Tooltip'

const FormCard = styled.div`
  background: #011724;
  border-radius: 20px;
  padding: 25px 28px;
  width: 85%;
  margin-top: 20px;
`
const commonInputStyles = `
  width: 250px;
  border-radius: 7px;
`

const RadioContainer = styled.div`
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

const StyledRadio = styled(Radio)`
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
const StyledDateTimeInput = styled(Input)`
  ::-webkit-calendar-picker-indicator {
    filter: invert(100%) sepia(1%) saturate(2177%) hue-rotate(118deg) brightness(119%) contrast(97%);
    &:hover {
      cursor: pointer;
    }
  }
  height: 55px;
  ${commonInputStyles}
`

const StyledInput = styled(Input)`
  ${commonInputStyles}
`

interface InputFieldProps {
  formik: FormikProps<Values>
  message: string
  label: string
  inputAttributes: InputHTMLAttributes<HTMLInputElement>
}

function InputField({ formik, message, inputAttributes, label }: InputFieldProps) {
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
      {formik.touched[propertyName] && formik.errors[propertyName] ? (
        <Text ml="3px" mt="2px" fontSize="10px" color="#ED4B9E">
          {formik.errors[propertyName]}
        </Text>
      ) : (
        <>
          &nbsp;
          <Text> </Text>
        </>
      )}
    </div>
  )
}
const factoryAddress = '0x97841174aa175879cE0DEABcB74EC9DE73eDb276'

export default function CustomPresale() {
  const { account, library } = useWeb3React() // librart is used to wait for transaction

  const [selectedToken, setSelectedToken] = useState<Token>()
  const [accountBalance, setAccountBalance] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const tokenContract = useTokenContract(selectedToken?.address, true)
  const factoryCotract = useFactoryPresaleContract(factoryAddress)

  const onApproveTokenHandler = useCallback(async () => {
    try {
      await tokenContract?.approve(factoryAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    } catch (err) {
      console.log(err)
    }
  }, [tokenContract])

  useEffect(() => {
    async function fetchBalance() {
      setAccountBalance(await tokenContract?.balanceOf(account))
    }
    if (account && tokenContract) {
      fetchBalance()
    }
  }, [account, tokenContract])

  const validate = (values: any) => {
    const errors: ValueErrors = {}

    if (!values.presaleRate) {
      errors.presaleRate = 'Required*'
    } else if (values.presaleRate <= 0) {
      errors.presaleRate = 'Presale Rate should be a postive Number'
    }

    if (!values.softcap) {
      errors.softcap = 'Required*'
    } else if (values.softcap <= 0) {
      errors.softcap = 'Softcap should be a positive number'
    } else if (values.softcap > values.hardcap) {
      errors.softcap = 'Softcap <= to hardcap'
    } else if (values.softcap < values.hardcap * 0.5) {
      errors.softcap = 'Softcap >= 50% of hardcap'
    }

    if (!values.hardcap) {
      errors.hardcap = 'Required*'
    } else if (values.hardcap <= 0) {
      errors.hardcap = 'Hardcap should be a positive number'
    }

    if (!values.minBuyBnb) {
      errors.minBuyBnb = 'Required*'
    } else if (values.minBuyBnb <= 0) {
      errors.minBuyBnb = 'Min(BNB) should be a positive number'
    } else if (values.minBuyBnb >= values.maxBuyBnb) {
      errors.minBuyBnb = 'Min(BNB) <= Max(BNB)'
    }

    if (!values.maxBuyBnb) {
      errors.maxBuyBnb = 'Required*'
    } else if (values.maxBuyBnb <= 0) {
      errors.maxBuyBnb = 'Max(Bnb) should be a positive number'
    }

    if (!values.liquidity) {
      errors.liquidity = 'Required*'
    } else if (values.liquidity <= 0) {
      errors.liquidity = 'Liquidity% should be a positive number'
    } else if (values.liquidity < 51 || values.liquidity > 100) {
      errors.liquidity = 'Liquidity% should be between 51% & 100%'
    } else if (!Number.isInteger(values.liquidity)) {
      errors.liquidity = 'Liquidity should be an Integer'
    }

    if (!values.listingRate) {
      errors.listingRate = 'Required*'
    } else if (values.listingRate <= 0) {
      errors.listingRate = 'Listing Rate should be a postive Number'
    }

    if (!values.startPresaleTime) {
      errors.startPresaleTime = 'Required*'
    } else if (new Date(values.startPresaleTime) <= new Date()) {
      errors.startPresaleTime = 'Start time > current time'
    } else if (new Date(values.startPresaleTime) >= new Date(values.endPresaleTime)) {
      errors.startPresaleTime = 'Start time < End time'
    }

    if (!values.endPresaleTime) {
      errors.endPresaleTime = 'Required*'
    } else if (new Date(values.endPresaleTime) <= new Date()) {
      errors.endPresaleTime = 'End time > current time'
    }

    if (!values.liquidyLockTimeInMins) {
      errors.liquidyLockTimeInMins = 'Required*'
    } else if (values.liquidyLockTimeInMins < 5) {
      errors.liquidyLockTimeInMins = 'Liquidity Lock time >= 5mins'
    }
    // first do token varification
    // if (values.hardcap && values.presaleRate && values.listingRate && values.liquidity && ownerBalacne) {
    //   const tokenAmount =
    //     values.presaleRate * values.hardcap + values.hardcap * (values.liquidity / 100) * values.listingRate * 1.025
    //   setTokensForPresale(tokenAmount)
    //   if (tokenAmount > +ethers.utils.formatEther(ownerBalacne)) {
    //     errors.tokenAmount = 'Token Amounts Exceeds Balance'
    //   }
    // } else {
    //   errors.tokenAmount = 'Token Amounts not set'
    // }

    return errors
  }

  const formik: FormikProps<Values> = useFormik({
    initialValues: {
      [FieldNames.presaleRate]: undefined,
      [FieldNames.isWhitelistEnabled]: FieldValues.whitelistDisable,
      [FieldNames.softcap]: undefined,
      [FieldNames.hardcap]: undefined,
      [FieldNames.minBuyBnb]: undefined,
      [FieldNames.maxBuyBnb]: undefined,
      [FieldNames.refundType]: FieldValues.refundTypeRefund,
      [FieldNames.router]: FieldValues.RouterAddressSummitswap,
      [FieldNames.liquidity]: undefined,
      [FieldNames.listingRate]: undefined,
      [FieldNames.startPresaleTime]: undefined,
      [FieldNames.endPresaleTime]: undefined,
      [FieldNames.liquidyLockTimeInMins]: undefined,
      [FieldNames.tokenAmount]: undefined,
      [FieldNames.feeType]: FieldValues.feeTypeOnlyBnb,
    } as Values,
    validate,
    onSubmit: async (values: Values) => {
      // setIsLoading(true)

      try {
        console.log('suck a dick', values)
      } catch (err) {
        console.log(err)
      }
    },
  })
  const handleTokenSelect = useCallback((inputCurrency) => {
    setSelectedToken(inputCurrency)
  }, [])

  return (
    <>
      <div style={{ width: '85%' }}>
        <Text bold fontSize="20px" mt="30px" mb="5px">
          Select Token For Presale
        </Text>
        <TokenDropdown
          onCurrencySelect={handleTokenSelect}
          selectedCurrency={selectedToken}
          showETH={false}
          showOnlyUnknownTokens
          // disabled={isLoading}
        />
        <Button
          onClick={() => {
            setIsLoading(!isLoading)
          }}
          endIcon={isLoading && <AutoRenewIcon spin color="currentColor" />}
        >
          Approving
        </Button>
      </div>
      <Text bold fontSize="23px" mt="" mb="5px">
        Create Token Presale
      </Text>
      <FormCard>
        <form onSubmit={formik.handleSubmit}>
          <AutoRow justifyContent="space-around">
            <InputField
              formik={formik}
              label="Presale Rate: "
              inputAttributes={{ name: FieldNames.presaleRate, placeholder: '0.00', type: 'number' }}
              message="(If
          I spend 1 BNB HOW MANY TOKENS WILL I RECIEVE ?)"
            />
            <InputField
              formik={formik}
              label="Listing Rate: "
              inputAttributes={{ name: FieldNames.listingRate, placeholder: '0.00', type: 'number' }}
              message="If I spend 1 BNB on how many tokens will I receive? Usually this amount is lower than presale rate to allow
          for a higher listing price on"
            />
          </AutoRow>
          <AutoRow justifyContent="space-around">
            <InputField
              formik={formik}
              label="Softcap: "
              inputAttributes={{ name: FieldNames.softcap, placeholder: '0.00', type: 'number' }}
              message="Soft cap should be >= 50% of Hard cap"
            />
            <InputField
              formik={formik}
              label="Hardcap: "
              inputAttributes={{ name: FieldNames.hardcap, placeholder: '0.00', type: 'number' }}
              message="(If
          I spend 1 BNB HOW MANY TOKENS WILL I RECIEVE ?)"
            />
          </AutoRow>
          <AutoRow justifyContent="space-around">
            <InputField
              formik={formik}
              label="Minimum Buy(BNB): "
              inputAttributes={{ name: FieldNames.minBuyBnb, placeholder: '0.00', type: 'number' }}
              message=""
            />
            <InputField
              formik={formik}
              label="Maximun buy(BNB): "
              inputAttributes={{ name: FieldNames.maxBuyBnb, placeholder: '0.00', type: 'number' }}
              message="(If
          I spend 1 BNB HOW MANY TOKENS WILL I RECIEVE ?)"
            />
          </AutoRow>
          <AutoRow justifyContent="space-around">
            <InputField
              formik={formik}
              label="Liquidity: "
              inputAttributes={{ name: FieldNames.liquidity, placeholder: '0%', type: 'number' }}
              message="Enter the percentage of raised funds that should be allocated to Liquidity on (Min 51%, Max 100%)"
            />
            <InputField
              formik={formik}
              label="Liquidity Lock Time(Min): "
              inputAttributes={{ name: FieldNames.liquidyLockTimeInMins, placeholder: '0', type: 'number' }}
              message="Minimun liquidity lockup time should be 5 mins"
            />
          </AutoRow>

          <AutoRow justifyContent="space-around">
            <Text bold fontSize="14px">
              Fee Options:
              <RadioContainer onChange={formik.handleChange}>
                <label style={{ marginRight: '10px' }}>
                  <StyledRadio
                    name={FieldNames.feeType}
                    value={FieldValues.feeTypeOnlyBnb}
                    checked={formik.values.feeType === FieldValues.feeTypeOnlyBnb}
                  />
                  5% BNB raised only
                </label>
                <label>
                  <StyledRadio
                    name={FieldNames.feeType}
                    value={FieldValues.feeTypeBnbnToken}
                    checked={formik.values.feeType === FieldValues.feeTypeBnbnToken}
                  />
                  2% BNB Raised + 2% Token Raised
                </label>
              </RadioContainer>
            </Text>
            <Text bold fontSize="14px">
              Enable Whitelist:
              <RadioContainer onChange={formik.handleChange}>
                <label style={{ marginRight: '10px' }}>
                  <StyledRadio
                    name={FieldNames.isWhitelistEnabled}
                    value={FieldValues.whitelistEnable}
                    checked={formik.values.isWhitelistEnabled === FieldValues.whitelistEnable}
                  />
                  Enable
                </label>
                <label>
                  <StyledRadio
                    name={FieldNames.isWhitelistEnabled}
                    value={FieldValues.whitelistDisable}
                    checked={formik.values.isWhitelistEnabled === FieldValues.whitelistDisable}
                  />
                  Disable
                </label>
              </RadioContainer>
            </Text>
          </AutoRow>
          <br />
          <AutoRow justifyContent="space-around">
            <Text bold fontSize="14px" style={{ width: '250px' }}>
              Router:
              <RadioContainer onChange={formik.handleChange}>
                <label>
                  <StyledRadio
                    name={FieldNames.router}
                    value={FieldValues.RouterAddressSummitswap}
                    checked={formik.values.router === FieldValues.RouterAddressSummitswap}
                  />{' '}
                  Summitswap
                </label>
                <label style={{ marginRight: '10px' }}>
                  <StyledRadio
                    name={FieldNames.router}
                    value={FieldValues.RouterAddressPancakeswap}
                    checked={formik.values.router === FieldValues.RouterAddressPancakeswap}
                  />
                  Pancakeswap
                </label>
              </RadioContainer>
            </Text>
            <Text bold fontSize="14px">
              Refund Type:
              <RadioContainer onChange={formik.handleChange}>
                <label style={{ marginRight: '10px' }}>
                  <StyledRadio
                    name={FieldNames.refundType}
                    value={FieldValues.refundTypeRefund}
                    checked={formik.values.refundType === FieldValues.refundTypeRefund}
                  />{' '}
                  Refund
                </label>
                <label>
                  <StyledRadio
                    name={FieldNames.refundType}
                    value={FieldValues.refundTypeBurn}
                    checked={formik.values.refundType === FieldValues.refundTypeBurn}
                  />{' '}
                  Burn
                </label>
              </RadioContainer>
            </Text>
          </AutoRow>
          <br />
          <AutoRow justifyContent="space-around">
            <div>
              <label>
                <RowBetween ml="3px" mb="5px">
                  <Text bold fontSize="15px">
                    Start Presale Time:
                  </Text>
                  <MouseoverTooltip
                    size="12px"
                    text="Start Presale time is the time when the presale starts.So, this time should be greater than current time and less than presale end time."
                  >
                    <span>
                      <HelpCircle size={18} />
                    </span>
                  </MouseoverTooltip>
                </RowBetween>
                <StyledDateTimeInput
                  value={formik.values.startPresaleTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={FieldNames.startPresaleTime}
                  isWarning={formik.touched.startPresaleTime && !!formik.errors.startPresaleTime}
                  type="datetime-local"
                />
              </label>
              {formik.touched.startPresaleTime && formik.errors.startPresaleTime ? (
                <Text ml="3px" mt="2px" fontSize="10px" color="#ED4B9E">
                  {formik.errors.startPresaleTime}
                </Text>
              ) : (
                <>
                  &nbsp;
                  <Text> </Text>
                </>
              )}
            </div>
            <div>
              <label>
                <RowBetween ml="3px" mb="5px">
                  <Text bold fontSize="15px">
                    End Presale Time:
                  </Text>
                  <MouseoverTooltip
                    size="12px"
                    text="End Presale time is the time when presale ends.So, this should be greater than current time and start presale time."
                  >
                    <span>
                      <HelpCircle size={18} />
                    </span>
                  </MouseoverTooltip>
                </RowBetween>
                <StyledDateTimeInput
                  value={formik.values.endPresaleTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={FieldNames.endPresaleTime}
                  isWarning={formik.touched.endPresaleTime && !!formik.errors.endPresaleTime}
                  type="datetime-local"
                />
              </label>
              {formik.touched.endPresaleTime && formik.errors.endPresaleTime ? (
                <Text ml="3px" mt="2px" fontSize="10px" color="#ED4B9E">
                  {formik.errors.endPresaleTime}
                </Text>
              ) : (
                <>
                  &nbsp;
                  <Text> </Text>
                </>
              )}
            </div>
          </AutoRow>
          <button type="submit">Submit</button>
        </form>
      </FormCard>
    </>
  )
}

// const StyledTextField = muiStyled(TextField)({
//   input: { color: '#ffffff', width: '222px' },
//   background: '#001018',
//   '& ::-webkit-calendar-picker-indicator': {
//     filter: 'invert(100%) sepia(1%) saturate(2177%) hue-rotate(118deg) brightness(119%) contrast(97%)',
//   },
//   borderRadius: '8px',
//   '& .MuiOutlinedInput-root': {
//     '&:hover fieldset': {
//       borderColor: '#7645D9',
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: '#7645D9',
//     },
//     '& input:valid + fieldset': {
//       borderColor: 'green',
//     },
//     '& input:invalid + fieldset': {
//       borderColor: 'red',
//     },
//   },
// })
