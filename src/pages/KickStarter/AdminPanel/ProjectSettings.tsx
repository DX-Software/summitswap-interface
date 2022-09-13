import { Box, Button, Flex, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { formatUnits, parseEther } from 'ethers/lib/utils'
import { FormikProvider, FormikProps, useFormik } from 'formik'
import { useKickstarterFactoryContract } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import FundingInput from '../shared/FundingInput'

type InputProps = {
  amount: string
}

function ProjectSettings() {
  const { library } = useWeb3React()
  const kickstarterFactoryContract = useKickstarterFactoryContract()
  const [currentServiceFee, setCurrentServiceFee] = useState('0')
  const formik: FormikProps<InputProps> = useFormik<InputProps>({
    enableReinitialize: true,
    initialValues: {
      amount: currentServiceFee,
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!kickstarterFactoryContract) return

      try {
        const receipt = await kickstarterFactoryContract.setServiceFee(parseEther(values.amount))
        await library.waitForTransaction(receipt.hash)
      } catch (e: any) {
        console.error('Failed to Update Service Fee', e.message)
      }
      setSubmitting(false)
    },
  })

  const handleAmountChanged = (value: string) => {
    if (value !== '' && value.match('^[0-9]{0,9}(\\.[0-9]{0,18})?$') == null) return
    formik.setFieldValue('amount', value)
  }

  useEffect(() => {
    async function fetchCurrentService() {
      if (!kickstarterFactoryContract) return
      const serviceFee = await kickstarterFactoryContract.serviceFee()
      setCurrentServiceFee(formatUnits(serviceFee))
    }
    fetchCurrentService()
  }, [kickstarterFactoryContract])

  return (
    <FormikProvider value={formik}>
      <Flex flexDirection="column" alignItems="flex-start">
        <Text bold fontSize="20px" color="sidebarActiveColor">
          Project Creation Fee
        </Text>
        <p>Project fee is collected when user create a new project. Set your project fee amount here</p>
        <br />
        <Box maxWidth="390px">
          <FundingInput
            label="Enter Amount"
            value={formik.values.amount}
            description={`If user creates a kickstarter, they will have to pay ${formik.values.amount} BNB as the kickstarter creation fee`}
            onChange={handleAmountChanged}
          />
        </Box>
        <br />
        <Button style={{ fontFamily: 'Poppins' }} onClick={() => formik.submitForm()} isLoading={formik.isSubmitting}>
          Save Changes
        </Button>
      </Flex>
    </FormikProvider>
  )
}

export default ProjectSettings
