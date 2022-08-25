import { ArrowForwardIcon, Button, Flex, ImageAddIcon, Input, Text, TextArea } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'
import FundingInput from './FundingInput'
import { Project } from './types'

const ImageAndDescriptionWrapper = styled(Flex)`
  column-gap: 32px;
  row-gap: 16px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`

const ImageWrapper = styled(Flex)`
  width: 270px;
  height: 230px;
  border: 3px dashed ${({ theme }) => theme.colors.menuItemActiveBackground};
  border-radius: 8px;

  @media (max-width: 576px) {
    width: 100%;
  }
`

const InputWrapper = styled(Flex)`
  flex: 1;
`

const FundingWrapper = styled(Flex)`
  flex: 1;
  column-gap: 32px;
  row-gap: 16px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`

const ButtonNext = styled(Button)`
  margin-top: 32px;
  @media (min-width: 576px) {
    margin-left: auto;
  }
`

type Props = {
  setCurrentCreationStep: (step: number) => void
  projectCreation: Project
  handleOnProjectCreationChanged: (newUpdate: { [key: string]: number }) => void
}

function CreationStep01({
  setCurrentCreationStep,
  projectCreation,
  handleOnProjectCreationChanged,
}: Props) {
  const handleProjectGoalsChanged = (goals: string) => {
    handleOnProjectCreationChanged({ goals: Number(goals) })
  }

  const handleMinimumBackingChanged = (minimumBacking: string) => {
    handleOnProjectCreationChanged({ minimumBacking: Number(minimumBacking) })
  }

  return (
    <Flex flexDirection="column">
      <ImageAndDescriptionWrapper marginBottom="16px">
        <ImageWrapper flexDirection="column" alignItems="center" justifyContent="center">
          <ImageAddIcon width={60} marginBottom="8px" color="menuItemActiveBackground" />
          <Text color="menuItemActiveBackground" style={{ maxWidth: '150px' }} textAlign="center">
            Upload Your Project Picture
          </Text>
        </ImageWrapper>
        <InputWrapper flexDirection="column">
          <Text color="textSubtle" marginBottom="4px">
            Project Title
          </Text>
          <Input placeholder="Enter your project title" />
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Creator
          </Text>
          <Input placeholder="Enter your name" />
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Description
          </Text>
          <TextArea placeholder="Write something about your project" />
        </InputWrapper>
      </ImageAndDescriptionWrapper>
      <FundingWrapper>
        <FundingInput label="Project Goals" value={projectCreation.goals.toString()} onChange={handleProjectGoalsChanged} />
        <FundingInput
          label="Minimum Backing"
          value={projectCreation.minimumBacking.toString()}
          description="NB : This is the minimum amount for participate in donating the project"
          onChange={handleMinimumBackingChanged}
        />
      </FundingWrapper>
      <ButtonNext
        variant="tertiary"
        endIcon={<ArrowForwardIcon />}
        onClick={() => setCurrentCreationStep(2)}
      >
        Next Step
      </ButtonNext>
    </Flex>
  )
}

export default CreationStep01
