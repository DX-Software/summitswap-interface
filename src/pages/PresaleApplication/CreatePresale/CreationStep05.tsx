/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { FormikProps } from 'formik'
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
import { ItemIconCard, IconBox, GridContainer, GridItem1, GridItem2 } from './GridComponents'
import StyledInput, { StyledInputWrapper } from './StyledInput'
import ButtonsWrapper from './ButtonsWrapper'
import { Caption, Heading } from '../Texts'
import { FieldNames, PresaleDetails, ProjectDetails } from '../types'

interface Props {
  formikPresale: FormikProps<PresaleDetails>
  formikProject: FormikProps<ProjectDetails>
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

interface LogoDimensions {
  height: number
  width: number
}

const CreationStep05 = ({ formikPresale, formikProject, changeStepNumber }: Props) => {
  const [isStepValid, setIsStepValid] = useState(false)
  const [logoDimensions, setLogoDimensions] = useState<LogoDimensions>({ height: 0, width: 0 })
  const imageRef = useRef<HTMLImageElement>(null)

  const handleOnLogoLoad = () => {
    setLogoDimensions({
      height: imageRef.current?.naturalHeight || 0,
      width: imageRef.current?.naturalWidth || 0,
    })
  }

  useEffect(() => {
    if (
      formikProject.values.logoHeight !== logoDimensions.height &&
      formikProject.values.logoWidth !== logoDimensions.width
    ) {
      formikProject.values.logoHeight = logoDimensions.height
      formikProject.values.logoWidth = logoDimensions.width
    }
  }, [logoDimensions, formikProject.values])

  useEffect(() => {
    if (
      !formikProject.errors.projectName &&
      !formikProject.errors.logoUrl &&
      !formikProject.errors.contactName &&
      !formikProject.errors.contactPosition &&
      !formikProject.errors.telegramId &&
      !formikProject.errors.twitterId &&
      !formikProject.errors.email &&
      !formikProject.errors.telegramId &&
      formikProject.touched.projectName
    ) {
      setIsStepValid(true)
    }
  }, [formikProject])

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
          <StyledInput
            placeholder="e.g. https://www.google.com/1234.jpg"
            value={formikProject.values.logoUrl}
            onChange={formikProject.handleChange}
            onBlur={formikProject.handleBlur}
            name={FieldNames.logoUrl}
            id={FieldNames.logoUrl}
            isWarning={formikProject.touched.logoUrl && !!formikProject.errors.logoUrl}
          />
          <img
            height={0}
            width={0}
            src={formikProject.values.logoUrl}
            ref={imageRef}
            alt=""
            style={{ display: 'hidden' }}
            onLoad={handleOnLogoLoad}
          />
          <Caption color={formikProject.touched.logoUrl && !!formikProject.errors.logoUrl ? 'failure' : 'textDisabled'}>
            {formikProject.touched.logoUrl && formikProject.errors.logoUrl
              ? formikProject.errors.logoUrl
              : 'Image should be 100x100, and URL must be hosted and shoul end with a supported image extension png, jpg, jpeg or gif.'}
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
              <StyledInput
                placeholder="Enter your project presale name"
                value={formikProject.values.projectName}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.projectName}
                id={FieldNames.projectName}
                isWarning={formikProject.touched.projectName && !!formikProject.errors.projectName}
              />
              <Caption color="failure">
                {formikProject.touched.projectName && formikProject.errors.projectName
                  ? formikProject.errors.projectName
                  : ''}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Contact Name
              </Text>
              <StyledInput
                placeholder="e.g. John Doe"
                value={formikProject.values.contactName}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.contactName}
                id={FieldNames.contactName}
                isWarning={formikProject.touched.contactName && !!formikProject.errors.contactName}
              />
              <Caption color="failure">
                {formikProject.touched.contactName && formikProject.errors.contactName
                  ? formikProject.errors.contactName
                  : ''}
              </Caption>
            </StyledInputWrapper>
          </Flex>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Text small marginTop="8px">
                Contact Position
              </Text>
              <StyledInput
                placeholder="e.g. Manager"
                value={formikProject.values.contactPosition}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.contactPosition}
                id={FieldNames.contactPosition}
                isWarning={formikProject.touched.contactPosition && !!formikProject.errors.contactPosition}
              />
              <Caption color="failure">
                {formikProject.touched.contactPosition && formikProject.errors.contactPosition
                  ? formikProject.errors.contactPosition
                  : ''}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Chosen Contact Method
              </Text>
              <StyledSelect
                options={[
                  {
                    label: 'Telegram',
                    value: 'telegram',
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
              <StyledInput
                placeholder="Ex: https://telegram.me..."
                value={formikProject.values.telegramId}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.telegramId}
                id={FieldNames.telegramId}
                isWarning={formikProject.touched.telegramId && !!formikProject.errors.telegramId}
              />
              <Caption color="failure">
                {formikProject.touched.telegramId && formikProject.errors.telegramId
                  ? formikProject.errors.telegramId
                  : ''}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Discord ID
                <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                  &nbsp;(optional)
                </Text>
              </Text>
              <StyledInput
                placeholder="Ex: https://discord.me..."
                value={formikProject.values.discordId}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.discordId}
                id={FieldNames.discordId}
                isWarning={formikProject.touched.discordId && !!formikProject.errors.discordId}
              />
              <Caption color="failure">
                {formikProject.touched.discordId && formikProject.errors.discordId
                  ? formikProject.errors.discordId
                  : ''}
              </Caption>
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
              <StyledInput
                placeholder="e.g. summitswap@domain.com"
                value={formikProject.values.email}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.email}
                id={FieldNames.email}
                isWarning={formikProject.touched.email && !!formikProject.errors.email}
              />
              <Caption color="failure">
                {formikProject.touched.email && formikProject.errors.email ? formikProject.errors.email : ''}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Text small marginTop="8px">
                Twitter Username
                <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                  &nbsp;(optional)
                </Text>
              </Text>
              <StyledInput
                placeholder="Ex: https://twitter.me..."
                value={formikProject.values.twitterId}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.twitterId}
                id={FieldNames.twitterId}
                isWarning={formikProject.touched.twitterId && !!formikProject.errors.twitterId}
              />
              <Caption color="failure">
                {formikProject.touched.twitterId && formikProject.errors.twitterId
                  ? formikProject.errors.twitterId
                  : ''}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>

      <ButtonsWrapper>
        <Button variant="secondary" onClick={() => changeStepNumber(1)}>
          Previous Step
        </Button>
        {formikPresale.errors.tokenAmount ? (
          <Text bold marginY="20px" color="failure">
            {formikPresale.errors.tokenAmount}
          </Text>
        ) : (
          <Text bold marginY="20px" color="success">
            {formikPresale.values.tokenAmount ? `${formikPresale.values.tokenAmount.toFixed(4)} Presale Tokens` : ''}
          </Text>
        )}
        <Button disabled={!isStepValid} onClick={() => changeStepNumber(5)}>
          Continue
        </Button>
      </ButtonsWrapper>
    </>
  )
}

export default CreationStep05
