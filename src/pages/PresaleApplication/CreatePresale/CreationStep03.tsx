/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  Flex,
  Text,
  Radio,
  PairCoinsIcon,
  ShopIcon,
  RefundIcon,
  RouterIcon,
} from '@koda-finance/summitswap-uikit'
import { FormikProps } from 'formik'
import { TOKEN_CHOICES, RADIO_VALUES } from 'constants/presale'
import { RowFixed } from 'components/Row'
import { ItemIconCard, IconBox, GridContainer, GridItem1, GridItem2 } from './GridComponents'
import StyledInput, { StyledInputWrapper } from './StyledInput'
import ButtonsWrapper from './ButtonsWrapper'
import { Caption, Heading } from '../Texts'
import { PresaleDetails, FieldNames } from '../types'

interface Props {
  formik: FormikProps<PresaleDetails>
  changeStepNumber: (num: number) => void
}

const BoxPairIcon = styled(Box)`
  width: 36px;
  @media (max-width: 480px) {
    width: 19px;
  }
`

const CreationStep03 = ({ formik, changeStepNumber }: Props) => {
  const [isStepValid, setIsStepValid] = useState(false)
  useEffect(() => {
    if (!formik.errors.liquidity && !formik.errors.listingRate && !formik.errors.tokenAmount) {
      setIsStepValid(true)
    }
  }, [formik])

  return (
    <>
      <Flex flexWrap="wrap" justifyContent="space-between">
        <GridContainer marginBottom="40px">
          <ItemIconCard>
            <IconBox width="56px">
              <RefundIcon width="100%" />
            </IconBox>
          </ItemIconCard>
          <Box marginTop="8px">
            <Heading color="primary">Refund System</Heading>
            <Text small marginTop="4px">
              What is and about refund
            </Text>
            <Box marginTop="16px" onChange={formik.handleChange}>
              <RowFixed marginBottom="8px">
                <Box>
                  <Radio
                    scale="sm"
                    name={FieldNames.refundType}
                    value={RADIO_VALUES.REFUND_TYPE_REFUND}
                    checked={Number(formik.values.refundType) === RADIO_VALUES.REFUND_TYPE_REFUND}
                  />
                </Box>
                <label htmlFor="refund">
                  <Text
                    color={Number(formik.values.refundType) === RADIO_VALUES.REFUND_TYPE_REFUND ? 'linkColor' : ''}
                    marginLeft="8px"
                  >
                    Refund
                  </Text>
                  <Caption marginX="8px" color="textDisabled">
                    Refund remaining presale Token after finalizing
                  </Caption>
                </label>
              </RowFixed>
              <RowFixed>
                <Box>
                  <Radio
                    scale="sm"
                    name={FieldNames.refundType}
                    value={RADIO_VALUES.REFUND_TYPE_BURN}
                    checked={Number(formik.values.refundType) === RADIO_VALUES.REFUND_TYPE_BURN}
                  />
                </Box>
                <label htmlFor="burn">
                  <Text
                    marginLeft="8px"
                    color={Number(formik.values.refundType) === RADIO_VALUES.REFUND_TYPE_BURN ? 'linkColor' : ''}
                  >
                    Burn
                  </Text>
                  <Caption marginX="8px" color="textDisabled">
                    Burn remaining presale Token after finalizing
                  </Caption>
                </label>
              </RowFixed>
            </Box>
          </Box>
        </GridContainer>
        <GridContainer marginBottom="40px">
          <ItemIconCard>
            <IconBox width="56px">
              <RouterIcon width="100%" />
            </IconBox>
          </ItemIconCard>
          <Box marginTop="8px">
            <Heading color="primary">Choose Router</Heading>
            <Text small marginTop="4px">
              To determine Liquidity & Listing Rate
            </Text>
            <Box marginTop="16px" onChange={formik.handleChange}>
              <RowFixed marginBottom="8px">
                <Box>
                  <Radio
                    scale="sm"
                    name={FieldNames.listingChoice}
                    value={RADIO_VALUES.LISTING_SS_100}
                    checked={Number(formik.values.listingChoice) === RADIO_VALUES.LISTING_SS_100}
                  />
                </Box>
                <label htmlFor="summitswap">
                  <Text
                    color={Number(formik.values.listingChoice) === RADIO_VALUES.LISTING_SS_100 ? 'linkColor' : ''}
                    marginLeft="8px"
                  >
                    SummitSwap (SS)
                  </Text>
                </label>
              </RowFixed>
              <RowFixed>
                <Box>
                  <Radio
                    scale="sm"
                    name={FieldNames.listingChoice}
                    value={RADIO_VALUES.LISTING_PS_100}
                    checked={Number(formik.values.listingChoice) === RADIO_VALUES.LISTING_PS_100}
                  />
                </Box>
                <label htmlFor="pancakeswap">
                  <Text
                    marginLeft="8px"
                    color={Number(formik.values.listingChoice) === RADIO_VALUES.LISTING_PS_100 ? 'linkColor' : ''}
                  >
                    PancakeSwap (PS)
                  </Text>
                </label>
              </RowFixed>
              <RowFixed>
                <Box>
                  <Radio
                    scale="sm"
                    name={FieldNames.listingChoice}
                    value={RADIO_VALUES.LISTING_SS75_PK25}
                    checked={Number(formik.values.listingChoice) === RADIO_VALUES.LISTING_SS75_PK25}
                  />
                </Box>
                <label htmlFor="both">
                  <Text
                    marginLeft="8px"
                    color={Number(formik.values.listingChoice) === RADIO_VALUES.LISTING_SS75_PK25 ? 'linkColor' : ''}
                  >
                    Both
                  </Text>
                  <Caption marginLeft="8px" color="textDisabled">
                    This will be listed to 75% SS and 25% PS
                  </Caption>
                </label>
              </RowFixed>
            </Box>
          </Box>
        </GridContainer>
      </Flex>

      <GridContainer>
        <ItemIconCard>
          <IconBox>
            <ShopIcon width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Liquidity & Listing Rate</Heading>
          <Text small marginTop="4px">
            What is Liquidity & Listing Rate
          </Text>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Text small marginTop="8px">
                Router Liquidity
              </Text>
              <StyledInput
                placeholder="Ex: 50%"
                value={formik.values.liquidity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.liquidity}
                id={FieldNames.liquidity}
                type="number"
                isWarning={formik.touched.liquidity && !!formik.errors.liquidity}
              />
              <Caption color={formik.touched.liquidity && !!formik.errors.liquidity ? 'failure' : 'textDisabled'}>
                {formik.touched.liquidity && formik.errors.liquidity
                  ? formik.errors.liquidity
                  : 'Enter the percentage of raised funds that should be allocated to Liquidity on Pancakeswap (Min 25%, Max 100%)'}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Router Listing Rate
              </Text>
              <StyledInput
                placeholder="Ex: 1100"
                value={formik.values.listingRate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.listingRate}
                id={FieldNames.listingRate}
                type="number"
                isWarning={formik.touched.listingRate && !!formik.errors.listingRate}
              />
              <Caption color={formik.touched.listingRate && !!formik.errors.listingRate ? 'failure' : 'textDisabled'}>
                {formik.touched.listingRate && formik.errors.listingRate
                  ? formik.errors.listingRate
                  : ' If I spend 1 BNB on Summitswap how many tokens will I receive? (1 BNB = 0 CTK)'}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>
      {Number(formik.values.listingChoice) !== RADIO_VALUES.LISTING_PS_100 && (
        <GridContainer marginTop="40px">
          <ItemIconCard>
            <BoxPairIcon width="35px">
              <PairCoinsIcon width="100%" />
            </BoxPairIcon>
          </ItemIconCard>
          <Box>
            <Heading color="primary">Router Token Pairing</Heading>
            <Text small marginTop="4px">
              Choose Router Token Pairing
            </Text>
            <Flex
              marginTop="12px"
              maxWidth="180px"
              flexWrap="wrap"
              justifyContent="space-between"
              onChange={formik.handleChange}
            >
              {Object.keys(TOKEN_CHOICES)
                .filter((key) => key !== 'USDT')
                .map((key) => (
                  <RowFixed marginBottom="4px" marginRight="4px" key={key}>
                    <Box>
                      <Radio
                        scale="sm"
                        name={FieldNames.listingToken}
                        value={TOKEN_CHOICES[key]}
                        checked={formik.values.listingToken === TOKEN_CHOICES[key]}
                      />
                    </Box>
                    <label htmlFor={key}>
                      <Text
                        color={formik.values.listingToken === TOKEN_CHOICES[key] ? 'linkColor' : ''}
                        marginLeft="8px"
                      >
                        {key}
                      </Text>
                    </label>
                  </RowFixed>
                ))}
            </Flex>
            <Caption color="textDisabled">
              You will have the pair of&nbsp;
              <Caption bold color="primary">
                STN-{Object.keys(TOKEN_CHOICES).find((key) => TOKEN_CHOICES[key] === formik.values.listingToken)}&nbsp;
              </Caption>
              in
              <Caption bold color="primary">
                &nbsp;SummitSwap
              </Caption>
            </Caption>
          </Box>
        </GridContainer>
      )}

      <ButtonsWrapper>
        <Button variant="secondary" onClick={() => changeStepNumber(1)}>
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
        <Button disabled={!isStepValid} onClick={() => changeStepNumber(3)}>
          Continue
        </Button>
      </ButtonsWrapper>
    </>
  )
}

export default CreationStep03
