import { Button, Flex, Heading, useWalletModal } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import config from 'components/Menu/config'
import { setupNetwork } from 'connectors'
import { BSC_CHAIN_ID, ETH_CHAIN_ID } from 'constants/index'
import React, { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import login from 'utils/login'

type Props = {
  children: React.ReactNode
}

function UnsupportedNetwork({ children }: Props) {
  const { chainId: connectedChainId, active, account, activate, deactivate } = useWeb3React()
  const location = useLocation()

  const supportedChainIds = useMemo(() => {
    const menu = config.find((entry) => `${location.pathname}`.startsWith(`${entry.href}`))
    return menu?.supportedChainIds
  }, [location])

  const isUnsupportedChainId = useMemo(() => {
    if (!supportedChainIds || supportedChainIds.length === 0) return false

    return !supportedChainIds.includes(connectedChainId || -1)
  }, [supportedChainIds, connectedChainId])

  const expectedChainId = useMemo(() => {
    return location.pathname.includes('whitelabel-nft') ? ETH_CHAIN_ID : BSC_CHAIN_ID
  }, [location.pathname])

  const handleLogin = useCallback(
    async (connectorId: string) => {
      if (connectedChainId !== expectedChainId) {
        if (connectorId === 'injected') {
          await setupNetwork(expectedChainId)
        }
        await login(connectorId, activate, expectedChainId)
      }
    },
    [connectedChainId, expectedChainId, activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <>
      {isUnsupportedChainId ? (
        <Flex marginY="48px" flexDirection="column">
          <Heading size="lg" marginBottom="12px" textAlign="center">
            {active ? 'Unsupported Network' : 'Please connect your wallet before continuing.'}
          </Heading>
          <Button onClick={onPresentConnectModal} margin="auto">
            {active ? 'Change Network' : 'Connect Wallet'}
          </Button>
        </Flex>
      ) : (
        children
      )}
    </>
  )
}

export default React.memo(UnsupportedNetwork)
