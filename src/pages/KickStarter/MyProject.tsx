import { AddIcon, Button, Flex, Heading, useWalletModal, WalletIcon } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useState } from 'react'
import login from 'utils/login'
import { TranslateString } from 'utils/translateTextHelpers'
import CreateProject from './CreateProject'
import { ProjectCreation } from './types'

type Props = {
  isCreate: boolean
  toggleCreate: () => void
  currentCreationStep: number
  setCurrentCreationStep: (step: number) => void
  projectCreation: ProjectCreation
  handleOnProjectCreationChanged: (newUpdate: { [key: string]: number }) => void
}

function MyProject({
  isCreate,
  toggleCreate,
  currentCreationStep,
  setCurrentCreationStep,
  projectCreation,
  handleOnProjectCreationChanged,
}: Props) {
  const { account, activate, deactivate } = useWeb3React()
  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  if (!account) {
    return (
      <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300}>
        <Heading size="lg" color="primaryDark" style={{ fontWeight: 400 }} marginBottom={38} textAlign="center">
          Please connect your wallet to view your projects
        </Heading>
        <Button
          variant="tertiary"
          startIcon={<WalletIcon />}
          style={{ fontFamily: 'Poppins' }}
          onClick={onPresentConnectModal}
        >
          Connect Your Wallet
        </Button>
      </Flex>
    )
  }

  if (isCreate) {
    return (
      <CreateProject
        toggleCreate={toggleCreate}
        currentCreationStep={currentCreationStep}
        setCurrentCreationStep={setCurrentCreationStep}
        projectCreation={projectCreation}
        handleOnProjectCreationChanged={handleOnProjectCreationChanged}
      />
    )
  }
  return (
    <>
      <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300}>
        <Heading size="lg" color="primaryDark" style={{ fontWeight: 400 }} marginBottom={38} textAlign="center">
          You don’t have any ongoing project
        </Heading>
        <Button startIcon={<AddIcon color="text" />} style={{ fontFamily: 'Poppins' }} onClick={toggleCreate}>
          Create New Project
        </Button>
      </Flex>
    </>
  )
}

export default React.memo(MyProject)
