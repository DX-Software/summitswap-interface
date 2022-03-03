import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Input, Text } from '@koda-finance/summitswap-uikit'
import { useUserDeadline } from 'state/user/hooks'
import QuestionHelper from '../QuestionHelper'
import TranslatedText from '../TranslatedText'

const StyledTransactionDeadlineSetting = styled.div`
  margin-bottom: 16px;
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 8px;
`

const Field = styled.div`
  align-items: center;
  display: inline-flex;

  & > ${Input} {
    max-width: 100px;
  }

  & > ${Text} {
    font-size: 14px;
    margin-left: 8px;
  }
`

const InputField = styled(Field)`
  input, div {
    color: ${({ theme }) => theme.colors.sidebarColor};
    box-shadow: none !important;
    font-size: 18px !important;
    font-weight: 600 !important;
  }
  >input {
    background-color: ${({ theme }) => theme.colors.menuItemBackground};
  }
`

const TransactionDeadlineSetting = () => {
  const [deadline, setDeadline] = useUserDeadline()
  const [value, setValue] = useState(deadline / 60) // deadline in minutes
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseInt(inputValue, 10))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 60
      if (!Number.isNaN(rawValue) && rawValue > 0) {
        setDeadline(rawValue)
        setError(null)
      } else {
        setError('Enter a valid deadline')
      }
    } catch {
      setError('Enter a valid deadline')
    }
  }, [value, setError, setDeadline])

  return (
    <StyledTransactionDeadlineSetting>
      <Label>
        <Text style={{ fontWeight: 600 }} fontSize='16px' color='sidebarColor'>
          <TranslatedText translationId={90}>Transaction deadline</TranslatedText>
        </Text>
        <QuestionHelper text="Your transaction will revert if it is pending for more than this long." />
      </Label>
      <InputField>
        <Input type="number" step="1" min="1" value={value} onChange={handleChange} />
        <Text>Minutes</Text>
      </InputField>
      {error && (
        <Text mt="8px" color="failure" fontSize='18px' fontWeight='600'>
          {error}
        </Text>
      )}
    </StyledTransactionDeadlineSetting>
  )
}

export default TransactionDeadlineSetting
