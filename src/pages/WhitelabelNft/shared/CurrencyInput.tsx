import { Box, EtherIcon, Flex, Input, Text } from '@koda-finance/summitswap-uikit'
import { ErrorMessage, FormikProps } from 'formik'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { WhitelabelNft } from 'types/whitelabelNft'
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
  formik: FormikProps<WhitelabelNft>
}

function CurrencyInput({ label, name, placeholder, helperText, formik }: Props) {
  const handleOnChange = useCallback(
    (value: string) => {
      if (value !== '' && value.match('^[0-9]{0,9}(\\.[0-9]{0,18})?$') == null) return
      formik.setFieldValue(name, value)
    },
    [formik, name]
  )

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
          <StyledInput
            name={name}
            placeholder={placeholder}
            value={formik.values[name]}
            onChange={(e) => handleOnChange(e.target.value)}
            onBlur={formik.handleBlur}
          />
        </InputWrapper>
      </Flex>
      {helperText && (
        <HelperText fontSize="12px" marginTop="4px">
          {helperText}
        </HelperText>
      )}
      <ErrorMessage name={name}>
        {(msg) => (
          <HelperText fontSize="12px" marginTop="4px" color="failure">
            {msg.replace(name, label)}
          </HelperText>
        )}
      </ErrorMessage>
    </Box>
  )
}

export default React.memo(CurrencyInput)
