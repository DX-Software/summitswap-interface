import { NetworkConnector } from 'connectors/NetworkConnector'
import { NETWORK_URLS } from 'constants/index'
import { useMemo } from 'react'

const useNetwork = (chainId: number) => {
  const network = useMemo(() => {
    return new NetworkConnector({
      urls: { [chainId]: NETWORK_URLS[chainId] },
      defaultChainId: chainId,
    })
  }, [chainId])

  return network
}

export default useNetwork
