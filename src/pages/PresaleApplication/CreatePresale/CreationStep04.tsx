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
  ClockIcon,
  CalendarIcon,
  VestingIcon,
  Radio,
} from '@koda-finance/summitswap-uikit'
import { IconCard } from 'components/Card'
import { RowBetween, RowFixed } from 'components/Row'
import { Caption } from '../Texts'

interface Props {
  changeStepNumber: (num: number) => void
}

const StyledInput = styled(Input)<{ forTime?: boolean }>`
  padding: 10px 16px;
  gap: 10px;
  width: ${({ forTime }) => (forTime ? '150px' : '400px')};
  height: 44px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
  border-radius: 16px;
  font-size: 16px;
  margin: 4px 0;
  ::-webkit-calendar-picker-indicator {
    filter: invert(52%) sepia(100%) saturate(1272%) hue-rotate(125deg) brightness(100%) contrast(104%);
    &:hover {
      cursor: pointer;
    }
  }
`

const PlaceholderDiv = styled.div`
  width: 8px;
  height: 114px;
  background: ${({ theme }) => theme.colors.primary};
`

const CreationStep04 = ({ changeStepNumber }: Props) => {
  return (
    <>
      <Flex>
        <IconCard>
          <Box width="56px">
            <CalendarIcon width="100%" />
          </Box>
        </IconCard>
        <Box marginLeft="26px">
          <Heading color="primary">Start & End Time</Heading>
          <Text small marginTop="4px">
            Define start and end time for your presale
          </Text>
          <RowFixed>
            <Box>
              <Text small marginTop="8px">
                Start Date
              </Text>
              <StyledInput type="date" />
            </Box>
            <Box marginLeft="16px">
              <Text small marginTop="8px">
                Start Time (UTC)
              </Text>
              <StyledInput forTime type="time" />
            </Box>
          </RowFixed>
          <RowFixed>
            <Box>
              <Text small marginTop="8px">
                End Date
              </Text>
              <StyledInput type="date" />
            </Box>
            <Box marginLeft="16px">
              <Text small marginTop="8px">
                End Time (UTC)
              </Text>
              <StyledInput forTime type="time" />
            </Box>
          </RowFixed>
        </Box>
      </Flex>
      <Flex marginTop="50px">
        <IconCard>
          <Box width="56px">
            <ClockIcon width="100%" />
          </Box>
        </IconCard>
        <Box marginLeft="26px">
          <Heading color="primary">Liquidity Lockup Time</Heading>
          <Text small marginTop="4px">
            Minimum Liquidity Lockup time should be 5 minutes
          </Text>
          <Text small marginTop="8px">
            Enter Liquidity Lockup
          </Text>
          <StyledInput placeholder="Ex: 100" type="number" />
        </Box>
      </Flex>

      <Flex marginTop="40px">
        <IconCard>
          <Box width="56px">
            <VestingIcon width="100%" />
          </Box>
        </IconCard>
        <Box width="88%" marginLeft="26px">
          <Heading color="primary">What is and about vesting</Heading>

          <Flex marginTop="8px" width="100%" justifyContent="space-between">
            <RowFixed>
              <Radio id="vestingEnabled" scale="sm" />
              <label style={{ width: '350px' }} htmlFor="vestingEnabled">
                <Text marginLeft="8px">Enabled</Text>
                <Caption marginLeft="8px" color="textDisabled">
                  Once presale end, users will be able to claim their token gradually
                </Caption>
              </label>
            </RowFixed>
            <RowFixed>
              <Radio id="vestingDisabled" scale="sm" />
              <label style={{ width: '350px' }} htmlFor="vestingDisabled">
                <Text marginLeft="8px">Disabled</Text>
                <Caption marginLeft="8px" color="textDisabled">
                  Once presale end, users are able to claim all of the their tokens at once
                </Caption>
              </label>
            </RowFixed>
          </Flex>
          <Flex marginTop="8px" alignItems="flex-end">
            <PlaceholderDiv />
            <Flex width="100%" flexDirection="column">
              <Flex marginX="16px" justifyContent="space-between">
                <Box>
                  <Text small marginTop="8px">
                    Vesting Claim Percentage (%){' '}
                  </Text>
                  <StyledInput placeholder="Ex: 100" type="number" />
                </Box>
                <Box>
                  <Text small marginTop="8px">
                    Interval Day
                  </Text>
                  <StyledInput forTime placeholder="Ex: 100" type="number" />
                </Box>
                <Box>
                  <Text small marginTop="8px">
                    Interval Time (UTC)
                  </Text>
                  <StyledInput forTime placeholder="Ex: 100" type="number" />
                </Box>
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
        </Box>
      </Flex>
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
