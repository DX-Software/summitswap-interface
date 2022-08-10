import { useWalletModal } from "@koda-finance/summitswap-uikit";
import { useWeb3React } from "@web3-react/core";
import React, { createContext, useCallback, useContext, useState } from "react"
import login from "utils/login";

type KickstarterContextProps = {
  account: string | null | undefined
  onPresentConnectModal: () => void
};


const KickstarterContext = createContext<KickstarterContextProps>({
  account: null,
  onPresentConnectModal: () => null,
});

export function KickstarterProvider({ children }: { children: React.ReactNode }) {
  const { account, activate, deactivate } = useWeb3React()

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
        onPresentConnectModal
      }}
    >
      {children}
    </KickstarterContext.Provider>
  )
}

export function useKickstarterContext() {
  return useContext(KickstarterContext);
}
