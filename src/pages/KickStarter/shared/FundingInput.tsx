import { Input, Text } from '@koda-finance/summitswap-uikit'
import { getTokenImageBySymbol } from 'connectors'
import React from 'react'
import { Flex } from 'rebass'
import styled from 'styled-components'
import { ImgCurrency } from '.'

type Props = {
  label: string
  name?: string
  type?: string
  tokenSymbol?: string
  value: string
  isFunding?: boolean
  description?: string
  onChange: (value: string) => void
}

const InputWrapper = styled(Flex)`
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
`

const StyledInput = styled(Input)`
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
`

const InputCurrency = styled(Flex)`
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  padding-left: 16px;
  padding-right: 28px;
  background-color: ${({ theme }) => theme.colors.inputColor};
  column-gap: 8px;
`

function FundingInput({ name, label, type, tokenSymbol, value, description, onChange, isFunding }: Props) {
  const handleOnChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <Flex flexDirection="column" flex={1}>
      <Text color="textSubtle" marginBottom="4px">
        {label}
      </Text>
      {isFunding && (
        <InputWrapper>
          <InputCurrency alignItems="center">
            <ImgCurrency image={getTokenImageBySymbol(tokenSymbol)} />
            <Text fontWeight="bold">{tokenSymbol}</Text>
          </InputCurrency>
          <StyledInput name={name} type={type} value={value} onChange={handleOnChange} />
        </InputWrapper>
      )}
      {!isFunding && (
        <InputWrapper style={{ borderRadius: '16px!important' }}>
          <StyledInput
            style={{ borderRadius: '16px' }}
            name={name}
            type={type}
            value={value}
            onChange={handleOnChange}
          />
        </InputWrapper>
      )}
      {description && (
        <Text color="textDisabled" fontSize="12px" marginTop="8px">
          {description}
        </Text>
      )}
    </Flex>
  )
}

export default React.memo(FundingInput)

FundingInput.defaultProps = {
  type: 'text',
  tokenSymbol: 'bnb',
  description: undefined,
  isFunding: true,
}
