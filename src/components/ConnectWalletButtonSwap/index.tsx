import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, ButtonProps, useWalletModal } from '@summitswap-uikit'
import { injected, walletconnect } from 'connectors'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n()
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId: string) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const MyText = styled.span`
    font-weight: 800;
    font-size: 18px;
  `

  return (
    <Button scale='xxs' onClick={onPresentConnectModal} {...props} style={{ borderRadius: '30px', width: '65%', paddingTop: 25, paddingBottom: 25 }}>
      <MyText>{TranslateString(292, 'UNLOCK WALLET')}</MyText>
    </Button>
  )
}

export default UnlockButton
