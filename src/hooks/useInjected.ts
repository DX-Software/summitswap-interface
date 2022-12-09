import { InjectedConnector } from '@web3-react/injected-connector'
import { BSC_CHAIN_ID, ETH_CHAIN_ID } from 'constants/index'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const useInjected = () => {
  const location = useLocation()
  const expectedChainId = useMemo(() => {
    return location.pathname.includes('whitelabel-nft') ? ETH_CHAIN_ID : BSC_CHAIN_ID
  }, [location])

  const injected = useMemo(() => {
    return new InjectedConnector({
      supportedChainIds: [expectedChainId],
    })
  }, [expectedChainId])

  return injected
}

export default useInjected
