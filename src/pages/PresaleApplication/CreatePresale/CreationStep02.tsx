/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  Radio,
  Coin2Icon,
  PeopleIcon,
  ChecklistIcon,
  HandCoinIcon,
} from '@koda-finance/summitswap-uikit'
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
  currency: string
}

const CreationStep02 = ({ formik, changeStepNumber, currency }: Props) => {
  return (
    <>
      <GridContainer>
        <ItemIconCard>
          <IconBox>
            <Coin2Icon width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Presale Rate</Heading>
          <Text small marginTop="4px">
            Set your token price in {currency}
          </Text>
        </GridItem1>
        <GridItem2>
          <Text small marginTop="8px">
            Presale Rate
          </Text>
          <StyledInput
            placeholder="Ex: 100"
            value={formik.values.presaleRate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name={FieldNames.presaleRate}
            id={FieldNames.presaleRate}
            type="number"
            isWarning={formik.touched.presaleRate && !!formik.errors.presaleRate}
          />
          <Caption color={formik.touched.presaleRate && !!formik.errors.presaleRate ? 'failure' : 'textDisabled'}>
            {formik.touched.presaleRate && formik.errors.presaleRate
              ? formik.errors.presaleRate
              : 'If I spend 1 BNB, how many CTK tokens will I receive?'}
          </Caption>
        </GridItem2>
      </GridContainer>
      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox>
            <PeopleIcon width="100%" />
          </IconBox>
        </ItemIconCard>
        <Box marginTop="8px" style={{ gridArea: 'title' }}>
          <Heading color="primary">Whitelist System</Heading>
          <Text small marginTop="4px">
            Whitelist system is where you only permit certain users to participate in your presale
          </Text>
          <Box marginTop="16px" onChange={formik.handleChange}>
            <RowFixed marginBottom="8px">
              <Radio
                scale="sm"
                name={FieldNames.isWhitelistEnabled}
                value={`${RADIO_VALUES.WHITELIST_ENABLED}`}
                checked={`${formik.values.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_ENABLED}`}
              />
              <label htmlFor="enable">
                <Text marginLeft="8px">Enable</Text>
              </label>
            </RowFixed>
            <RowFixed>
              <Radio
                scale="sm"
                name={FieldNames.isWhitelistEnabled}
                value={`${RADIO_VALUES.WHITELIST_DISABLED}`}
                checked={`${formik.values.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_DISABLED}`}
              />
              <label htmlFor="disable">
                <Text marginLeft="8px">Disable</Text>
              </label>
            </RowFixed>
          </Box>
        </Box>
      </GridContainer>
      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox>
            <ChecklistIcon width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Goal System</Heading>
          <Text small marginTop="4px">
            Set your softcap and hardcap for this presale
          </Text>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Text small marginTop="8px">
                Softcap ({currency})
              </Text>
              <StyledInput
                placeholder="Ex: 7.5"
                value={formik.values.softcap}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.softcap}
                id={FieldNames.softcap}
                type="number"
                isWarning={formik.touched.softcap && !!formik.errors.softcap}
              />
              <Caption color={formik.touched.softcap && !!formik.errors.softcap ? 'failure' : 'textDisabled'}>
                {formik.touched.softcap && formik.errors.softcap
                  ? formik.errors.softcap
                  : 'Softcap must be less or equal to 50% of Hardcap!'}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Hardcap ({currency})
              </Text>
              <StyledInput
                placeholder="Ex: 10"
                value={formik.values.hardcap}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.hardcap}
                id={FieldNames.hardcap}
                type="number"
                isWarning={formik.touched.hardcap && !!formik.errors.hardcap}
              />
              <Caption color={formik.touched.hardcap && !!formik.errors.hardcap ? 'failure' : 'textDisabled'}>
                {formik.touched.hardcap && formik.errors.hardcap ? formik.errors.hardcap : ''}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>
      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox>
            <HandCoinIcon strokeWidth={0} width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Purchasing System</Heading>
          <Text small marginTop="4px">
            Each user will only be able to buy the coin with minimum and maximum price as specified
          </Text>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Text small marginTop="8px">
                Minimum Buy ({currency})
              </Text>
              <StyledInput
                placeholder="Ex: 0.5"
                value={formik.values.minBuy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.minBuy}
                id={FieldNames.minBuy}
                type="number"
                isWarning={formik.touched.minBuy && !!formik.errors.minBuy}
              />
              <Caption color={formik.touched.minBuy && !!formik.errors.minBuy ? 'failure' : 'textDisabled'}>
                {formik.touched.minBuy && formik.errors.minBuy
                  ? formik.errors.minBuy
                  : 'Maximum Buy must be less or equal to Hardcap!'}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Maximum Buy ({currency})
              </Text>
              <StyledInput
                placeholder="Ex: 6"
                value={formik.values.maxBuy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.maxBuy}
                id={FieldNames.maxBuy}
                type="number"
                isWarning={formik.touched.maxBuy && !!formik.errors.maxBuy}
              />
              <Caption color={formik.touched.maxBuy && !!formik.errors.maxBuy ? 'failure' : 'textDisabled'}>
                {formik.touched.maxBuy && formik.errors.maxBuy ? formik.errors.maxBuy : ''}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>
      <RowBetween marginTop="50px" marginBottom="15px">
        <Button variant="secondary" onClick={() => changeStepNumber(0)}>
          Previous Step
        </Button>
        <Button onClick={() => changeStepNumber(2)}>Continue</Button>
      </RowBetween>
    </>
  )
}

export default CreationStep02
