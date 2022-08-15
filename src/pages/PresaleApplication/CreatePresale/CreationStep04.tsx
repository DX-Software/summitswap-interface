/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import styled from 'styled-components'
import { Box, Button, Flex, Text, ClockIcon, CalendarIcon, VestingIcon, Radio } from '@koda-finance/summitswap-uikit'
import { FormikProps } from 'formik'
import { RowBetween, RowFixed } from 'components/Row'
import { RADIO_VALUES } from 'constants/presale'
import { ItemIconCard, IconBox, GridContainer, GridItem1, GridItem2 } from './GridComponents'
import StyledInput, { StyledInputWrapper } from './StyledInput'
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
  @media (max-width: 550px) {
    height: 280px;
  }
`

const CreationStep04 = ({ formik, changeStepNumber }: Props) => {
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
                isWarning={formik.touched.startPresaleTime && !!formik.errors.startPresaleTime}
              />
              <Caption
                color={formik.touched.startPresaleTime && !!formik.errors.startPresaleTime ? 'failure' : 'textDisabled'}
              >
                {formik.touched.startPresaleTime && formik.errors.startPresaleTime
                  ? formik.errors.startPresaleTime
                  : ''}
              </Caption>
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
                isWarning={formik.touched.endPresaleTime && !!formik.errors.endPresaleTime}
              />
              <Caption
                color={formik.touched.endPresaleTime && !!formik.errors.endPresaleTime ? 'failure' : 'textDisabled'}
              >
                {formik.touched.endPresaleTime && formik.errors.endPresaleTime ? formik.errors.endPresaleTime : ''}
              </Caption>
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
          <Caption
            color={
              formik.touched.liquidyLockTimeInMins && !!formik.errors.liquidyLockTimeInMins ? 'failure' : 'textDisabled'
            }
          >
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
          <Text small marginTop="4px">
            What is and about vesting
          </Text>
        </GridItem1>
        <GridItem2>
          <Flex marginTop="8px" flexWrap="wrap" onChange={formik.handleChange}>
            <RowFixed marginRight="20px" marginBottom="8px">
              <Box>
                <Radio
                  scale="sm"
                  name={FieldNames.isVestingEnabled}
                  value={`${RADIO_VALUES.VESTING_ENABLED}`}
                  checked={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}`}
                />
              </Box>
              <label htmlFor="vestingEnabled">
                <Text
                  color={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}` ? 'linkColor' : ''}
                  marginLeft="8px"
                >
                  Enabled
                </Text>
                <Caption marginLeft="8px" color="textDisabled" style={{ maxWidth: '300px' }}>
                  Once presale end, users will be able to claim their token gradually
                </Caption>
              </label>
            </RowFixed>
            <RowFixed marginRight="70px" marginBottom="8px">
              <Box>
                <Radio
                  scale="sm"
                  name={FieldNames.isVestingEnabled}
                  value={`${RADIO_VALUES.VESTING_DISABLED}`}
                  checked={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_DISABLED}`}
                />
              </Box>
              <label htmlFor="vestingDisabled">
                <Text
                  color={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_DISABLED}` ? 'linkColor' : ''}
                  marginLeft="8px"
                >
                  Disabled
                </Text>
                <Caption marginLeft="8px" color="textDisabled" style={{ maxWidth: '300px' }}>
                  Once presale end, users are able to claim all of the their tokens at once
                </Caption>
              </label>
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
                    <StyledInput placeholder="Ex: 100" type="number" />
                  </StyledInputWrapper>
                  <StyledInputWrapper forDate marginRight="16px">
                    <Text small marginTop="8px">
                      Interval Day
                    </Text>
                    <StyledInput forTime placeholder="Ex: 100" type="number" />
                  </StyledInputWrapper>
                  <StyledInputWrapper forDate marginRight="16px">
                    <Text small marginTop="8px">
                      Interval Time (UTC)
                    </Text>
                    <StyledInput forTime placeholder="Ex: 100" type="number" />
                  </StyledInputWrapper>
                </Flex>
                <Caption marginLeft="16px" color="textDisabled">
                  Every
                  <Caption bold small color="primary">
                    &nbsp;10%&nbsp;
                  </Caption>
                  of the total claimable token will be available for redeem on
                  <Caption bold small color="primary">
                    &nbsp;day 1&nbsp;
                  </Caption>
                  at
                  <Caption bold small color="primary">
                    &nbsp;07:00 UTC&nbsp;
                  </Caption>
                  of the following month
                </Caption>
              </Flex>
            </Flex>
          )}
        </GridItem2>
      </GridContainer>
      <RowBetween marginTop="50px" marginBottom="15px">
        <Button variant="secondary" onClick={() => changeStepNumber(2)}>
          Previous Step
        </Button>
        <Button onClick={() => changeStepNumber(4)}>Continue</Button>
      </RowBetween>
    </>
  )
}

export default CreationStep04
