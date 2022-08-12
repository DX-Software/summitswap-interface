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
  DetailIcon,
  ImageIcon,
  SocialGroupIcon,
  Select,
  darkColors,
} from '@koda-finance/summitswap-uikit'
import { IconCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { Caption } from './CreationStep01'

interface Props {
  changeStepNumber: (num: number) => void
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

const StyledSelect = styled(Select)`
  & :first-child {
    padding: 10px 16px;
    gap: 10px;
    width: 380px;
    height: 44px;
    background: ${({ theme }) => theme.colors.sidebarBackground};
    border-radius: 16px;
    font-size: 16px;
    margin: 4px 0;
  }
`

const CreationStep05 = ({ changeStepNumber }: Props) => {
  return (
    <>
      <Flex>
        <IconCard>
          <Box width="56px">
            <ImageIcon width="100%" />
          </Box>
        </IconCard>
        <Box marginLeft="26px">
          <Heading color="primary">Presale Logo</Heading>
          <Text small marginTop="4px">
            Add logo to be more intriguing
          </Text>
          <Text small marginTop="8px">
            Enter Logo URL
          </Text>
          <StyledInput placeholder="e.g. https://www.google.com/1234.jpg" />
          <Caption color="textDisabled">
            Image should be 100x100, and URL must be hosted and shoul end with a supported image extension png, jpg,
            jpeg or gif.
          </Caption>
        </Box>
      </Flex>

      <Flex marginTop="40px">
        <IconCard>
          <Box width="56px">
            <DetailIcon width="100%" />
          </Box>
        </IconCard>
        <Box marginLeft="26px">
          <Heading color="primary">Project Presale Details</Heading>
          <Text small marginTop="4px">
            Add your contact information for easier communication
          </Text>
          <Flex flexWrap="wrap">
            <Box marginRight="16px">
              <Text small marginTop="8px">
                Project Name
              </Text>
              <StyledInput placeholder="Enter your project presale name" />
            </Box>
            <Box>
              <Text small marginTop="8px">
                Contact Name
              </Text>
              <StyledInput placeholder="e.g. John Doe" />
            </Box>
          </Flex>
          <Flex flexWrap="wrap">
            <Box marginRight="16px">
              <Text small marginTop="8px">
                Contact Position
              </Text>
              <StyledInput placeholder="e.g. Manager" />
            </Box>
            <Box>
              <Text small marginTop="8px">
                Chosen Contact Method
              </Text>
              <StyledSelect
                options={[
                  {
                    label: 'Option 1',
                    value: 'option-1',
                  },
                ]}
              />
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Flex marginTop="40px">
        <IconCard>
          <Box width="56px">
            <SocialGroupIcon width="100%" />
          </Box>
        </IconCard>
        <Box marginLeft="26px">
          <Heading color="primary">Contact Information</Heading>
          <Text small marginTop="4px">
            Add your contact information for easier communication
          </Text>
          <Flex flexWrap="wrap">
            <Box marginRight="16px">
              <Text small marginTop="8px">
                Telegram ID
              </Text>
              <StyledInput placeholder="Ex: https://telegram.me..." />
            </Box>
            <Box>
              <Text small marginTop="8px">
                Discord ID
                <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                  &nbsp;(optional)
                </Text>
              </Text>
              <StyledInput placeholder="Ex: https://discord.me..." />
            </Box>
          </Flex>
          <Flex flexWrap="wrap">
            <Box marginRight="16px">
              <Text small marginTop="8px">
                E-mail address
                <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                  &nbsp;(optional)
                </Text>
              </Text>
              <StyledInput placeholder="e.g. summitswap@domain.com" />
            </Box>
            <Box>
              <Text small marginTop="8px">
                Twitter Username
                <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                  &nbsp;(optional)
                </Text>
              </Text>
              <StyledInput placeholder="Ex: https://twitter.me..." />
            </Box>
          </Flex>
        </Box>
      </Flex>

      <RowBetween marginTop="50px" marginBottom="15px">
        <Button variant="secondary" onClick={() => changeStepNumber(5)}>
          Previous Step
        </Button>
        <Button onClick={() => changeStepNumber(3)}>Continue</Button>
      </RowBetween>
    </>
  )
}

export default CreationStep05
