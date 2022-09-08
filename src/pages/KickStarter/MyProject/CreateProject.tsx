import { TransactionResponse } from '@ethersproject/providers'
import { ArrowBackIcon, Breadcrumbs, Flex, Heading, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useKickstarterContactMethodStore } from 'api/useKickstarterApi'
import { useUploadImageApi } from 'api/useUploadImageApi'
import TransactionConfirmationModal, { TransactionErrorContent } from 'components/TransactionConfirmationModal'
import { INITIAL_PROJECT_CREATION } from 'constants/kickstarter'
import { getUnixTime } from 'date-fns'
import { parseUnits } from 'ethers/lib/utils'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import { useKickstarterFactoryContract } from 'hooks/useContract'
import React, { useCallback, useEffect, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { Divider } from '../shared'
import { Project } from '../types'
import CreationStep01 from './CreationStep01'
import CreationStep02 from './CreationStep02'
import CreationStep03 from './CreationStep03'

type Prop = {
  isCreate: boolean
  toggleIsCreate: () => void
}

function CreateProject({ isCreate, toggleIsCreate }: Prop) {
  const { account, library } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const [isOpen, setIsOpen] = useState(false)
  const [hash, setHash] = useState<string | undefined>()
  const [pendingText, setPendingText] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isAttemptingTxn, setIsAttemptingTxn] = useState<boolean>(false)

  const [currentCreationStep, setCurrentCreationStep] = useState(1)

  const kickstarterContactMethodStore = useKickstarterContactMethodStore()
  const kickstarterFactoryContract = useKickstarterFactoryContract()
  const uploadImageApi = useUploadImageApi()

  const onDismiss = () => {
    setHash(undefined)
    setPendingText('')
    setErrorMessage('')
    setIsAttemptingTxn(false)
    setIsOpen(false)
  }

  const transactionSubmitted = useCallback(
    (response: TransactionResponse, summary: string) => {
      setIsOpen(true)
      setIsAttemptingTxn(false)
      setHash(response.hash)
      addTransaction(response, {
        summary,
      })
    },
    [addTransaction]
  )

  const transactionFailed = useCallback((messFromError: string) => {
    setIsOpen(true)
    setIsAttemptingTxn(false)
    setHash(undefined)
    setErrorMessage(messFromError)
  }, [])

  const formik: FormikProps<Project> = useFormik<Project>({
    enableReinitialize: true,
    initialValues: INITIAL_PROJECT_CREATION,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!kickstarterFactoryContract || !account) {
          return
        }
        const uploadImageResult = await uploadImageApi.mutateAsync(values.image!)

        const serviceFee = await kickstarterFactoryContract.serviceFee()

        const project = {
          paymentToken: values.paymentToken,
          title: values.title,
          creator: values.creator,
          imageUrl: uploadImageResult.url,
          projectDescription: values.projectDescription,
          rewardDescription: values.rewardDescription,
          minContribution: parseUnits(values.minContribution, 18),
          projectGoals: parseUnits(values.projectGoals, 18),
          rewardDistributionTimestamp: Math.floor(new Date(values.rewardDistributionTimestamp).getTime() / 1000),
          startTimestamp: getUnixTime(new Date()),
          endTimestamp: getUnixTime(new Date(values.endTimestamp)),
        }
        const receipt = await kickstarterFactoryContract.createProject(project, { value: serviceFee.toString() })
        transactionSubmitted(receipt, 'The kickstarter has been submitted successfully')
        await library.waitForTransaction(receipt.hash)

        const kickstarterAddresses = await kickstarterFactoryContract.getProjectsOf(account)
        const lastIndex = kickstarterAddresses.length - 1

        await kickstarterContactMethodStore.mutateAsync({
          kickstarterAddress: kickstarterAddresses[lastIndex],
          contactMethod: `${values.contactMethod}`,
          contactValue: `${values.contactMethodValue}`,
        })

        toggleIsCreate()
      } catch (err) {
        const callError = err as any
        const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
        transactionFailed(callErrorMessage)
      }
      setSubmitting(false)
    },
  })

  useEffect(() => {
    if (isCreate) return
    setCurrentCreationStep(1)
  }, [isCreate])

  return (
    <Flex flexDirection="column">
      <Flex borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={toggleIsCreate}>
            My Project
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            Create New Project
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={toggleIsCreate}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: 'underline' }}>
          back to My Projects
        </Text>
      </Flex>
      <Text color="textSubtle" marginBottom="4px">
        Step 0{currentCreationStep} of 03 - Project Details
      </Text>
      <Heading size="xl" marginBottom="8px">
        Create New Project
      </Heading>
      <Divider style={{ marginBottom: '24px' }} />
      <FormikProvider value={formik}>
        {currentCreationStep === 1 && (
          <CreationStep01 setCurrentCreationStep={setCurrentCreationStep} formik={formik} />
        )}
        {currentCreationStep === 2 && (
          <CreationStep02 setCurrentCreationStep={setCurrentCreationStep} formik={formik} />
        )}
        {currentCreationStep === 3 && (
          <CreationStep03 setCurrentCreationStep={setCurrentCreationStep} formik={formik} />
        )}
      </FormikProvider>
      <TransactionConfirmationModal
        isOpen={isOpen}
        onDismiss={onDismiss}
        attemptingTxn={isAttemptingTxn}
        hash={hash}
        pendingText={pendingText}
        content={() =>
          errorMessage ? <TransactionErrorContent onDismiss={onDismiss} message={errorMessage || ''} /> : null
        }
      />
    </Flex>
  )
}

export default React.memo(CreateProject)
