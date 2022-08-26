import { useWalletModal } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { createContext, useCallback, useContext } from 'react'
import login from 'utils/login'

type WhitelabelNftContextProps = {
  account: string | null | undefined
  onPresentConnectModal: () => void
}

const WhitelabelNftContext = createContext<WhitelabelNftContextProps>({
  account: null,
  onPresentConnectModal: () => null,
})

export function WhitelabelNftProvider({ children }: { children: React.ReactNode }) {
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <WhitelabelNftContext.Provider
      value={{
        account,
        onPresentConnectModal,
      }}
    >
      {children}
    </WhitelabelNftContext.Provider>
  )
}

export function useWhitelabelNftContext() {
  return useContext(WhitelabelNftContext)
}
