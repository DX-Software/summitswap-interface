/* eslint-disable jsx-a11y/label-has-associated-control */
import { ArrowForwardIcon, Button, Flex, ImageAddIcon, Input, Text, TextArea } from '@koda-finance/summitswap-uikit'
import { FormikProps } from 'formik'
import React, { useCallback, useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { getSymbolByAddress } from 'utils/kickstarter'
import ChoosePaymentToken from '../shared/ChoosePaymentToken'
import FundingInput from '../shared/FundingInput'
import { Project, ProjectFormField } from '../types'

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

type Props = {
  setCurrentCreationStep: React.Dispatch<React.SetStateAction<number>>
  formik: FormikProps<Project>
}

function CreationStep01({ setCurrentCreationStep, formik }: Props) {
  const [isStepValid, setIsStepValid] = useState(false)
  const inputFileElement = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsStepValid(
      !!(
        formik.values.image &&
        formik.values.title &&
        formik.values.creator &&
        formik.values.projectDescription &&
        formik.values.paymentToken &&
        formik.values.projectGoals &&
        Number(formik.values.projectGoals) > 0 &&
        formik.values.minContribution &&
        Number(formik.values.minContribution) > 0
      )
    )
  }, [
    formik.values.image,
    formik.values.title,
    formik.values.creator,
    formik.values.projectDescription,
    formik.values.paymentToken,
    formik.values.projectGoals,
    formik.values.minContribution,
  ])

  const handleChooseImage = () => {
    inputFileElement.current?.click()
  }

  const handleProjectGoalsChanged = useCallback(
    (value: string) => {
      if (value !== '' && value.match('^[0-9]{0,9}(\\.[0-9]{0,18})?$') == null) return
      formik.setFieldValue(ProjectFormField.projectGoals, value)
    },
    [formik]
  )

  const handleMinimumBackingChanged = useCallback(
    (value: string) => {
      if (value !== '' && value.match('^[0-9]{0,9}(\\.[0-9]{0,18})?$') == null) return
      formik.setFieldValue(ProjectFormField.minContribution, value)
    },
    [formik]
  )

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    formik.setFieldValue(ProjectFormField.image, event.target.files[0])
  }

  return (
    <Flex flexDirection="column">
      <ImageAndDescriptionWrapper marginBottom="16px">
        {formik.values.image ? (
          <ImageWrapper onClick={handleChooseImage}>
            <img src={URL.createObjectURL(formik.values.image)} alt="Kickstarter" />
          </ImageWrapper>
        ) : (
          <Flex flexDirection="column" width="270px" style={{ rowGap: '4px' }}>
            <ImagePlaceholderWrapper
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ cursor: 'pointer' }}
              onClick={handleChooseImage}
            >
              <ImageAddIcon width={60} marginBottom="8px" color="menuItemActiveBackground" />
              <Text color="menuItemActiveBackground" style={{ maxWidth: '150px' }} textAlign="center">
                Upload Your Project Picture
              </Text>
            </ImagePlaceholderWrapper>
            <Text color="textSubtle" marginBottom="4px" fontSize="12px">
              NB: Recommended image dimension would be 272 x 230
            </Text>
          </Flex>
        )}
        <input
          ref={inputFileElement}
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageSelected}
          style={{ display: 'none' }}
        />
        <InputWrapper flexDirection="column">
          <Text color="textSubtle" marginBottom="4px">
            Project Title
          </Text>
          <Input
            placeholder="Enter your project title"
            name={ProjectFormField.title}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Creator
          </Text>
          <Input
            placeholder="Enter your name"
            name={ProjectFormField.creator}
            value={formik.values.creator}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Description
          </Text>
          <TextArea
            placeholder="Write something about your project"
            name={ProjectFormField.projectDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {formik.values.projectDescription}
          </TextArea>
        </InputWrapper>
      </ImageAndDescriptionWrapper>
      <ChoosePaymentToken formik={formik} />
      <br />
      <FundingWrapper>
        <FundingInput
          label="Project Goals"
          tokenSymbol={getSymbolByAddress(formik.values.paymentToken)}
          value={formik.values.projectGoals.toString()}
          onChange={handleProjectGoalsChanged}
        />
        <FundingInput
          label="Minimum Backing"
          tokenSymbol={getSymbolByAddress(formik.values.paymentToken)}
          value={formik.values.minContribution.toString()}
          description="NB : This is the minimum amount for participate in donating the project"
          onChange={handleMinimumBackingChanged}
        />
      </FundingWrapper>
      <ButtonNext
        variant="tertiary"
        endIcon={<ArrowForwardIcon />}
        onClick={() => setCurrentCreationStep(2)}
        disabled={!isStepValid}
      >
        Next Step
      </ButtonNext>
    </Flex>
  )
}

export default React.memo(CreationStep01)
