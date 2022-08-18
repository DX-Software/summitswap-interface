import { useWalletModal } from "@koda-finance/summitswap-uikit"
import { useWeb3React } from "@web3-react/core"
import useBackedKickstarter, { BackedKickstarter } from "hooks/useBackedKickstarter"
import useDebounce from "hooks/useDebounce"
import useKickstarterByAccount from "hooks/useKickstarterByAccount"
import useKickstarters, { Kickstarter, OrderBy, OrderDirection } from "hooks/useKickstarters"
import useKickstartersByTime from "hooks/useKickstartersByTime"
import React, { createContext, useCallback, useContext, useState } from "react"
import login from "utils/login"

type KickstarterContextProps = {
  account: string | null | undefined
  onPresentConnectModal: () => void

  myKickstarters?: Kickstarter[]

  kickstarters?: Kickstarter[]
  almostEndedKickstarters?: Kickstarter[]

  backedProjects?: BackedKickstarter[]
  backedProjectAddress?: string,
  handleBackedProjectChanged: (address?: string) => void

  browseProjectAddress?: string
  handleBrowseProjectChanged: (address?: string) => void

  handleKickstarterOrderDirectionChanged: (orderDirection: OrderDirection) => void
  handleSearchKickstarterChanged: (search: string) => void
};


const KickstarterContext = createContext<KickstarterContextProps>({
  account: null,
  onPresentConnectModal: () => null,

  handleBackedProjectChanged: (newAddress?: string) => null,
  handleBrowseProjectChanged: (newAddress?: string) => null,

  handleKickstarterOrderDirectionChanged: (orderDirection: OrderDirection) => null,
  handleSearchKickstarterChanged: (search: string) => null
});

export function KickstarterProvider({ children }: { children: React.ReactNode }) {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7

  const { account, activate, deactivate } = useWeb3React()
  const [kickstarterOrderDirection, setKickstarterOrderDirection] = useState<OrderDirection>(OrderDirection.ASC)
  const [searchKickstarter, setSearchKickstarter] = useState<string | undefined>()
  const searchValue = useDebounce(searchKickstarter || "", 1000)

  const almostEndedKickstarters = useKickstartersByTime(currentTimestamp, currentTimestamp + ONE_WEEK_IN_SECONDS, 3)
  const myKickstarters = useKickstarterByAccount(account)
  const kickstarters = useKickstarters(searchValue, OrderBy.TITLE, kickstarterOrderDirection)
  const backedProjects = useBackedKickstarter(account)
  const [backedProjectAddress, setBackedProjectAddress] = useState<string | undefined>()
  const [browseProjectAddress, setBrowseProjectAddress] = useState<string | undefined>()

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

  const handleBrowseProjectChanged = (newAddress?: string) => {
    setBrowseProjectAddress(newAddress)
  }

  const handleKickstarterOrderDirectionChanged = (newOrderDirection: OrderDirection) => {
    setKickstarterOrderDirection(newOrderDirection)
  }

  const handleSearchKickstarterChanged = (newSearchValue: string) => {
    setSearchKickstarter(newSearchValue)
  }

  return (
    <KickstarterContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        account,
        onPresentConnectModal,

        myKickstarters,

        kickstarters,
        almostEndedKickstarters,

        backedProjects,
        backedProjectAddress,
        handleBackedProjectChanged,

        browseProjectAddress,
        handleBrowseProjectChanged,

        handleKickstarterOrderDirectionChanged,
        handleSearchKickstarterChanged,
      }}
    >
      {children}
    </KickstarterContext.Provider>
  )
}

export function useKickstarterContext() {
  return useContext(KickstarterContext)
}
