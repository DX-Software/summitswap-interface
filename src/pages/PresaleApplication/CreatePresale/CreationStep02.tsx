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
  Coin2Icon,
  PeopleIcon,
  ChecklistIcon,
  HandCoinIcon,
} from '@koda-finance/summitswap-uikit'
import { IconCard } from 'components/Card'
import { RowBetween, RowFixed } from 'components/Row'
import { Caption } from './CreationStep01'

interface Props {
  changeStepNumber: (num: number) => void
  currency: string
}

const StyledInput = styled(Input)`
  padding: 10px 16px;
  gap: 10px;
  width: 380px;
  height: 44px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
  border-radius: 16px;
  font-size: 16px;
  margin: 4px 0;
`

const CreationStep02 = ({ changeStepNumber, currency }: Props) => {
  return (
    <>
      <Flex>
        <IconCard>
          <Box width="56px">
            <Coin2Icon width="100%" />
          </Box>
        </IconCard>
        <Box marginLeft="26px">
          <Heading fontWeight={700} color="primary">
            Presale Rate
          </Heading>
          <Text small marginTop="4px">
            Set your token price in {currency}
          </Text>
          <Text small marginTop="8px">
            Presale Rate
          </Text>
          <StyledInput placeholder="Ex: 100" />
          <Caption color="textDisabled">If I spend 1 BNB, how many CTK tokens will I receive?</Caption>
        </Box>
      </Flex>
      <Flex marginTop="40px">
        <IconCard>
          <Box width="56px">
            <PeopleIcon width="100%" />
          </Box>
        </IconCard>
        <Box marginLeft="26px" marginTop="8px">
          <Heading fontWeight={700} color="primary">
            Whitelist System
          </Heading>
          <Text small marginTop="4px">
            Whitelist system is where you only permit certain users to participate in your presale{' '}
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
      </Flex>
      <Flex marginTop="40px">
        <IconCard>
          <Box width="56px">
            <ChecklistIcon width="100%" />
          </Box>
        </IconCard>
        <Box marginLeft="26px">
          <Heading fontWeight={700} color="primary">
            Goal System
          </Heading>
          <Text small marginTop="4px">
            Set your softcap and hardcap for this presale
          </Text>
          <Flex>
            <Box marginRight="16px">
              <Text small marginTop="8px">
                Softcap ({currency})
              </Text>
              <StyledInput placeholder="Ex: 7.5" />
            </Box>
            <Box>
              <Text small marginTop="8px">
                Hardcap ({currency})
              </Text>
              <StyledInput placeholder="Ex: 10" />
            </Box>
          </Flex>
          <Caption color="textDisabled">Softcap must be less or equal to 50% of Hardcap!</Caption>
        </Box>
      </Flex>
      <Flex marginTop="40px">
        <IconCard>
          <Box width="56px">
            <HandCoinIcon strokeWidth={0} width="100%" />
          </Box>
        </IconCard>
        <Box marginLeft="26px">
          <Heading fontWeight={700} color="primary">
            Purchasing System
          </Heading>
          <Text small marginTop="4px">
            Each user will only be able to buy the coin with minimum and maximum price as specified
          </Text>
          <Flex>
            <Box marginRight="16px">
              <Text small marginTop="8px">
                Minimum Buy ({currency})
              </Text>
              <StyledInput placeholder="Ex: 0.5" />
            </Box>
            <Box>
              <Text small marginTop="8px">
                Maximum Buy ({currency})
              </Text>
              <StyledInput placeholder="Ex: 6" />
            </Box>
          </Flex>
          <Caption color="textDisabled">Maximum Buy must be less or equal to Hardcap!</Caption>
        </Box>
      </Flex>
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
