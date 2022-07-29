import { ArrowForwardIcon, Button, Flex, ImageAddIcon, Input, Text, TextArea } from '@koda-finance/summitswap-uikit'
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

const InputWrapper = styled(Flex)`
  flex: 1;
`

const FundingWrapper = styled(Flex)`
  flex: 1;
  column-gap: 32px;
`

type Props = {
  setCurrentCreationStep: (step: number) => void
  projectCreation: ProjectCreation
  handleOnProjectCreationChanged: (newUpdate: { [key: string]: number }) => void
}

function CreationStep01({
  setCurrentCreationStep,
  projectCreation,
  handleOnProjectCreationChanged,
}: Props) {
  const handleProjectGoalsChanged = (goals: number) => {
    handleOnProjectCreationChanged({ goals })
  }

  const handleMinimumBackingChanged = (minimumBacking) => {
    handleOnProjectCreationChanged({ minimumBacking })
  }

  return (
    <Flex flexDirection="column">
      <Flex style={{ columnGap: '32px' }} marginBottom="16px">
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
      </Flex>
      <FundingWrapper>
        <FundingInput label="Project Goals" value={projectCreation.goals} onChange={handleProjectGoalsChanged} />
        <FundingInput
          label="Minimum Backing"
          value={projectCreation.minimumBacking}
          description="NB : This is the minimum amount for participate in donating the project"
          onChange={handleMinimumBackingChanged}
        />
      </FundingWrapper>
      <Button
        variant="tertiary"
        endIcon={<ArrowForwardIcon />}
        marginTop="32px"
        marginLeft="auto"
        onClick={() => setCurrentCreationStep(2)}
      >
        Next Step
      </Button>
    </Flex>
  )
}

export default CreationStep01
