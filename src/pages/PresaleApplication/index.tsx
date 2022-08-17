/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { TranslateString } from 'utils/translateTextHelpers'
import { Button, useWalletModal, Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import { useFactoryPresaleContract } from 'hooks/useContract'
import { PRESALE_FACTORY_ADDRESS } from 'constants/presale'
import login from 'utils/login'
import CreatePresale from './CreatePresale'
import AdminPanel from './AdminPanel'

export default function PresaleApplication() {
  const { account, activate, deactivate } = useWeb3React()
  const [buttonIndex, setButtonIndex] = useState(0)
  const [accountIsAdmin, setAccountIsAdmin] = useState(false)

  const factoryContract = useFactoryPresaleContract(PRESALE_FACTORY_ADDRESS)

  useEffect(() => {
    async function checkAccountIsAdmin() {
      setAccountIsAdmin(await factoryContract?.isAdmin(account))
    }
    if (account && factoryContract) {
      checkAccountIsAdmin()
    }
  }, [account, factoryContract])

  useEffect(() => {
    if (buttonIndex === 0 && !accountIsAdmin) setButtonIndex(1)
  }, [accountIsAdmin, buttonIndex])

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )
  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return account ? (
    <>
      <Box marginY="24px">
        <ButtonMenu activeIndex={buttonIndex} onItemClick={(index) => setButtonIndex(index)}>
          {accountIsAdmin ? <ButtonMenuItem>Admin Panel</ButtonMenuItem> : <></>}
          <ButtonMenuItem>Create Presale</ButtonMenuItem>
          <ButtonMenuItem>My Presales</ButtonMenuItem>
        </ButtonMenu>
      </Box>
      {accountIsAdmin && buttonIndex === 0 && <AdminPanel />}
      {buttonIndex === 1 && <CreatePresale />}
    </>
  ) : (
    <Button m={40} style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
      {TranslateString(292, 'CONNECT WALLET')}
    </Button>
  )
}
