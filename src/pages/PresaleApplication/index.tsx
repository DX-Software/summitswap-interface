/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { TranslateString } from 'utils/translateTextHelpers'
import {
  Box,
  Text,
  Button,
  WalletIcon,
  ButtonMenu,
  useWalletModal,
  ButtonMenuItem,
} from '@koda-finance/summitswap-uikit'
import { useFactoryPresaleContract } from 'hooks/useContract'
import login from 'utils/login'
import CreatePresale from './CreatePresale'
import AdminPanel from './AdminPanel'
import MyPresales from './MyPresales'

export default function PresaleApplication() {
  const { account, activate, deactivate } = useWeb3React()
  const [buttonIndex, setButtonIndex] = useState(0)
  const [accountIsAdminOrOwner, setAccountIsAdminOrOwner] = useState(false)

  const factoryContract = useFactoryPresaleContract()

  useEffect(() => {
    async function checkAccountIsAdmin() {
      setAccountIsAdminOrOwner(
        (await factoryContract?.isAdmin(account)) || (await factoryContract?.owner()) === account
      )
    }
    if (account && factoryContract) {
      checkAccountIsAdmin()
    }
  }, [account, factoryContract])

  useEffect(() => {
    if (buttonIndex === 1 && !accountIsAdminOrOwner) setButtonIndex(0)
  }, [accountIsAdminOrOwner, buttonIndex])

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
          <ButtonMenuItem>Create Presale</ButtonMenuItem>
          {accountIsAdminOrOwner ? <ButtonMenuItem>Admin Panel</ButtonMenuItem> : <></>}
          <ButtonMenuItem>My Presales</ButtonMenuItem>
        </ButtonMenu>
      </Box>
      {buttonIndex === 0 && <CreatePresale setHomeButtonIndex={setButtonIndex} />}
      {accountIsAdminOrOwner && buttonIndex === 1 && <AdminPanel />}
      {buttonIndex === 2 && <MyPresales setHomeButtonIndex={setButtonIndex} />}
    </>
  ) : (
    <>
      <Text marginTop="100px" fontSize="20px" color="primaryDark">
        Please connect your wallet
      </Text>
      <Button
        startIcon={<WalletIcon />}
        variant="tertiary"
        m={40}
        style={{ fontFamily: 'Poppins' }}
        onClick={onPresentConnectModal}
      >
        {TranslateString(292, 'CONNECT WALLET')}
      </Button>
    </>
  )
}
