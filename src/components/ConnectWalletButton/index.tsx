import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, ButtonProps, useWalletModal } from '@summitswap/uikit'
import { injected, walletconnect } from 'connectors'
import useI18n from 'hooks/useI18n'
import login from 'utils/login'

const UnlockButton: React.FC<ButtonProps> = props => {
  const TranslateString = useI18n()
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId: string) => {
    login(connectorId, activate)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <Button style={{fontFamily:'Poppins'}} onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'UNLOCK WALLET')}
    </Button>
  )
}

export default UnlockButton
