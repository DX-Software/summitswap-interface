import { Button, Flex, useWalletModal } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback } from 'react'
import login from 'utils/login'
import { TranslateString } from 'utils/translateTextHelpers'
import CreateWhitelabelNftForm from './CreateForm'

export default function WhitelabelNft() {
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
      <>
        <Flex mb={3} mt={40} justifyContent="center">
          <Button style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
            {TranslateString(292, 'CONNECT WALLET')}
          </Button>
        </Flex>
      </>
    )
  }

  return (
    <div className="main-content">
      <CreateWhitelabelNftForm />
    </div>
  )
}
