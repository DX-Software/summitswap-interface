import { useWeb3React } from '@web3-react/core'
import config from 'components/Menu/config'
import { WALLET_LOGIN_ACCESS_TOKEN_KEY } from 'constants/walletLogin'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

function UnsupportedNetwork({ children }: Props) {
  const { chainId: connectedChainId, active, deactivate, account } = useWeb3React()
  const location = useLocation()
  const [currentWallet, setCurrentWallet] = useState(account)

  const supportedChainId = useMemo(() => {
    const menu = config.find((entry) => `${location.pathname}`.startsWith(`${entry.href}`))
    return menu?.supportedChainId
  }, [location])

  const isUnsupportedChainId = useMemo(() => {
    if (!supportedChainId) return false

    return supportedChainId !== connectedChainId
  }, [supportedChainId, connectedChainId])

  useEffect(() => {
    if (active && isUnsupportedChainId) {
      deactivate()
    }
  }, [active, isUnsupportedChainId, deactivate])

  useEffect(() => {
    if (currentWallet !== account) {
      localStorage.removeItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)
      setCurrentWallet(currentWallet)
    }
  }, [account, currentWallet, setCurrentWallet])

  return <>{children}</>
}

export default React.memo(UnsupportedNetwork)
