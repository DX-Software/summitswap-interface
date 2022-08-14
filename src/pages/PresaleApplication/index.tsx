/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { TranslateString } from 'utils/translateTextHelpers'
import { Button, useWalletModal, Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import login from 'utils/login'
import CreatePresale from './CreatePresale'

export default function PresaleApplication() {
  const { account, activate, deactivate } = useWeb3React()
  const [buttonIndex, setButtonIndex] = useState(0)

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )
  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return true ? (
    <>
      <Box marginY="24px">
        <ButtonMenu activeIndex={buttonIndex} onItemClick={(index) => setButtonIndex(index)}>
          <ButtonMenuItem>Create Presale</ButtonMenuItem>
          <ButtonMenuItem>My Presales</ButtonMenuItem>
        </ButtonMenu>
      </Box>
      {buttonIndex === 0 && <CreatePresale />}
    </>
  ) : (
    <Button m={40} style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
      {TranslateString(292, 'CONNECT WALLET')}
    </Button>
  )
}
