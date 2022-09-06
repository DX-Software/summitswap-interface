import { ArrowForwardIcon, Button, Flex, ImageAddIcon, Input, Text, TextArea } from '@koda-finance/summitswap-uikit'
import { useKickstarterContext } from 'pages/KickStarter/contexts/kickstarter'
import React, { useCallback, useMemo, useRef } from 'react'
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
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`

const ImagePlaceholderWrapper = styled(Flex)`
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

function CreationStep01() {
  const { projectCreation, handleOnProjectCreationChanged, handleCurrentCreationStepChanged } = useKickstarterContext()
  const inputFileElement = useRef<HTMLInputElement>(null)

  const hasValidInput = useMemo<boolean>(() => {
    return !!(
      projectCreation.image &&
      projectCreation.title &&
      projectCreation.creator &&
      projectCreation.projectDescription &&
      projectCreation.goals &&
      Number(projectCreation.goals) > 0 &&
      projectCreation.minimumBacking &&
      Number(projectCreation.minimumBacking) > 0
    )
  }, [
    projectCreation.image,
    projectCreation.title,
    projectCreation.creator,
    projectCreation.projectDescription,
    projectCreation.goals,
    projectCreation.minimumBacking
  ])

  const handleOnTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleOnProjectCreationChanged({ title: event.target.value })
  }, [handleOnProjectCreationChanged])

  const handleOnCreatorChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleOnProjectCreationChanged({ creator: event.target.value })
  }, [handleOnProjectCreationChanged])

  const handleOnProjectDescriptionChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleOnProjectCreationChanged({ projectDescription: event.target.value })
  }, [handleOnProjectCreationChanged])

  const handleProjectGoalsChanged = useCallback((value: string) => {
    if ((value !== "" && value.match("^[0-9]{0,9}(\\.[0-9]{0,18})?$") == null)) return
    handleOnProjectCreationChanged({ goals: value })
  }, [handleOnProjectCreationChanged])

  const handleMinimumBackingChanged = useCallback((value: string) => {
    if ((value !== "" && value.match("^[0-9]{0,9}(\\.[0-9]{0,18})?$") == null)) return
    handleOnProjectCreationChanged({ minimumBacking: value })
  }, [handleOnProjectCreationChanged])

  const handleChooseImage = () => {
    inputFileElement.current?.click()
  }

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    handleOnProjectCreationChanged({ image: event.target.files[0] })
  }

  return (
    <Flex flexDirection="column">
      <ImageAndDescriptionWrapper marginBottom="16px">
        {projectCreation.image ? (
          <ImageWrapper onClick={handleChooseImage}>
            <img src={URL.createObjectURL(projectCreation.image)} alt="Kickstarter" />
          </ImageWrapper>
        ): (
          <ImagePlaceholderWrapper
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            style={{ cursor: "pointer" }}
            onClick={handleChooseImage}>
            <ImageAddIcon width={60} marginBottom="8px" color="menuItemActiveBackground" />
            <Text color="menuItemActiveBackground" style={{ maxWidth: '150px' }} textAlign="center">
              Upload Your Project Picture
            </Text>
          </ImagePlaceholderWrapper>
        )}
        <input
          ref={inputFileElement}
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageSelected}
          style={{ display: "none" }}
        />
        <InputWrapper flexDirection="column">
          <Text color="textSubtle" marginBottom="4px">
            Project Title
          </Text>
          <Input
            placeholder="Enter your project title"
            value={projectCreation.title}
            onChange={handleOnTitleChange}
          />
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Creator
          </Text>
          <Input placeholder="Enter your name" value={projectCreation.creator} onChange={handleOnCreatorChange} />
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Description
          </Text>
          <TextArea placeholder="Write something about your project" onChange={handleOnProjectDescriptionChange}>
            {projectCreation.projectDescription}
          </TextArea>
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
        onClick={() => handleCurrentCreationStepChanged(2)}
        disabled={!hasValidInput}
      >
        Next Step
      </ButtonNext>
    </Flex>
  )
}

export default CreationStep01
