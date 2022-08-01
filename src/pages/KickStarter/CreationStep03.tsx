import { ArrowForwardIcon, Button, Flex, Heading, ImageAddIcon, Input, Text, TextArea } from '@koda-finance/summitswap-uikit'
import CopyButton from 'components/CopyButton'
import React from 'react'
import styled from 'styled-components'
import FundingInput from './FundingInput'
import { ProjectCreation } from './types'

const ImageWrapper = styled(Flex)`
  width: 270px;
  height: 230px;
  border: 3px dashed ${({ theme }) => theme.colors.menuItemActiveBackground};
  border-radius: 8px;
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
`

type Props = {
  setCurrentCreationStep: (step: number) => void
  projectCreation: ProjectCreation
}

function CreationStep03({
  setCurrentCreationStep,
  projectCreation,
}: Props) {

  return (
    <Flex flexDirection="column">
      <Heading size="lg" color="menuItemActiveBackground" marginBottom="24px">Project Details</Heading>
      <Flex style={{ columnGap: '32px' }} marginBottom="16px">
        <ImageWrapper flexDirection="column" alignItems="center" justifyContent="center">
          <ImageAddIcon width={60} marginBottom="8px" color="menuItemActiveBackground" />
          <Text color="menuItemActiveBackground" style={{ maxWidth: '150px' }} textAlign="center">
            Upload Your Project Picture
          </Text>
        </ImageWrapper>
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
          <Flex>
            <Flex flexDirection="column" marginRight="auto">
              <Text color="textSubtle" marginBottom="4px">
                Project Goals
              </Text>
              <Text>{projectCreation.goals}</Text>
            </Flex>
            <Flex flexDirection="column" marginRight="auto">
              <Text color="textSubtle" marginBottom="4px">
                Minimum Backing
              </Text>
              <Text>{projectCreation.minimumBacking}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Heading size="lg" color="menuItemActiveBackground">Fund &amp; Reward System</Heading>
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
        <Flex>
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
        </Flex>
        <Flex justifyContent="space-between">
          <Button
            variant="secondary"
            marginTop="32px"
            onClick={() => setCurrentCreationStep(1)}
          >
            Re-edit Project
          </Button>
          <Button
            variant="primary"
            marginTop="32px"
          >
            Create New Project
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CreationStep03
