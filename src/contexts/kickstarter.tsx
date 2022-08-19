import { useWalletModal } from "@koda-finance/summitswap-uikit"
import { useWeb3React } from "@web3-react/core"
import { KICKSTARTER_ADDRESS } from "constants/kickstarter"
import useBackedKickstarters, { BackedKickstarter } from "hooks/useBackedKickstarters"
import useDebounce from "hooks/useDebounce"
import useKickstarter from "hooks/useKickstarter"
import useKickstarterAccount, { KickstarterAccount } from "hooks/useKickstarterAccount"
import useKickstarterByAccount from "hooks/useKickstarterByAccount"
import useKickstarterFactory, { KickstarterFactory } from "hooks/useKickstarterFactory"
import useKickstarters, { Kickstarter, OrderBy, OrderDirection } from "hooks/useKickstarters"
import useKickstartersByTime from "hooks/useKickstartersByTime"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import login from "utils/login"

type KickstarterContextProps = {
  account: string | null | undefined
  onPresentConnectModal: () => void

  kickstarterFactory?: KickstarterFactory
  kickstarterAccount?: KickstarterAccount

  myKickstarters?: Kickstarter[]
  almostEndedKickstarters?: Kickstarter[]
  kickstarters?: Kickstarter[]
  backedProjects?: BackedKickstarter[]

  myProjectAddress?: string
  browseProjectAddress?: string
  backedProjectAddress?: string

  myProjectPage: number
  browseProjectPage: number
  backedProjectPage: number

  kickstarterOnMyProject?: Kickstarter
  kickstarterOnBrowseProject?: Kickstarter
  kickstarterOnBackedProject?: Kickstarter

  isPaymentOnMyProjectPage: boolean
  isPaymentOnBrowseProjectPage: boolean
  isPaymentOnBackedProjectPage: boolean

  handleMyProjectChanged: (address?: string) => void
  handleBrowseProjectChanged: (address?: string) => void
  handleSearchKickstarterChanged: (search: string) => void
  handleKickstarterOrderDirectionChanged: (orderDirection: OrderDirection) => void
  handleBackedProjectChanged: (address?: string) => void

  handleMyProjectPageChanged: (page: number) => void
  handleBrowseProjectPageChanged: (page: number) => void
  handleBackedProjectPageChanged: (page: number) => void

  handleIsPaymentOnMyProjectPage: (value: boolean) => void
  handleIsPaymentOnBrowseProjectPage: (value: boolean) => void
  handleIsPaymentOnBackedProjectPage: (value: boolean) => void
};


const KickstarterContext = createContext<KickstarterContextProps>({
  account: null,
  onPresentConnectModal: () => null,

  myProjectPage: 1,
  browseProjectPage: 1,
  backedProjectPage: 1,

  isPaymentOnMyProjectPage: false,
  isPaymentOnBrowseProjectPage: false,
  isPaymentOnBackedProjectPage: false,

  handleMyProjectChanged: (newAddress?: string) => null,
  handleBrowseProjectChanged: (newAddress?: string) => null,
  handleSearchKickstarterChanged: (search: string) => null,
  handleKickstarterOrderDirectionChanged: (orderDirection: OrderDirection) => null,
  handleBackedProjectChanged: (newAddress?: string) => null,

  handleMyProjectPageChanged: (page: number) => null,
  handleBrowseProjectPageChanged: (page: number) => null,
  handleBackedProjectPageChanged: (page: number) => null,

  handleIsPaymentOnMyProjectPage: (value: boolean) => null,
  handleIsPaymentOnBrowseProjectPage: (value: boolean) => null,
  handleIsPaymentOnBackedProjectPage: (value: boolean) => null,
});

export function KickstarterProvider({ children }: { children: React.ReactNode }) {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7

  const { account, activate, deactivate } = useWeb3React()

  const [myProjectAddress, setMyProjectAddress] = useState<string | undefined>()
  const [browseProjectAddress, setBrowseProjectAddress] = useState<string | undefined>()
  const [searchKickstarter, setSearchKickstarter] = useState<string | undefined>()
  const [kickstarterOrderDirection, setKickstarterOrderDirection] = useState<OrderDirection>(OrderDirection.ASC)
  const [backedProjectAddress, setBackedProjectAddress] = useState<string | undefined>()

  const [myProjectPage, setMyProjectPage] = useState<number>(1)
  const [browseProjectPage, setBrowseProjectPage] = useState<number>(1)
  const [backedProjectPage, setBackedProjectPage] = useState<number>(1)

  const [isPaymentOnMyProjectPage, setIsPaymentOnMyProjectPage] = useState<boolean>(false)
  const [isPaymentOnBrowseProjectPage, setIsPaymentOnBrowseProjectPage] = useState<boolean>(false)
  const [isPaymentOnBackedProjectPage, setIsPaymentOnBackedProjectPage] = useState<boolean>(false)

  const searchValue = useDebounce(searchKickstarter || "", 600)
  const almostEndedKickstarters = useKickstartersByTime(currentTimestamp, currentTimestamp + ONE_WEEK_IN_SECONDS, 3)
  const kickstarterFactory = useKickstarterFactory(KICKSTARTER_ADDRESS)
  const kickstarterAccount = useKickstarterAccount(account)
  const myKickstarters = useKickstarterByAccount(account, myProjectPage)
  const kickstarters = useKickstarters(searchValue, OrderBy.TITLE, kickstarterOrderDirection, browseProjectPage)
  const backedProjects = useBackedKickstarters(account, backedProjectPage)

  const kickstarterOnMyProject = useKickstarter(myProjectAddress)
  const kickstarterOnBrowseProject = useKickstarter(browseProjectAddress)
  const kickstarterOnBackedProject = useKickstarter(backedProjectAddress)

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
        onPresentConnectModal,

        kickstarterFactory,
        kickstarterAccount,

        myKickstarters,
        almostEndedKickstarters,
        kickstarters,
        backedProjects,

        myProjectAddress,
        browseProjectAddress,
        backedProjectAddress,
        kickstarterOnMyProject,
        kickstarterOnBrowseProject,
        kickstarterOnBackedProject,

        myProjectPage,
        browseProjectPage,
        backedProjectPage,

        isPaymentOnMyProjectPage: isPaymentOnMyProjectPage && !!account,
        isPaymentOnBrowseProjectPage: isPaymentOnBrowseProjectPage && !!account,
        isPaymentOnBackedProjectPage: isPaymentOnBackedProjectPage && !!account,

        handleMyProjectChanged: setMyProjectAddress,
        handleBrowseProjectChanged: setBrowseProjectAddress,
        handleSearchKickstarterChanged: setSearchKickstarter,
        handleKickstarterOrderDirectionChanged: setKickstarterOrderDirection,
        handleBackedProjectChanged: setBackedProjectAddress,

        handleMyProjectPageChanged: setMyProjectPage,
        handleBrowseProjectPageChanged: setBrowseProjectPage,
        handleBackedProjectPageChanged: setBackedProjectPage,

        handleIsPaymentOnMyProjectPage: setIsPaymentOnMyProjectPage,
        handleIsPaymentOnBrowseProjectPage: setIsPaymentOnBrowseProjectPage,
        handleIsPaymentOnBackedProjectPage: setIsPaymentOnBackedProjectPage,
      }}
    >
      {children}
    </KickstarterContext.Provider>
  )
}

export function useKickstarterContext() {
  return useContext(KickstarterContext)
}
