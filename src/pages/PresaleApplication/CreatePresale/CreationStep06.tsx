/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import styled from 'styled-components'
import { Box, Button, Flex, Heading, Text } from '@koda-finance/summitswap-uikit'
import ButtonsWrapper from './ButtonsWrapper'
import { GridContainer as Grid, GridItem1, GridItem2 } from './GridComponents'

interface Props {
  currency: string
  changeStepNumber: (num: number) => void
}

const GridContainer = styled(Grid)`
  grid-template-columns: 160px auto;
`

const StyledImage = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 8px;
  grid-area: icon;
`

export const Divider = styled.div`
  width: 90%;
  max-width: 950px;
  height: 0px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.backgroundDisabled};
  margin-bottom: 25px;
`

const CreationStep06 = ({ currency, changeStepNumber }: Props) => {
  return (
    <>
      <Heading size="lg" color="success">
        Token Information
      </Heading>
      <GridContainer marginTop="16px" marginBottom="45px">
        <StyledImage src="https://via.placeholder.com/150x150" alt="presale-icon" />
        <GridItem1 style={{ alignSelf: 'end' }}>
          <GridContainer>
            <Text>Token Address</Text>
            <Text color="sidebarActiveColor">0xa2f96ef6ed3d67a0352e659b1e980f13e098619f</Text>
          </GridContainer>
        </GridItem1>

        <GridItem2>
          <GridContainer>
            <Text>Token Name</Text>
            <Text>SUMMITOKEN</Text>
          </GridContainer>
          <GridContainer>
            <Text>Symbols</Text>
            <Text>STN</Text>
          </GridContainer>
          <GridContainer>
            <Text>Decimals</Text>
            <Text>18</Text>
          </GridContainer>
          <GridContainer>
            <Text>Token Supply</Text>
            <Text>1,000,000</Text>
          </GridContainer>
          <GridContainer>
            <Text bold>Presale Currency</Text>
            <Text bold>{currency}</Text>
          </GridContainer>
        </GridItem2>
      </GridContainer>
      <Divider style={{ width: '100%' }} />
      <Heading marginTop="24px" size="lg" color="success">
        Presale System
      </Heading>
      <Flex marginTop="16px" justifyContent="space-between">
        <Box>
          <Box>
            <Text bold color="primaryDark">
              Presale Rate & Whitelist
            </Text>
            <GridContainer marginTop="4px">
              <Text>Presale rate</Text>
              <Text>1000 STN / 1 BNB</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Whitelist system</Text>
              <Text>Enabled</Text>
            </GridContainer>
          </Box>
          <Box marginTop="16px">
            <Text bold color="primaryDark">
              Presale Goal
            </Text>
            <GridContainer marginTop="4px">
              <Text>Softcap</Text>
              <Text>20 BNB</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Hardcap</Text>
              <Text>20 BNB</Text>
            </GridContainer>
          </Box>
          <Box marginTop="16px">
            <Text bold color="primaryDark">
              Presale Purchasing & Refund
            </Text>
            <GridContainer marginTop="4px">
              <Text>Minimum Buy</Text>
              <Text>5 BNB</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Maximum Buy</Text>
              <Text>10 BNB</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Refund System </Text>
              <Text>Refund</Text>
            </GridContainer>
          </Box>
        </Box>

        <Box marginRight="10%">
          <Box>
            <Text bold color="primaryDark">
              Liquidity & Listing
            </Text>
            <GridContainer marginTop="4px">
              <Text>Router</Text>
              <Text>PancakeSwap</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Token Pairing</Text>
              <Text>STN-BNB</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Router Liquidity</Text>
              <Text>55%</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Router Listing Rate</Text>
              <Text>800 STN / 1 BNB</Text>
            </GridContainer>
          </Box>

          <Box marginTop="16px">
            <Text bold color="primaryDark">
              Vesting System
            </Text>
            <GridContainer marginTop="4px">
              <Text>Vesting System</Text>
              <Text>On</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Vesting Percentage</Text>
              <Text>10%</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Interval Day</Text>
              <Text>Day 5</Text>
            </GridContainer>
            <GridContainer marginTop="4px">
              <Text>Interval Time (UTC)</Text>
              <Text>07:00 UTC</Text>
            </GridContainer>
          </Box>
        </Box>
      </Flex>
      <Box marginTop="16px" marginBottom="25px">
        <Text bold color="primaryDark">
          Presale Start & End
        </Text>
        <GridContainer marginTop="4px">
          <Text>Start Time</Text>
          <Text>Thu, July 28th 2022 19:00 UTC</Text>
        </GridContainer>
        <GridContainer marginTop="4px">
          <Text>End Time</Text>
          <Text>Wed, August 10th 2022 19:00 UTC</Text>
        </GridContainer>
        <GridContainer marginTop="4px">
          <Text>Liquidity Lockup</Text>
          <Text>3,600 minutes</Text>
        </GridContainer>
      </Box>
      <Divider style={{ width: '100%' }} />
      <Heading marginTop="24px" size="lg" color="success">
        Additional Information
      </Heading>
      <Box>
        <Box marginTop="16px">
          <Text bold color="primaryDark">
            Contact Information
          </Text>
          <GridContainer style={{ gridTemplateColumns: '225px auto' }} marginTop="4px">
            <Text>Project Name</Text>
            <Text>SUMMITSWAP PRESALE TOKEN V1</Text>
          </GridContainer>
          <GridContainer style={{ gridTemplateColumns: '225px auto' }} marginTop="4px">
            <Text>Contact Name</Text>
            <Text>SUMMITSWAP</Text>
          </GridContainer>
          <GridContainer style={{ gridTemplateColumns: '225px auto' }} marginTop="4px">
            <Text>Contact Position</Text>
            <Text>Director of SummitSwap</Text>
          </GridContainer>
          <GridContainer style={{ gridTemplateColumns: '225px auto' }} marginTop="4px">
            <Text>Chosen Contact Method</Text>
            <Text>Telegram</Text>
          </GridContainer>
        </Box>
        <Box marginTop="16px">
          <Text bold color="primaryDark">
            Project Presale Details
          </Text>
          <GridContainer style={{ gridTemplateColumns: '225px auto' }} marginTop="4px">
            <Text>Telegram ID</Text>
            <Text>summitswap</Text>
          </GridContainer>
          <GridContainer style={{ gridTemplateColumns: '225px auto' }} marginTop="4px">
            <Text>Discord ID (optional)</Text>
            <Text>summitswap#1234</Text>
          </GridContainer>
          <GridContainer style={{ gridTemplateColumns: '225px auto' }} marginTop="4px">
            <Text>E-mail Address (optional)</Text>
            <Text>-</Text>
          </GridContainer>
          <GridContainer style={{ gridTemplateColumns: '225px auto' }} marginTop="4px">
            <Text>Twitter Username (optional)</Text>
            <Text>-</Text>
          </GridContainer>
        </Box>
      </Box>
      <ButtonsWrapper>
        <Button variant="secondary" onClick={() => changeStepNumber(1)}>
          Previous Step
        </Button>
        {/* {formik.errors.tokenAmount ? (
          <Text bold marginY="20px" color="failure">
            {formik.errors.tokenAmount}
          </Text>
        ) : (
          <Text bold marginY="20px" color="success">
            {formik.values.tokenAmount ? `${formik.values.tokenAmount.toFixed(2)} Presale Tokens` : ''}
          </Text>
        )} */}
        <Button onClick={() => changeStepNumber(3)}>Continue</Button>
      </ButtonsWrapper>
    </>
  )
}

export default CreationStep06
