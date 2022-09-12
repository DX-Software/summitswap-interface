import { Box, Input, Text } from '@koda-finance/summitswap-uikit'
import { FormikProps, FormikValues } from 'formik'
import React from 'react'
import { HelperText } from './Text'

type Props = {
  label: string
  name: string
  placeholder: string
  helperText?: string
  formik: FormikProps<FormikValues>
}

function InputField({ label, name, placeholder, helperText, formik }: Props) {
  return (
    <Box marginBottom="16px">
      <Text color="#E2E2E2" fontSize="14px">
        {label}
      </Text>
      <Input name={name} placeholder={placeholder} onChange={formik.handleChange} />
      {helperText && (
        <HelperText fontSize="12px" marginTop="4px">
          {helperText}
        </HelperText>
      )}
    </Box>
  )
}

export default React.memo(InputField)
