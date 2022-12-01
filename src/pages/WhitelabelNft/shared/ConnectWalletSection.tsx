import { Button, Flex, Heading, useWalletModal, WalletIcon } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback } from 'react'
import login from 'utils/login'

function ConnectWalletSection() {
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300}>
      <Heading size="lg" color="primaryDark" style={{ fontWeight: 400 }} marginBottom={38} textAlign="center">
        Please connect your wallet before continuing.
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

export default React.memo(ConnectWalletSection)
