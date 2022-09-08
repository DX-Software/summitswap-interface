import { Button, Flex, Text } from "@koda-finance/summitswap-uikit"
import { formatUnits, parseEther } from "ethers/lib/utils"
import { FormikProvider, FormikProps, useFormik } from "formik"
import { useKickstarterFactoryContract } from "hooks/useContract"
import React, { useEffect, useState } from "react"
import FundingInput from "../shared/FundingInput"

type InputProps = {
  amount: string
}

function ProjectSettings() {
  const kickstarterFactoryContract = useKickstarterFactoryContract()
  const [currentServiceFee, setCurrentServiceFee] = useState("0")
  const formik: FormikProps<InputProps> = useFormik<InputProps>({
    enableReinitialize: true,
    initialValues: {
      amount: currentServiceFee
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (!kickstarterFactoryContract) return

      try {
        await kickstarterFactoryContract.setServiceFee(parseEther(values.amount))
      } catch (e: any) {
        console.error("Failed to Update Service Fee", e.message)
      }
      setSubmitting(false)
    },
  })

  const handleAmountChanged = (value: string) => {
    if (value !== '' && value.match('^[0-9]{0,9}(\\.[0-9]{0,18})?$') == null) return
    formik.setFieldValue("amount", value)
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
        <Text bold fontSize="20px" color='sidebarActiveColor'>
          Project Creation Fee
        </Text>
        <p>
          Project fee is collected when user create a new project. Set your project fee amount here
        </p>
        <br />
        <FundingInput
          label="Enter Amount"
          value={formik.values.amount}
          description={`If the user set 100 BNB as goal, they will have to pay ${formik.values.amount} BNB for the project fee`}
          onChange={handleAmountChanged}
        />
        <br />
        <Button style={{fontFamily:'Poppins'}} onClick={() => formik.submitForm()} isLoading={formik.isSubmitting}>
          Save Changes
        </Button>
      </Flex>
    </FormikProvider>
  )
}

export default ProjectSettings
