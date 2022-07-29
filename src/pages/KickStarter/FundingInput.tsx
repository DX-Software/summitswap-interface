import { Text, Input, BinanceIcon } from '@koda-finance/summitswap-uikit';
import React from 'react'
import { Flex } from 'rebass';
import styled from 'styled-components';

type Props = {
  label: string;
  value: number;
  description?: string;
  onChange: (value: number) => void;
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

function FundingInput({ label, value, description, onChange }: Props) {

  const handleOnChange = (e) => {
    onChange(Number(e.target.value))
  }

  return (
    <Flex flexDirection="column" flex={1}>
      <Text color="textSubtle" marginBottom="4px">{label}</Text>
      <InputWrapper>
        <InputCurrency alignItems="center">
          <BinanceIcon />
          <Text fontWeight="bold">BNB</Text>
        </InputCurrency>
        <StyledInput value={value} onChange={handleOnChange} />
      </InputWrapper>
      {description && <Text color="textDisabled" fontSize="12px" marginTop="8px">{description}</Text>}
    </Flex>
  )
}

export default FundingInput;

FundingInput.defaultProps = {
  description: undefined,
}
