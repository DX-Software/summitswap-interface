import { Flex, Heading, Text } from '@koda-finance/summitswap-uikit'
import { FormikProps, FormikProvider, FormikValues, useFormik } from 'formik'
import React, { useState } from 'react'
import styled from 'styled-components'
import CreationStep01 from './CreationStep01'

const Divider = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.inputColor};
  margin-bottom: 24px;
`

function CreateCollection() {
  const [currentCreationStep, setCurrentCreationStep] = useState(1)

  const formik: FormikProps<FormikValues> = useFormik<FormikValues>({
    enableReinitialize: true,
    initialValues: {},
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(false)
    },
  })

  return (
    <Flex flexDirection="column">
      <Text color="textSubtle" marginBottom="4px">
        Step{' '}
        <Text color="linkColor" bold style={{ display: 'inline-block' }}>
          0{currentCreationStep}
        </Text>{' '}
        of 03 - Collection Details
      </Text>
      <Heading size="xl" marginBottom="16px">
        Create NFT Collection
      </Heading>
      <Divider />
      <FormikProvider value={formik}>
        {currentCreationStep === 1 && (
          <CreationStep01 setCurrentCreationStep={setCurrentCreationStep} formik={formik} />
        )}
      </FormikProvider>
    </Flex>
  )
}

export default React.memo(CreateCollection)
