import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, Input, Text } from '@koda-finance/summitswap-uikit'
import { useUserSlippageTolerance } from 'state/user/hooks'
import Question from 'components/QuestionHelper'
import { TranslateString } from 'utils/translateTextHelpers'
import TranslatedText from '../TranslatedText'

const MAX_SLIPPAGE = 5000
const RISKY_SLIPPAGE_LOW = 50
const RISKY_SLIPPAGE_HIGH = 500

const StyledSlippageToleranceSettings = styled.div`
  margin-bottom: 16px;
`

const Option = styled.div`
  padding: 0 4px;
  >button {
    background-color: ${({ theme }) => theme.colors.menuItemBackground};
    color: ${({ theme }) => theme.colors.sidebarColor};
    font-size: 18px;
    font-weight: 600;
  }
`

const Options = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  ${Option}:first-child {
    padding-left: 0;
  }

  ${Option}:last-child {
    padding-right: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 8px;
`

const InputOption = styled(Option)`
  width: 165px;
  input {
    background-color: ${({ theme }) => theme.colors.menuItemBackground};
    color: ${({ theme }) => theme.colors.sidebarColor};
    box-shadow: none !important;
    font-size: 18px;
    font-weight: 600;
  }
`

const predefinedValues = [
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1%', value: 1 }
]

const SlippageToleranceSettings = () => {
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [value, setValue] = useState(userSlippageTolerance / 100)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseFloat(inputValue))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 100
      if (!Number.isNaN(rawValue) && rawValue > 0 && rawValue < MAX_SLIPPAGE) {
        setUserslippageTolerance(rawValue)
        setError(null)
      } else {
        setError('Enter a valid slippage percentage')
      }
    } catch {
      setError('Enter a valid slippage percentage')
    }
  }, [value, setError, setUserslippageTolerance])

  // Notify user if slippage is risky
  useEffect(() => {
    if (userSlippageTolerance < RISKY_SLIPPAGE_LOW) {
      setError('Your transaction may fail')
    } else if (userSlippageTolerance > RISKY_SLIPPAGE_HIGH) {
      setError('Your transaction may be frontrun')
    }
  }, [userSlippageTolerance, setError])

  return (
    <StyledSlippageToleranceSettings>
      <Label>
        <Text style={{ fontWeight: 600 }} fontSize='16px' color='sidebarColor'>
          <TranslatedText translationId={88}>Slippage tolerance</TranslatedText>
        </Text>
        <Question
          text={TranslateString(
            1170,
            'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
          )}
        />
      </Label>
      <Options>
        <Flex mb={['8px', 0]} mr={[0, '8px']}>
          {predefinedValues.map(({ label, value: predefinedValue }) => {
            const handleClick = () => setValue(predefinedValue)

            return (
              <Option key={predefinedValue}>
                <Button variant={value === predefinedValue ? 'primary' : 'tertiary'} onClick={handleClick}>
                  {label}
                </Button>
              </Option>
            )
          })}
        </Flex>
        <Flex alignItems="center">
          <InputOption>
            <Input
              type="number"
              scale="lg"
              step={0.1}
              min={0.1}
              placeholder="5%"
              value={value}
              onChange={handleChange}
              isWarning={error !== null}
            />
          </InputOption>
          <Option>
            <Text color='sidebarColor' fontSize="18px" fontWeight='600'>%</Text>
          </Option>
        </Flex>
      </Options>
      {error && (
        <Text mt="8px" color="failure">
          {error}
        </Text>
      )}
    </StyledSlippageToleranceSettings>
  )
}

export default SlippageToleranceSettings
