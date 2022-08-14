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
import { RowBetween, RowFixed } from 'components/Row'
import { ItemIconCard, IconBox, GridContainer, GridItem1, GridItem2 } from './GridComponents'
import StyledInput, { StyledInputWrapper } from './StyledInput'
import { Caption, Heading } from '../Texts'

interface Props {
  changeStepNumber: (num: number) => void
  currency: string
}

const CreationStep02 = ({ changeStepNumber, currency }: Props) => {
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
          <StyledInput placeholder="Ex: 100" />
          <Caption color="textDisabled">If I spend 1 BNB, how many CTK tokens will I receive?</Caption>
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
          <Box marginTop="16px">
            <RowFixed marginBottom="8px">
              <Radio defaultChecked id="enable" scale="sm" />
              <label htmlFor="enable">
                <Text marginLeft="8px">Enable</Text>
              </label>
            </RowFixed>
            <RowFixed>
              <Radio id="disable" scale="sm" />
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
            <Box marginRight="16px">
              <Text small marginTop="8px">
                Softcap ({currency})
              </Text>
              <StyledInput placeholder="Ex: 7.5" />
              <Caption color="textDisabled">Softcap must be less or equal to 50% of Hardcap!</Caption>
            </Box>
            <Box>
              <Text small marginTop="8px">
                Hardcap ({currency})
              </Text>
              <StyledInput placeholder="Ex: 10" />
            </Box>
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
              <StyledInput placeholder="Ex: 0.5" />
              <Caption color="textDisabled">Maximum Buy must be less or equal to Hardcap!</Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Maximum Buy ({currency})
              </Text>
              <StyledInput placeholder="Ex: 6" />
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
