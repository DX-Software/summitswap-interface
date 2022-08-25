import { BinanceIcon, Button, Flex, Heading, Text } from '@koda-finance/summitswap-uikit'
import CopyButton from 'components/CopyButton'
import { useKickstarterContext } from 'contexts/kickstarter'
import React from 'react'
import styled from 'styled-components'
import { Project } from './types'

const ImageAndDescriptionWrapper = styled(Flex)`
  column-gap: 32px;
  row-gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Banner = styled(Flex)`
  width: 270px;
  height: 230px;
  border-radius: 8px;
  background-color: gray;
  @media (max-width: 576px) {
    width: 100%;
  }
`

const ImgAccount = styled.div`
  width: 72px;
  height: 72px;
  background: gray;
  border-radius: 50%;
`

const AccountWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.inputColor};
  border-radius: 8px;
  padding: 16px;
  column-gap: 16px;
  margin-right: auto;
  width: 320px;

  @media (max-width: 576px) {
    width: 100%;
  }
`

const CriteriaWrapper = styled(Flex)`
  row-gap: 16px;
  @media (max-width: 576px) {
    flex-direction: column;
  }
`

const EstimationWrapper = styled(Flex)`
  flex: 1;
  column-gap: 32px;
  row-gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`

const ButtonWrapper = styled(Flex)`
  justify-content: space-between;
  row-gap: 16px;
  @media (max-width: 576px) {
    flex-direction: column-reverse;
  }
`

function CreationStep03() {
  const { projectCreation, handleCurrentCreationStepChanged } = useKickstarterContext()

  return (
    <Flex flexDirection="column">
      <Heading size="lg" color="menuItemActiveBackground" marginBottom="24px">Project Details</Heading>
      <ImageAndDescriptionWrapper marginBottom="16px">
        <Banner />
        <Flex flexDirection="column" flex={1}>
          <Text color="textSubtle" marginBottom="4px">
            Project Title
          </Text>
          <Text>Summit Swap #1 Project</Text>
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Creator
          </Text>
          <Text>SUMMITSWAP</Text>
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Description
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Non nibh a, commodo aliquam nullam pharetra viverra.
            Etiam odio aliquam quis lacus, justo, aliquam molestie suspendisse tempus.
          </Text>
          <br />
          <CriteriaWrapper>
            <Flex flexDirection="column" marginRight="auto">
              <Text color="textSubtle" marginBottom="4px">
                Project Goals
              </Text>
              <Flex style={{ columnGap: "8px" }}>
                <BinanceIcon width="20px" />
                <Text>{projectCreation.goals}</Text>
              </Flex>
            </Flex>
            <Flex flexDirection="column" marginRight="auto">
              <Text color="textSubtle" marginBottom="4px">
                Minimum Backing
              </Text>
              <Flex style={{ columnGap: "8px" }}>
                <BinanceIcon width="20px" />
                <Text>{projectCreation.minimumBacking}</Text>
              </Flex>
            </Flex>
          </CriteriaWrapper>
        </Flex>
      </ImageAndDescriptionWrapper>
      <Heading size="lg" color="menuItemActiveBackground" marginY="16px">Fund &amp; Reward System</Heading>
      <Flex flexDirection="column">
        <Text marginBottom="8px">Funding Account</Text>
        <AccountWrapper marginBottom="24px">
          <ImgAccount />
          <Flex flexDirection="column" marginRight="auto">
            <Text color="textSubtle" fontSize="12px">METAMASK</Text>
            <Text fontWeight="bold" marginBottom="4px">Account 1A</Text>
            <Flex style={{ columnGap: "4px" }} position="relative">
              <Text fontSize="12px">0x465...bA7</Text>
              <CopyButton
                color="success"
                text="Copied"
                tooltipMessage="Copied"
                tooltipTop={-40}
                tooltipRight={-25}
                width="16px"
              />
            </Flex>
          </Flex>
        </AccountWrapper>
        <Text color="textSubtle" marginBottom="4px">Reward Description</Text>
        <Text marginBottom="24px">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non nibh a, commodo aliquam nullam pharetra viverra.
          Etiam odio aliquam quis lacus, justo, aliquam molestie suspendisse tempus.
        </Text>
        <EstimationWrapper>
          <Flex flexDirection="column" marginRight="auto">
            <Text color="textSubtle" marginBottom="4px">
              Project Due Date
            </Text>
            <Text>Tuesday, July 26th 2022</Text>
          </Flex>
          <Flex flexDirection="column" marginRight="auto">
            <Text color="textSubtle" marginBottom="4px">
              Reward Distribution
            </Text>
            <Text>Tuesday, July 26th 2022</Text>
          </Flex>
        </EstimationWrapper>
        <ButtonWrapper>
          <Button variant="secondary" onClick={() => handleCurrentCreationStepChanged(1)}>
            Re-edit Project
          </Button>
          <Button variant="primary">
            Create New Project
          </Button>
        </ButtonWrapper>
      </Flex>
    </Flex>
  )
}

export default CreationStep03
