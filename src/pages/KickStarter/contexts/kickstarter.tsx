import { ETHER } from "@koda-finance/summitswap-sdk"
import { useWalletModal } from "@koda-finance/summitswap-uikit"
import { useWeb3React } from "@web3-react/core"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useCurrencyBalance } from "state/wallet/hooks"
import login from "utils/login"

type KickstarterContextProps = {
  account?: string | null
  accountBalance: string | undefined
  onPresentConnectModal: () => void
};

const KickstarterContext = createContext<KickstarterContextProps>({
  accountBalance: undefined,
  onPresentConnectModal: () => null,
});

export function KickstarterProvider({ children }: { children: React.ReactNode }) {
  const { account, activate, deactivate } = useWeb3React()
  const accountBalance = useCurrencyBalance(account ?? undefined, ETHER)

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)


  return (
    <KickstarterContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        account,
        accountBalance: accountBalance?.toSignificant(6),
        onPresentConnectModal,
      }}
    >
      {children}
    </KickstarterContext.Provider>
  )
}

export function useKickstarterContext() {
  return useContext(KickstarterContext)
}
