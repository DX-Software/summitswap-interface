import { Flex, Heading, Text } from '@koda-finance/summitswap-uikit'
import { FormikProps, FormikProvider, FormikValues, useFormik } from 'formik'
import React, { useState } from 'react'
import Divider from '../shared/Divider'
import CreationStep01 from './CreationStep01'
import CreationStep02 from './CreationStep02'

function CreateCollection() {
  const [currentCreationStep, setCurrentCreationStep] = useState(0)

  const formik: FormikProps<FormikValues> = useFormik<FormikValues>({
    enableReinitialize: true,
    initialValues: {},
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(false)
    },
  })

  const steps = [
    {
      label: 'Collection Details',
      component: <CreationStep01 setCurrentCreationStep={setCurrentCreationStep} formik={formik} />,
    },
    {
      label: 'Defined NFTs',
      component: <CreationStep02 setCurrentCreationStep={setCurrentCreationStep} formik={formik} />,
    },
  ]

  return (
    <Flex flexDirection="column">
      <Text color="textSubtle" marginBottom="4px">
        Step{' '}
        <Text color="linkColor" bold style={{ display: 'inline-block' }}>
          0{currentCreationStep + 1}
        </Text>{' '}
        of 03 - {steps[currentCreationStep].label}
      </Text>
      <Heading size="xl" marginBottom="16px">
        Create NFT Collection
      </Heading>
      <Divider />
      <FormikProvider value={formik}>{steps[currentCreationStep].component}</FormikProvider>
    </Flex>
  )
}

export default React.memo(CreateCollection)
