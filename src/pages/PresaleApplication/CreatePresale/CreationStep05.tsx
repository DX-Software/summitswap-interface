/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
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
  TextArea,
} from '@koda-finance/summitswap-uikit'
import { CONTACT_METHOD_OPTIONS } from 'constants/presale'
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

const StyledTextArea = styled(TextArea)`
  padding: 10px 16px;
  font-size: 16px;
  @media (max-width: 1296px) {
    width: 400px;
  }
  @media (max-width: 620px) {
    width: 300px;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`

const WebsiteURlInput = styled(StyledInput)`
  width: 100%;
  @media (max-width: 1296px) {
    width: 400px;
  }
  @media (max-width: 620px) {
    width: 300px;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`

const CreationStep05 = ({ formikPresale, formikProject, changeStepNumber }: Props) => {
  const [isStepValid, setIsStepValid] = useState(false)

  useEffect(() => {
    if (formikProject.isValid && formikProject.touched.projectName) {
      setIsStepValid(true)
    } else {
      setIsStepValid(false)
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
          <Caption color={formikProject.touched.logoUrl && !!formikProject.errors.logoUrl ? 'failure' : 'textDisabled'}>
            {formikProject.touched.logoUrl && formikProject.errors.logoUrl
              ? formikProject.errors.logoUrl
              : 'The recommended logo size is 100x100'}
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
          <StyledInputWrapper>
            <Text marginBottom="4px" small>
              Project Description
            </Text>
            <StyledTextArea
              name={FieldNames.description}
              id={FieldNames.description}
              onChange={formikProject.handleChange}
              placeholder="Describe your presale project"
            />
          </StyledInputWrapper>
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
                id={FieldNames.contactMethod}
                options={CONTACT_METHOD_OPTIONS}
                onValueChanged={(value: any) => formikProject.setFieldValue(FieldNames.contactMethod, value)}
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
          <StyledInputWrapper marginRight="16px">
            <Text small marginTop="8px">
              Website URL
            </Text>
            <WebsiteURlInput
              placeholder="Ex: https://www.summitswap.com/"
              value={formikProject.values.websiteUrl}
              onChange={formikProject.handleChange}
              onBlur={formikProject.handleBlur}
              name={FieldNames.websiteUrl}
              id={FieldNames.websiteUrl}
              isWarning={formikProject.touched.websiteUrl && !!formikProject.errors.websiteUrl}
            />
            <Caption color="failure">
              {formikProject.touched.websiteUrl && formikProject.errors.websiteUrl
                ? formikProject.errors.websiteUrl
                : ''}
            </Caption>
          </StyledInputWrapper>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Text small marginTop="8px">
                Telegram ID
                {formikProject.values.contactMethod !== CONTACT_METHOD_OPTIONS[0].value && (
                  <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                    &nbsp;(optional)
                  </Text>
                )}
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
                {formikProject.values.contactMethod !== CONTACT_METHOD_OPTIONS[1].value && (
                  <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                    &nbsp;(optional)
                  </Text>
                )}
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
                {formikProject.values.contactMethod !== CONTACT_METHOD_OPTIONS[2].value && (
                  <Text style={{ display: 'inline' }} small color={darkColors.borderColor}>
                    &nbsp;(optional)
                  </Text>
                )}
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
        <Button variant="secondary" onClick={() => changeStepNumber(3)}>
          Previous Step
        </Button>
        {formikPresale.errors.tokenAmount ? (
          <Text bold marginY="20px" color="failure">
            {formikPresale.errors.tokenAmount}
          </Text>
        ) : (
          <Text bold marginY="20px" color="success">
            {formikPresale.values.tokenAmount ? `${formikPresale.values.tokenAmount.toFixed(2)} Presale Tokens` : ''}
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
