import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Flex, Box, Radio, Text } from '@koda-finance/summitswap-uikit'
import steps from './steps-data'
import CreationStep01 from './CreationStep01'

const StepsWrapper = styled(Box)`
  width: 522px;
  text-align: center;
`

const StepLine = styled.div`
  position: relative;
  top: 18px;
  background: #3c3742;
  border-radius: 9px;
  width: 100%;
  height: 4px;
`

const StyledRadio = styled(Radio)<{ completed: boolean }>`
  cursor: auto;
  background-color: ${({ completed, theme }) => (completed ? theme.colors.success : theme.colors.inputColor)};
  &:hover:not(:disabled):not(:checked) {
    box-shadow: none;
  }
  &:focus {
    box-shadow: none;
  }
  &:after {
    background-color: ${({ completed, theme }) => (completed ? theme.colors.success : theme.colors.inputColor)};
  }
  &:checked {
    &:after {
      background-color: ${({ theme }) => theme.colors.inputColor};
    }
  }
`
const CreatePresale = () => {
  const [stepNumber, setStepNumber] = useState(0)

  const changeStepNumber = useCallback((num: number) => setStepNumber(num), [])

  const showStep = () => {
    switch (stepNumber) {
      case 0:
        return <CreationStep01 changeStepNumber={changeStepNumber} />
      default:
        return <></>
    }
  }

  return (
    <>
      <StepsWrapper>
        <Text color="primary" small>
          {steps[stepNumber].name}
        </Text>
        <Text marginTop="8px" fontSize="24px" fontWeight={700}>
          {steps[stepNumber].title}
        </Text>
        <Text marginTop="8px" color="textSubtle">
          {steps[stepNumber].subTitle}
        </Text>
        <Box marginY="35px">
          <StepLine />
          <Flex justifyContent="space-between">
            <StyledRadio completed={stepNumber > 0} checked={stepNumber === 0} />
            <StyledRadio completed={stepNumber > 1} checked={stepNumber === 1} />
            <StyledRadio completed={stepNumber > 2} checked={stepNumber === 2} />
            <StyledRadio completed={stepNumber > 3} checked={stepNumber === 3} />
            <StyledRadio completed={stepNumber > 4} checked={stepNumber === 4} />
            <StyledRadio completed={stepNumber > 5} checked={stepNumber === 5} />
          </Flex>
        </Box>
      </StepsWrapper>
      {showStep()}
    </>
  )
}

export default CreatePresale
