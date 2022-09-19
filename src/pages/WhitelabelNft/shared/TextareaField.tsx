import { Box, Text, TextArea } from '@koda-finance/summitswap-uikit'
import { ErrorMessage, FormikProps } from 'formik'
import React from 'react'
import { WhitelabelNft } from 'types/whitelabelNft'
import { HelperText } from './Text'

type Props = {
  label: string
  name: string
  placeholder: string
  helperText?: string | React.ReactNode
  formik: FormikProps<WhitelabelNft>
}

function TextareaField({ label, name, placeholder, helperText, formik }: Props) {
  return (
    <Box marginBottom="16px">
      <Text color="#E2E2E2" fontSize="14px">
        {label}
      </Text>
      <TextArea
        name={name}
        placeholder={placeholder}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ resize: 'vertical' }}
      >
        {formik.values[name]}
      </TextArea>
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

export default React.memo(TextareaField)
