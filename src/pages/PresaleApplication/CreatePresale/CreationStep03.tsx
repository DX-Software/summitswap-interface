/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Input,
  Radio,
  PairCoinsIcon,
  ShopIcon,
  RefundIcon,
  RouterIcon,
} from '@koda-finance/summitswap-uikit'
import { TOKEN_CHOICES } from 'constants/presale'
import { RowBetween, RowFixed } from 'components/Row'
import { ItemIconCard } from './GridComponents'
import StyledInput from './StyledInput'
import { Caption } from '../Texts'

interface Props {
  changeStepNumber: (num: number) => void
}

const CreationStep03 = ({ changeStepNumber }: Props) => {
  return (
    <>
      <RowBetween>
        <Flex>
          <ItemIconCard>
            <Box width="56px">
              <RefundIcon width="100%" />
            </Box>
          </ItemIconCard>
          <Box marginLeft="26px" marginTop="8px">
            <Heading color="primary">Refund System</Heading>
            <Text small marginTop="4px">
              What is and about refund
            </Text>
            <Box marginTop="16px">
              <RowFixed marginBottom="8px">
                <Radio defaultChecked id="refund" scale="sm" />
                <label htmlFor="refund">
                  <Text color="linkColor" marginLeft="8px">
                    Refund
                  </Text>
                  <Caption marginLeft="8px" color="textDisabled">
                    Refund remaining presale Token after finalizing
                  </Caption>
                </label>
              </RowFixed>
              <RowFixed>
                <Radio id="burn" scale="sm" />
                <label htmlFor="burn">
                  <Text marginLeft="8px">Burn</Text>
                  <Caption marginLeft="8px" color="textDisabled">
                    Burn remaining presale Token after finalizing
                  </Caption>
                </label>
              </RowFixed>
            </Box>
          </Box>
        </Flex>
        <Flex>
          <ItemIconCard>
            <Box width="56px">
              <RouterIcon width="100%" />
            </Box>
          </ItemIconCard>
          <Box marginLeft="26px" marginTop="8px">
            <Heading color="primary">Choose Router</Heading>
            <Text small marginTop="4px">
              To determine Liquidity & Listing Rate
            </Text>
            <Box marginTop="16px">
              <RowFixed marginBottom="8px">
                <Radio defaultChecked id="summitswap" scale="sm" />
                <label htmlFor="summitswap">
                  <Text color="linkColor" marginLeft="8px">
                    SummitSwap (SS)
                  </Text>
                </label>
              </RowFixed>
              <RowFixed>
                <Radio id="pancakeswap" scale="sm" />
                <label htmlFor="pancakeswap">
                  <Text marginLeft="8px">PancakeSwap (PS)</Text>
                </label>
              </RowFixed>
              <RowFixed>
                <Radio id="both" scale="sm" />
                <label htmlFor="both">
                  <Text marginLeft="8px">Both</Text>
                  <Caption marginLeft="8px" color="textDisabled">
                    This will be listed to 75% PS and 25% SS
                  </Caption>
                </label>
              </RowFixed>
            </Box>
          </Box>
        </Flex>
      </RowBetween>

      <Flex marginTop="40px">
        <ItemIconCard>
          <Box width="56px">
            <ShopIcon width="100%" />
          </Box>
        </ItemIconCard>
        <Box width="88%" marginLeft="26px">
          <Heading color="primary">Liquidity & Listing Rate</Heading>
          <Text small marginTop="4px">
            What is Liquidity & Listing Rate
          </Text>
          <Flex width="100%" justifyContent="space-between">
            <Box width="380px">
              <Text small marginTop="8px">
                Router Liquidity
              </Text>
              <StyledInput placeholder="Ex: 0%" />
              <Caption color="textDisabled">
                Enter the percentage of raised funds that should be allocated to Liquidity on Summitswap (Min 25%, Max
                100%)
              </Caption>
            </Box>
            <Box width="380px">
              <Text small marginTop="8px">
                Router Listing Rate
              </Text>
              <StyledInput placeholder="Ex: 110" />
              <Caption color="textDisabled">
                If I spend 1 BNB on Summitswap how many tokens will I receive? (1 BNB = 0 CTK)
              </Caption>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Flex marginTop="40px">
        <ItemIconCard>
          <Box width="35px">
            <PairCoinsIcon width="100%" />
          </Box>
        </ItemIconCard>
        <Box marginLeft="26px">
          <Heading color="primary">Router Token Pairing</Heading>
          <Text small marginTop="4px">
            Choose Router Token Pairing
          </Text>
          <Flex marginTop="12px" width="180px" flexWrap="wrap" justifyContent="space-between">
            {Object.keys(TOKEN_CHOICES)
              .filter((key) => key !== 'USDT')
              .map((key) => (
                <RowFixed marginBottom="4px" key={key}>
                  <Radio id={key} scale="sm" />
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
      </Flex>

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
