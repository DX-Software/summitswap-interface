import { Button, Flex, Heading, useWalletModal, WalletIcon } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useState, useCallback } from 'react'
import login from 'utils/login'
import { TranslateString } from 'utils/translateTextHelpers'

function BackedProject() {
  const { account, activate, deactivate } = useWeb3React()
  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <>
      {!account && (
        <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300}>
          <Heading size='lg' color="primaryDark" style={{ fontWeight: 400 }} marginBottom={38} textAlign="center">
            Please connect your wallet to view your projects
          </Heading>
          <Button variant='tertiary' startIcon={<WalletIcon />} style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
            {TranslateString(292, 'CONNECT WALLET')}
          </Button>
        </Flex>
      )}
    </>
  )
}

export default BackedProject;
