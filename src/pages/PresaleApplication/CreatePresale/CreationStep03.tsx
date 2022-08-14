/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
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
import { TOKEN_CHOICES } from 'constants/presale'
import { RowBetween, RowFixed } from 'components/Row'
import { ItemIconCard, IconBox, GridContainer, GridItem1, GridItem2 } from './GridComponents'
import StyledInput, { StyledInputWrapper } from './StyledInput'
import { Caption, Heading } from '../Texts'

interface Props {
  changeStepNumber: (num: number) => void
}

const BoxPairIcon = styled(Box)`
  width: 36px;
  @media (max-width: 480px) {
    width: 19px;
  }
`

const CreationStep03 = ({ changeStepNumber }: Props) => {
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
            <Box marginTop="16px">
              <RowFixed marginBottom="8px">
                <Box>
                  <Radio defaultChecked id="refund" scale="sm" />
                </Box>
                <label htmlFor="refund">
                  <Text color="linkColor" marginLeft="8px">
                    Refund
                  </Text>
                  <Caption marginX="8px" color="textDisabled">
                    Refund remaining presale Token after finalizing
                  </Caption>
                </label>
              </RowFixed>
              <RowFixed>
                <Box>
                  <Radio id="burn" scale="sm" />
                </Box>
                <label htmlFor="burn">
                  <Text marginLeft="8px">Burn</Text>
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
            <Box marginTop="16px">
              <RowFixed marginBottom="8px">
                <Box>
                  <Radio defaultChecked id="summitswap" scale="sm" />
                </Box>
                <label htmlFor="summitswap">
                  <Text color="linkColor" marginLeft="8px">
                    SummitSwap (SS)
                  </Text>
                </label>
              </RowFixed>
              <RowFixed>
                <Box>
                  <Radio id="pancakeswap" scale="sm" />
                </Box>
                <label htmlFor="pancakeswap">
                  <Text marginLeft="8px">PancakeSwap (PS)</Text>
                </label>
              </RowFixed>
              <RowFixed>
                <Box>
                  <Radio id="both" scale="sm" />
                </Box>
                <label htmlFor="both">
                  <Text marginLeft="8px">Both</Text>
                  <Caption marginLeft="8px" color="textDisabled">
                    This will be listed to 75% PS and 25% SS
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
              <StyledInput placeholder="Ex: 50%" />
              <Caption color="textDisabled">
                Enter the percentage of raised funds that should be allocated to Liquidity on Pancakeswap (Min 51%, Max
                100%)
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Router Listing Rate
              </Text>
              <StyledInput placeholder="Ex: 1100" />
              <Caption color="textDisabled">
                If I spend 1 BNB on Pancakeswap how many tokens will I receive? (1 BNB = 0 CTK)
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>
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
          <Flex marginTop="12px" maxWidth="180px" flexWrap="wrap" justifyContent="space-between">
            {Object.keys(TOKEN_CHOICES)
              .filter((key) => key !== 'USDT')
              .map((key) => (
                <RowFixed marginBottom="4px" marginRight="4px" key={key}>
                  <Box>
                    <Radio id={key} scale="sm" />
                  </Box>
                  <label htmlFor={key}>
                    <Text color="linkColor" marginLeft="8px">
                      {key}
                    </Text>
                  </label>
                </RowFixed>
              ))}
          </Flex>
          <Caption color="textDisabled">
            You will have the pair of&nbsp;
            <Caption bold color="primary">
              STN-BNB&nbsp;
            </Caption>
            in
            <Caption bold color="primary">
              &nbsp;SummitSwap
            </Caption>
          </Caption>
        </Box>
      </GridContainer>

      <RowBetween marginTop="50px" marginBottom="15px">
        <Button variant="secondary" onClick={() => changeStepNumber(1)}>
          Previous Step
        </Button>
        <Button onClick={() => changeStepNumber(3)}>Continue</Button>
      </RowBetween>
    </>
  )
}

export default CreationStep03
