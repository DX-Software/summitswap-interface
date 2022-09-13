import { Box, Input, Text } from '@koda-finance/summitswap-uikit'
import { ErrorMessage, FormikProps } from 'formik'
import React from 'react'
import { WhitelabelNft } from 'types/whitelabelNft'
import { HelperText } from './Text'

type Props = {
  label: string
  name: string
  placeholder: string
  helperText?: string
  formik: FormikProps<WhitelabelNft>
}

function InputField({ label, name, placeholder, helperText, formik }: Props) {
  return (
    <Box marginBottom="16px">
      <Text color="#E2E2E2" fontSize="14px">
        {label}
      </Text>
      <Input
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
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

export default React.memo(InputField)
