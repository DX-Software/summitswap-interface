import { TransactionResponse } from '@ethersproject/providers'
import {
  ArrowBackIcon,
  Flex,
  Text,
  Breadcrumbs,
  Heading,
} from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import TransactionConfirmationModal, { TransactionErrorContent } from 'components/TransactionConfirmationModal'
import { BACKEND_API, UPLOAD_IMAGE_API } from 'constants/backend'
import { useKickstarterContext } from 'contexts/kickstarter'
import { parseUnits } from 'ethers/lib/utils'
import { useKickstarterFactoryContract } from 'hooks/useContract'
import React, { useCallback, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import styled from 'styled-components'
import CreationStep01 from './CreationStep01'
import CreationStep02 from './CreationStep02'
import CreationStep03 from './CreationStep03'

const Divider = styled.div`
  height: 1px;
  background-color: #444444;
`

function CreateProject() {
  const { library } = useWeb3React()
  const { account, toggleIsCreate, currentCreationStep, projectCreation } = useKickstarterContext()
  const addTransaction = useTransactionAdder()
  const kickstarterFactoryContract = useKickstarterFactoryContract()

  const [isOpen, setIsOpen] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [pendingText, setPendingText] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const onDismiss = () => {
    setHash(undefined)
    setPendingText('')
    setErrorMessage('')
    setAttemptingTxn(false)
    setIsOpen(false)
  }

  const transactionSubmitted = useCallback(
    (response: TransactionResponse, summary: string) => {
      setIsOpen(true)
      setAttemptingTxn(false)
      setHash(response.hash)
      addTransaction(response, {
        summary,
      })
    },
    [addTransaction]
  )

  const transactionFailed = useCallback((messFromError: string) => {
    setIsOpen(true)
    setAttemptingTxn(false)
    setHash(undefined)
    setErrorMessage(messFromError)
  }, [])

  const handleUploadImage = useCallback(async (file: File) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(`${BACKEND_API}/${UPLOAD_IMAGE_API}`, formData, config)
    return res.data.url
  }, [])

  const handleCreateProject = useCallback(async () => {
    try {
      if (!kickstarterFactoryContract || !account) {
        return
      }
      const url: string = await handleUploadImage(projectCreation.image!)

      const serviceFee = await kickstarterFactoryContract.serviceFee()
      const receipt = await kickstarterFactoryContract.createProject(
        projectCreation.title,
        projectCreation.creator,
        url,
        projectCreation.projectDescription,
        projectCreation.rewardDescription,
        parseUnits(projectCreation.minimumBacking, 18),
        parseUnits(projectCreation.goals, 18),
        Math.floor(new Date(projectCreation.rewardDistribution).getTime() / 1000),
        Math.floor(Date.now() / 1000),
        Math.floor(new Date(projectCreation.projectDueDate).getTime() / 1000),
        { value: serviceFee.toString() }
      )
      transactionSubmitted(receipt, 'The kickstarter has been submitted successfully')
      await library.waitForTransaction(receipt.hash)
      toggleIsCreate();

    } catch (err) {
      const callError = err as any
      const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
      transactionFailed(callErrorMessage)
    }
  }, [
    kickstarterFactoryContract,
    projectCreation.image,
    projectCreation.title,
    projectCreation.creator,
    projectCreation.projectDescription,
    projectCreation.rewardDescription,
    projectCreation.minimumBacking,
    projectCreation.goals,
    projectCreation.rewardDistribution,
    projectCreation.projectDueDate,
    account,
    library,
    toggleIsCreate,
    transactionFailed,
    transactionSubmitted,
    handleUploadImage,
  ])

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
        <Text color="linkColor" style={{ textDecoration: "underline" }}>back to My Projects</Text>
      </Flex>
      <Text color="textSubtle" marginBottom="4px">
        Step 0{currentCreationStep} of 03 - Project Details
      </Text>
      <Heading size="xl" marginBottom="8px">
        Create New Project
      </Heading>
      <Divider style={{ marginBottom: '24px' }} />
      {currentCreationStep === 1 && <CreationStep01 />}
      {currentCreationStep === 2 && <CreationStep02 />}
      {currentCreationStep === 3 && <CreationStep03 handleCreateProject={handleCreateProject} />}
      <TransactionConfirmationModal
        isOpen={isOpen}
        onDismiss={onDismiss}
        attemptingTxn={attemptingTxn}
        hash={hash}
        pendingText={pendingText}
        content={() =>
          errorMessage ? <TransactionErrorContent onDismiss={onDismiss} message={errorMessage || ''} /> : null
        }
      />
    </Flex>
  )
}

export default CreateProject
