import { Box, EtherIcon, Flex, Input, Text } from '@koda-finance/summitswap-uikit'
import { FormikProps, FormikValues } from 'formik'
import React from 'react'
import styled from 'styled-components'
import { HelperText } from './Text'

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
  column-gap: 4px;
`

type Props = {
  label: string
  name: string
  placeholder: string
  helperText?: string
  formik: FormikProps<FormikValues>
}

function CurrencyInput({ label, name, placeholder, helperText, formik }: Props) {
  return (
    <Box marginBottom="16px">
      <Text color="#E2E2E2" fontSize="14px">
        {label}
      </Text>
      <Flex flexDirection="column" flex={1}>
        <InputWrapper>
          <InputCurrency alignItems="center">
            <EtherIcon color="linkColor" />
            <Text fontWeight="bold">ETH</Text>
          </InputCurrency>
          <StyledInput name={name} placeholder={placeholder} onChange={formik.handleChange} />
        </InputWrapper>
      </Flex>
      {helperText && (
        <HelperText fontSize="12px" marginTop="4px">
          {helperText}
        </HelperText>
      )}
    </Box>
  )
}

export default React.memo(CurrencyInput)
