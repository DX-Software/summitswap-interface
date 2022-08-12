import { useWalletModal } from "@koda-finance/summitswap-uikit";
import { useWeb3React } from "@web3-react/core";
import useBackedKickstarter, { Contribution } from "hooks/useBackedKickstarter";
import React, { createContext, useCallback, useContext, useState } from "react"
import login from "utils/login";

type KickstarterContextProps = {
  account: string | null | undefined
  onPresentConnectModal: () => void
  backedProjects?: Contribution[]
  backedProjectAddress?: string,
  handleBackedProjectChanged: (address?: string) => void
};


const KickstarterContext = createContext<KickstarterContextProps>({
  account: null,
  onPresentConnectModal: () => null,
  backedProjects: undefined,
  backedProjectAddress: undefined,
  handleBackedProjectChanged: (newAddress?: string) => null
});

export function KickstarterProvider({ children }: { children: React.ReactNode }) {
  const { account, activate, deactivate } = useWeb3React()
  const backedProjects = useBackedKickstarter(account)
  const [backedProjectAddress, setBackedProjectAddress] = useState<string | undefined>()

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const handleBackedProjectChanged = (newAddress?: string) => {
    setBackedProjectAddress(newAddress)
  }

  return (
    <KickstarterContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        account,
        onPresentConnectModal,

        backedProjects,
        backedProjectAddress,
        handleBackedProjectChanged,

      }}
    >
      {children}
    </KickstarterContext.Provider>
  )
}

export function useKickstarterContext() {
  return useContext(KickstarterContext);
}
