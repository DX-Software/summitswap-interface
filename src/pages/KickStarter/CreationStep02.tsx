import { Button, Flex, Text, TextArea } from "@koda-finance/summitswap-uikit"
import CopyButton from "components/CopyButton"
import React, { useCallback } from "react"
import styled from "styled-components"
import FundingInput from "./FundingInput"
import { Project } from "./types"

type Props = {
  setCurrentCreationStep: (step: number) => void
  projectCreation: Project
  handleOnProjectCreationChanged: (newUpdate: { [key: string]: number }) => void
}

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

const EstimationWrapper = styled(Flex)`
  flex: 1;
  column-gap: 32px;
  row-gap: 16px;
  margin-top: 24px;
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

function CreationStep02({setCurrentCreationStep, projectCreation, handleOnProjectCreationChanged}: Props) {

  const handleProjectGoalsChanged = (value: string) => {
    console.log("handleProjectGoalsChanged", value)
  }

  const handleMinimumBackingChanged = (value: string) => {
    console.log("handleMinimumBackingChanged", value)
  }

  return (
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
      <Text color="textSubtle" marginBottom="4px">Project Reward</Text>
      <TextArea placeholder="Describe the reward for this project" />
      <EstimationWrapper>
        <FundingInput
          label="Project Due Date"
          type="datetime-local"
          value={projectCreation.goals.toString()}
          description="NB: Due date should be minimum a week after the project is created"
          onChange={handleProjectGoalsChanged}
        />
        <FundingInput
          label="Reward Distribution"
          type="datetime-local"
          value={projectCreation.minimumBacking.toString()}
          description="NB: Enter the estimate date for the reward distribution"
          onChange={handleMinimumBackingChanged}
        />
      </EstimationWrapper>
      <ButtonWrapper>
        <Button
          variant="secondary"
          onClick={() => setCurrentCreationStep(1)}
        >
          Previous Step
        </Button>
        <Button
          variant="primary"
          onClick={() => setCurrentCreationStep(3)}
        >
          Create New Project
        </Button>
      </ButtonWrapper>
    </Flex>
  )
}

export default CreationStep02
