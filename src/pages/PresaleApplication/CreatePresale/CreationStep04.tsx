/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  Flex,
  Text,
  ClockIcon,
  Select,
  CalendarIcon,
  VestingIcon,
  Radio,
} from '@koda-finance/summitswap-uikit'
import { FormikProps } from 'formik'
import { RowFixed } from 'components/Row'
import { RADIO_VALUES, DAY_OPTIONS, HOUR_OPTIONS } from 'constants/presale'
import { ItemIconCard, IconBox, GridContainer, GridItem1, GridItem2 } from './GridComponents'
import StyledInput, { StyledInputWrapper } from './StyledInput'
import ButtonsWrapper from './ButtonsWrapper'
import { Caption, Heading } from '../Texts'
import { PresaleDetails, FieldNames } from '../types'

interface Props {
  formik: FormikProps<PresaleDetails>
  changeStepNumber: (num: number) => void
}

const PlaceholderDiv = styled.div`
  width: 8px;
  background: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  height: 114px;
  @media (max-width: 1263px) {
    height: 190px;
  }
  @media (max-width: 570px) {
    height: 280px;
  }
`

const StyledSelect = styled(Select)`
  > select {
    margin: 4px 0;
    width: 150px;
    height: 44px;
    @media (max-width: 550px) {
      width: 100%;
    }
  }
`

const CreationStep04 = ({ formik, changeStepNumber }: Props) => {
  const [isStepValid, setIsStepValid] = useState(false)

  useEffect(() => {
    if (
      !formik.errors.startPresaleDate &&
      !formik.errors.startPresaleTime &&
      !formik.errors.endPresaleDate &&
      !formik.errors.endPresaleTime &&
      !formik.errors.liquidyLockTimeInMins
    ) {
      if (
        `${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_DISABLED}` ||
        (!formik.errors.maxClaimPercentage && !formik.errors.claimIntervalDay && !formik.errors.claimIntervalHour)
      ) {
        setIsStepValid(true)
      } else {
        setIsStepValid(false)
      }
    } else {
      setIsStepValid(false)
    }
  }, [formik])

  return (
    <>
      <GridContainer>
        <ItemIconCard>
          <IconBox width="56px">
            <CalendarIcon width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Start & End Time</Heading>
          <Text small marginTop="4px">
            Define start and end time for your presale
          </Text>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper forDate marginRight="16px">
              <Text small marginTop="8px">
                Start Date
              </Text>
              <StyledInput
                forDate
                type="date"
                value={formik.values.startPresaleDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.startPresaleDate}
                isWarning={formik.touched.startPresaleDate && !!formik.errors.startPresaleDate}
              />
              <Caption
                color={formik.touched.startPresaleDate && !!formik.errors.startPresaleDate ? 'failure' : 'textDisabled'}
              >
                {formik.touched.startPresaleDate && formik.errors.startPresaleDate
                  ? formik.errors.startPresaleDate
                  : ''}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper forDate>
              <Text small marginTop="8px">
                Start Time (UTC)
              </Text>
              <StyledInput
                forTime
                type="time"
                defaultValue="00:00"
                value={formik.values.startPresaleTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.startPresaleTime}
                isWarning={!!formik.errors.startPresaleTime}
              />
              <Caption color="failure">{formik.errors.startPresaleTime ? formik.errors.startPresaleTime : ''}</Caption>
            </StyledInputWrapper>
          </Flex>
          <Flex flexWrap="wrap">
            <StyledInputWrapper forDate marginRight="16px">
              <Text small marginTop="8px">
                End Date
              </Text>
              <StyledInput
                forDate
                type="date"
                value={formik.values.endPresaleDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.endPresaleDate}
                isWarning={formik.touched.endPresaleDate && !!formik.errors.endPresaleDate}
              />
              <Caption
                color={formik.touched.endPresaleDate && !!formik.errors.endPresaleDate ? 'failure' : 'textDisabled'}
              >
                {formik.touched.endPresaleDate && formik.errors.endPresaleDate ? formik.errors.endPresaleDate : ''}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper forDate>
              <Text small marginTop="8px">
                End Time (UTC)
              </Text>
              <StyledInput
                forTime
                type="time"
                defaultValue="00:00"
                value={formik.values.endPresaleTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.endPresaleTime}
                isWarning={!!formik.errors.endPresaleTime}
              />
              <Caption color="failure">{formik.errors.endPresaleTime ? formik.errors.endPresaleTime : ''}</Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>
      <GridContainer marginTop="50px">
        <ItemIconCard>
          <IconBox width="56px">
            <ClockIcon width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Liquidity Lockup Time</Heading>
          <Text small marginTop="4px">
            Minimum Liquidity Lockup time should be 5 minutes
          </Text>
        </GridItem1>
        <GridItem2>
          <Text small marginTop="8px">
            Enter Liquidity Lockup
          </Text>
          <StyledInput
            placeholder="Ex: 100"
            type="number"
            value={formik.values.liquidyLockTimeInMins}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name={FieldNames.liquidyLockTimeInMins}
            id={FieldNames.liquidyLockTimeInMins}
            isWarning={formik.touched.liquidyLockTimeInMins && !!formik.errors.liquidyLockTimeInMins}
          />
          <Caption color="failure">
            {formik.touched.liquidyLockTimeInMins && formik.errors.liquidyLockTimeInMins
              ? formik.errors.liquidyLockTimeInMins
              : ''}
          </Caption>
        </GridItem2>
      </GridContainer>

      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox width="56px">
            <VestingIcon width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Vesting</Heading>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap" onChange={formik.handleChange}>
            <RowFixed marginRight="20px" marginBottom="8px">
              <Box>
                <Radio
                  scale="sm"
                  id={`${FieldNames.isVestingEnabled}-${RADIO_VALUES.VESTING_ENABLED}`}
                  name={FieldNames.isVestingEnabled}
                  value={`${RADIO_VALUES.VESTING_ENABLED}`}
                  checked={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}`}
                />
              </Box>
              <Box>
                <label htmlFor={`${FieldNames.isVestingEnabled}-${RADIO_VALUES.VESTING_ENABLED}`}>
                  <Text
                    color={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}` ? 'linkColor' : ''}
                    marginLeft="8px"
                  >
                    Enabled
                  </Text>
                </label>
                <Caption marginLeft="8px" color="textDisabled" style={{ maxWidth: '300px' }}>
                  Once presale end, users will be able to claim their token gradually
                </Caption>
              </Box>
            </RowFixed>
            <RowFixed marginRight="70px" marginBottom="8px">
              <Box>
                <Radio
                  scale="sm"
                  id={`${FieldNames.isVestingEnabled}-${RADIO_VALUES.VESTING_DISABLED}`}
                  name={FieldNames.isVestingEnabled}
                  value={`${RADIO_VALUES.VESTING_DISABLED}`}
                  checked={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_DISABLED}`}
                />
              </Box>
              <Box>
                <label htmlFor={`${FieldNames.isVestingEnabled}-${RADIO_VALUES.VESTING_DISABLED}`}>
                  <Text
                    color={
                      `${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_DISABLED}` ? 'linkColor' : ''
                    }
                    marginLeft="8px"
                  >
                    Disabled
                  </Text>
                </label>
                <Caption marginLeft="8px" color="textDisabled" style={{ maxWidth: '300px' }}>
                  Once presale end, users are able to claim all of the their tokens at once
                </Caption>
              </Box>
            </RowFixed>
          </Flex>
          {`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}` && (
            <Flex alignItems="flex-end">
              <PlaceholderDiv />
              <Flex width="100%" flexDirection="column">
                <Flex marginX="16px" justifyContent="flex-start" flexWrap="wrap">
                  <StyledInputWrapper marginRight="16px">
                    <Text small marginTop="8px">
                      Vesting Claim Percentage (%)
                    </Text>
                    <StyledInput
                      placeholder="Ex: 20%"
                      type="number"
                      value={formik.values.maxClaimPercentage}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name={FieldNames.maxClaimPercentage}
                      id={FieldNames.maxClaimPercentage}
                      isWarning={formik.touched.maxClaimPercentage && !!formik.errors.maxClaimPercentage}
                    />
                    <Caption color="failure">
                      {formik.touched.maxClaimPercentage && formik.errors.maxClaimPercentage
                        ? formik.errors.maxClaimPercentage
                        : ''}
                    </Caption>
                  </StyledInputWrapper>
                  <StyledInputWrapper forDate marginRight="16px">
                    <Text small marginTop="8px">
                      Interval Day
                    </Text>
                    <StyledSelect
                      options={DAY_OPTIONS}
                      id={FieldNames.claimIntervalDay}
                      onValueChanged={(value: any) => formik.setFieldValue(FieldNames.claimIntervalDay, value)}
                      selected={`${formik.values.claimIntervalDay}`}
                    />
                  </StyledInputWrapper>
                  <StyledInputWrapper forDate marginRight="16px">
                    <Text small marginTop="8px">
                      Interval Time (UTC)
                    </Text>
                    <StyledSelect
                      options={HOUR_OPTIONS}
                      id={FieldNames.claimIntervalHour}
                      onValueChanged={(value: any) => formik.setFieldValue(FieldNames.claimIntervalHour, value)}
                      selected={`${formik.values.claimIntervalHour}`}
                    />
                  </StyledInputWrapper>
                </Flex>
                <Caption marginLeft="16px" color="textDisabled" style={{ maxWidth: '100%' }}>
                  Every
                  <Caption bold small color="primary">
                    &nbsp;{formik.values.maxClaimPercentage || '20'}%&nbsp;
                  </Caption>
                  of the total claimable token will be available for redeem on
                  <Caption bold small color="primary">
                    &nbsp;day {formik.values.claimIntervalDay}&nbsp;
                  </Caption>
                  at
                  <Caption bold small color="primary">
                    &nbsp;
                    {Number(formik.values.claimIntervalHour) < 10
                      ? `0${formik.values.claimIntervalHour}`
                      : formik.values.claimIntervalHour}
                    :00 UTC&nbsp;
                  </Caption>
                  of the following month
                </Caption>
              </Flex>
            </Flex>
          )}
        </GridItem2>
      </GridContainer>
      <ButtonsWrapper>
        <Button variant="secondary" onClick={() => changeStepNumber(2)}>
          Previous Step
        </Button>
        {formik.errors.tokenAmount ? (
          <Text bold marginY="20px" color="failure">
            {formik.errors.tokenAmount}
          </Text>
        ) : (
          <Text bold marginY="20px" color="success">
            {formik.values.tokenAmount ? `${formik.values.tokenAmount.toFixed(2)} Presale Tokens` : ''}
          </Text>
        )}
        <Button disabled={!isStepValid} onClick={() => changeStepNumber(4)}>
          Continue
        </Button>
      </ButtonsWrapper>
    </>
  )
}

export default CreationStep04
