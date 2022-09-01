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
import { PRESALE_FACTORY_ADDRESS } from 'constants/presale'
import login from 'utils/login'
import CreatePresale from './CreatePresale'
import AdminPanel from './AdminPanel'
import MyPresales from './MyPresales'

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
    if (buttonIndex === 1 && !accountIsAdmin) setButtonIndex(0)
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
          <ButtonMenuItem>Create Presale</ButtonMenuItem>
          {accountIsAdmin ? <ButtonMenuItem>Admin Panel</ButtonMenuItem> : <></>}
          <ButtonMenuItem>My Presales</ButtonMenuItem>
        </ButtonMenu>
      </Box>
      {buttonIndex === 0 && <CreatePresale setHomeButtonIndex={setButtonIndex} />}
      {accountIsAdmin && buttonIndex === 1 && <AdminPanel />}
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
