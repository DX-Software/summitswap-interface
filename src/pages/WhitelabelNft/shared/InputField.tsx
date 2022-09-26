import { Box, Input, Text } from '@koda-finance/summitswap-uikit'
import { ErrorMessage, FormikProps } from 'formik'
import React from 'react'
import { HelperText } from './Text'

type Props = {
  label: string
  name: string
  placeholder: string
  helperText?: string | React.ReactNode
  onChange?: (value: string) => void
  formik: FormikProps<any>
}

function InputField({ label, name, placeholder, helperText, onChange, formik }: Props) {
  return (
    <Box marginBottom="16px">
      <Text color="#E2E2E2" fontSize="14px">
        {label}
      </Text>
      <Input
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={(event) => (onChange ? onChange(event.target.value) : formik.handleChange(event))}
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
