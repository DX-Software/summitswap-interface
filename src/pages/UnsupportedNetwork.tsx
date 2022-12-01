import { useWeb3React } from '@web3-react/core'
import config from 'components/Menu/config'
import React, { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

function UnsupportedNetwork({ children }: Props) {
  const { chainId: connectedChainId, active, deactivate } = useWeb3React()
  const location = useLocation()

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

  return <>{children}</>
}

export default React.memo(UnsupportedNetwork)
