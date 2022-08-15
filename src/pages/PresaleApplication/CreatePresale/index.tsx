import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useFormik, FormikProps } from 'formik'
import { Flex, Box, Radio, Text } from '@koda-finance/summitswap-uikit'
import { RADIO_VALUES, TOKEN_CHOICES } from 'constants/presale'
import steps from './steps-data'
import CreationStep01 from './CreationStep01'
import CreationStep02 from './CreationStep02'
import CreationStep03 from './CreationStep03'
import CreationStep04 from './CreationStep04'
import CreationStep05 from './CreationStep05'
import CreationStep06, { Divider } from './CreationStep06'
import { validatePresaleDetails } from './formValidations'
import { PresaleDetails, FieldNames } from '../types'

const StepsWrapper = styled(Box)`
  width: 522px;
  text-align: center;
`
const ContentWrapper = styled(Box)`
  width: 90%;
  max-width: 950px;
`

const StepLine = styled.div`
  position: relative;
  top: 18px;
  background: #3c3742;
  border-radius: 9px;
  width: 100%;
  height: 4px;
`

const StyledRadio = styled(Radio)<{ completed: boolean }>`
  cursor: auto;
  background-color: ${({ completed, theme }) => (completed ? theme.colors.success : theme.colors.inputColor)};
  &:hover:not(:disabled):not(:checked) {
    box-shadow: none;
  }
  &:focus {
    box-shadow: none;
  }
  &:after {
    background-color: ${({ completed, theme }) => (completed ? theme.colors.success : theme.colors.inputColor)};
  }
  &:checked {
    &:after {
      background-color: ${({ theme }) => theme.colors.inputColor};
    }
  }
`
const CreatePresale = () => {
  const [stepNumber, setStepNumber] = useState(0)
  const [currency, setCurrency] = useState('BNB')

  const changeStepNumber = useCallback((num: number) => setStepNumber(num), [])

  const formikPresaleD: FormikProps<PresaleDetails> = useFormik({
    initialValues: {
      [FieldNames.presaleRate]: undefined,
      [FieldNames.isWhitelistEnabled]: RADIO_VALUES.WHITELIST_ENABLED,
      [FieldNames.softcap]: undefined,
      [FieldNames.hardcap]: undefined,
      [FieldNames.minBuy]: undefined,
      [FieldNames.maxBuy]: undefined,
      [FieldNames.refundType]: RADIO_VALUES.REFUND_TYPE_REFUND,
      [FieldNames.listingChoice]: RADIO_VALUES.LISTING_SS_100,
      [FieldNames.liquidity]: undefined,
      [FieldNames.listingRate]: undefined,
      [FieldNames.startPresaleTime]: undefined,
      [FieldNames.endPresaleTime]: undefined,
      [FieldNames.liquidyLockTimeInMins]: undefined,
      [FieldNames.tokenAmount]: undefined,
      [FieldNames.paymentToken]: TOKEN_CHOICES.BNB,
      [FieldNames.listingToken]: TOKEN_CHOICES.KODA,
      [FieldNames.maxClaimPercentage]: undefined,
      [FieldNames.claimIntervalDay]: undefined,
      [FieldNames.claimIntervalHour]: undefined,
      [FieldNames.isVestingEnabled]: false,
    } as PresaleDetails,
    validate: validatePresaleDetails,
    // eslint-disable-next-line
    onSubmit: () => {},
  })

  const showStep = () => {
    switch (stepNumber) {
      case 0:
        return (
          <CreationStep01
            formik={formikPresaleD}
            changeStepNumber={changeStepNumber}
            currency={currency}
            setCurrency={setCurrency}
          />
        )
      case 1:
        return <CreationStep02 currency={currency} changeStepNumber={changeStepNumber} />
      case 2:
        return <CreationStep03 changeStepNumber={changeStepNumber} />
      case 3:
        return <CreationStep04 changeStepNumber={changeStepNumber} />
      case 4:
        return <CreationStep05 changeStepNumber={changeStepNumber} />
      case 5:
        return <CreationStep06 currency={currency} changeStepNumber={changeStepNumber} />
      default:
        return <></>
    }
  }

  return (
    <>
      <StepsWrapper>
        <Text color="primary" small>
          {steps[stepNumber].name}
        </Text>
        <Text marginTop="8px" fontSize="24px" fontWeight={700}>
          {steps[stepNumber].title}
        </Text>
        <Text marginTop="8px" color="textSubtle">
          {steps[stepNumber].subTitle}
        </Text>
        <Box marginY="35px">
          <StepLine />
          <Flex justifyContent="space-between">
            <StyledRadio completed={stepNumber > 0} checked={stepNumber === 0} onClick={() => setStepNumber(0)} />
            <StyledRadio completed={stepNumber > 1} checked={stepNumber === 1} onClick={() => setStepNumber(1)} />
            <StyledRadio completed={stepNumber > 2} checked={stepNumber === 2} onClick={() => setStepNumber(2)} />
            <StyledRadio completed={stepNumber > 3} checked={stepNumber === 3} onClick={() => setStepNumber(3)} />
            <StyledRadio completed={stepNumber > 4} checked={stepNumber === 4} onClick={() => setStepNumber(4)} />
            <StyledRadio completed={stepNumber > 5} checked={stepNumber === 5} onClick={() => setStepNumber(5)} />
          </Flex>
        </Box>
      </StepsWrapper>
      <Divider />
      <ContentWrapper>{showStep()}</ContentWrapper>
    </>
  )
}

export default CreatePresale
