import config from 'components/Menu/config'
import { BSC_CHAIN_ID } from 'constants/index'
import { useMemo } from 'react'

const useChainId = () => {
  const { location } = window

  const supportedChainId = useMemo(() => {
    const menu = config.find((entry) => `${location.href}`.includes(`${entry.href}`))
    return menu?.supportedChainId || BSC_CHAIN_ID
  }, [location.href])

  return supportedChainId
}

export default useChainId
