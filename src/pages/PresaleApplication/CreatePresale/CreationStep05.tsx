/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import styled from 'styled-components'
import {
  Button,
  Flex,
  Text,
  DetailIcon,
  ImageIcon,
  SocialGroupIcon,
  Select,
  darkColors,
} from '@koda-finance/summitswap-uikit'
import { RowBetween } from 'components/Row'
import { ItemIconCard, IconBox, GridContainer, GridItem1, GridItem2 } from './GridComponents'
import StyledInput, { StyledInputWrapper } from './StyledInput'
import { Caption, Heading } from '../Texts'

interface Props {
  changeStepNumber: (num: number) => void
}

const StyledSelect = styled(Select)`
  & :first-child {
    padding: 10px 16px;
    gap: 10px;
    width: 400px;
    height: 44px;
    background: ${({ theme }) => theme.colors.sidebarBackground};
    border-radius: 16px;
    font-size: 16px;
    margin: 4px 0;
    @media (max-width: 620px) {
      width: 300px;
    }
    @media (max-width: 480px) {
      width: 100%;
    }
  }
`

const CreationStep05 = ({ changeStepNumber }: Props) => {
  return (
    <>
      <GridContainer>
        <ItemIconCard>
          <IconBox width="56px">
            <ImageIcon width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Presale Logo</Heading>
          <Text small marginTop="4px">
            Add logo to be more intriguing
          </Text>
        </GridItem1>
        <GridItem2>
          <Text small marginTop="8px">
            Enter Logo URL
          </Text>
          <StyledInput placeholder="e.g. https://www.google.com/1234.jpg" />
          <Caption color="textDisabled">
            Image should be 100x100, and URL must be hosted and shoul end with a supported image extension png, jpg,
            jpeg or gif.
          </Caption>
        </GridItem2>
      </GridContainer>

      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox width="56px">
            <DetailIcon width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Project Presale Details</Heading>
          <Text small marginTop="4px">
            Add your contact information for easier communication
          </Text>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Text small marginTop="8px">
                Project Name
              </Text>
              <StyledInput placeholder="Enter your project presale name" />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Contact Name
              </Text>
              <StyledInput placeholder="e.g. John Doe" />
            </StyledInputWrapper>
          </Flex>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Text small marginTop="8px">
                Contact Position
              </Text>
              <StyledInput placeholder="e.g. Manager" />
            </StyledInputWrapper>
            <StyledInputWrapper>
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
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>

      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox width="56px">
            <SocialGroupIcon width="100%" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Contact Information</Heading>
          <Text small marginTop="4px">
            Add your contact information for easier communication
          </Text>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Text small marginTop="8px">
                Telegram ID
              </Text>
              <StyledInput placeholder="Ex: https://telegram.me..." />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Discord ID
                <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                  &nbsp;(optional)
                </Text>
              </Text>
              <StyledInput placeholder="Ex: https://discord.me..." />
            </StyledInputWrapper>
          </Flex>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Text small marginTop="8px">
                E-mail address
                <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                  &nbsp;(optional)
                </Text>
              </Text>
              <StyledInput placeholder="e.g. summitswap@domain.com" />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Twitter Username
                <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                  &nbsp;(optional)
                </Text>
              </Text>
              <StyledInput placeholder="Ex: https://twitter.me..." />
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>

      <RowBetween marginTop="50px" marginBottom="15px">
        <Button variant="secondary" onClick={() => changeStepNumber(3)}>
          Previous Step
        </Button>
        <Button onClick={() => changeStepNumber(5)}>Continue</Button>
      </RowBetween>
    </>
  )
}

export default CreationStep05
