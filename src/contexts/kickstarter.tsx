import { ETHER } from "@koda-finance/summitswap-sdk"
import { useWalletModal } from "@koda-finance/summitswap-uikit"
import { useWeb3React } from "@web3-react/core"
import { KICKSTARTER_FACTORY_ADDRESS } from "constants/kickstarter"
import useBackedKickstarters, { BackedKickstarter } from "hooks/useBackedKickstarters"
import useDebounce from "hooks/useDebounce"
import useKickstarter from "hooks/useKickstarter"
import useKickstarterAccount, { KickstarterAccount } from "hooks/useKickstarterAccount"
import useKickstarterByAccount from "hooks/useKickstarterByAccount"
import useKickstarterFactory, { KickstarterFactory } from "hooks/useKickstarterFactory"
import useKickstarters, { Kickstarter, OrderBy, OrderDirection } from "hooks/useKickstarters"
import useKickstartersByTime from "hooks/useKickstartersByTime"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useCurrencyBalance } from "state/wallet/hooks"
import login from "utils/login"

type KickstarterContextProps = {
  account: string | null | undefined
  accountBalance: string | undefined
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

  backingAmountOnMyProjectPage: string
  backingAmountOnBrowseProjectPage: string
  backingAmountOnBackedProjectPage: string

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

  handleBackingAmountOnMyProjectPageChanged: (value: string) => void
  handleBackingAmountOnBrowseProjectPageChanged: (value: string) => void
  handleBackingAmountOnBackedProjectPageChanged: (value: string) => void
};


const KickstarterContext = createContext<KickstarterContextProps>({
  account: null,
  accountBalance: undefined,
  onPresentConnectModal: () => null,

  myProjectPage: 1,
  browseProjectPage: 1,
  backedProjectPage: 1,

  isPaymentOnMyProjectPage: false,
  isPaymentOnBrowseProjectPage: false,
  isPaymentOnBackedProjectPage: false,

  backingAmountOnMyProjectPage: "",
  backingAmountOnBrowseProjectPage: "",
  backingAmountOnBackedProjectPage: "",

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

  handleBackingAmountOnMyProjectPageChanged: (value: string) => null,
  handleBackingAmountOnBrowseProjectPageChanged: (value: string) => null,
  handleBackingAmountOnBackedProjectPageChanged: (value: string) => null,
});

export function KickstarterProvider({ children }: { children: React.ReactNode }) {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7

  const { account, activate, deactivate } = useWeb3React()
  const accountBalance = useCurrencyBalance(account ?? undefined, ETHER)

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

  const [backingAmountOnMyProjectPage, setBackingAmountOnMyProjectPage] = useState("")
  const [backingAmountOnBrowseProjectPage, setBackingAmountOnBrowseProjectPage] = useState("")
  const [backingAmountOnBackedProjectPage, setBackingAmountOnBackedProjectPage] = useState("")

  const searchValue = useDebounce(searchKickstarter || "", 600)
  const almostEndedKickstarters = useKickstartersByTime(currentTimestamp, currentTimestamp + ONE_WEEK_IN_SECONDS, 3)
  const kickstarterFactory = useKickstarterFactory(KICKSTARTER_FACTORY_ADDRESS)
  const kickstarterAccount = useKickstarterAccount(account)
  const myKickstarters = useKickstarterByAccount(account, myProjectPage)
  const kickstarters = useKickstarters(searchValue, OrderBy.TITLE, kickstarterOrderDirection, browseProjectPage)
  const backedProjects = useBackedKickstarters(account, backedProjectPage)

  const kickstarterOnMyProject = useKickstarter(myProjectAddress)
  const kickstarterOnBrowseProject = useKickstarter(browseProjectAddress)
  const kickstarterOnBackedProject = useKickstarter(backedProjectAddress)

  useEffect(() => {
    setBackingAmountOnMyProjectPage("")
  }, [isPaymentOnMyProjectPage])

  useEffect(() => {
    setBackingAmountOnBrowseProjectPage("")
  }, [isPaymentOnBrowseProjectPage])

  useEffect(() => {
    setBackingAmountOnBackedProjectPage("")
  }, [isPaymentOnBackedProjectPage])

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const handleBackingAmountOnMyProjectPageChanged = useCallback((value: string) => {
    if ((value !== "" && value.match("^[0-5](\\.[0-9]{0,18})?$") == null)) return
    setBackingAmountOnMyProjectPage(value)
  }, [])

  const handleBackingAmountOnBrowseProjectPageChanged = useCallback((value: string) => {
    if ((value !== "" && value.match("^[0-5](\\.[0-9]{0,18})?$") == null)) return
    setBackingAmountOnBrowseProjectPage(value)
  }, [])

  const handleBackingAmountOnBackedProjectPageChanged = useCallback((value: string) => {
    if ((value !== "" && value.match("^[0-5](\\.[0-9]{0,18})?$") == null)) return
    setBackingAmountOnBackedProjectPage(value)
  }, [])

  return (
    <KickstarterContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        account,
        accountBalance: accountBalance?.toSignificant(6),
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

        isPaymentOnMyProjectPage,
        isPaymentOnBrowseProjectPage,
        isPaymentOnBackedProjectPage,

        backingAmountOnMyProjectPage,
        backingAmountOnBrowseProjectPage,
        backingAmountOnBackedProjectPage,

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

        handleBackingAmountOnMyProjectPageChanged,
        handleBackingAmountOnBrowseProjectPageChanged,
        handleBackingAmountOnBackedProjectPageChanged,
      }}
    >
      {children}
    </KickstarterContext.Provider>
  )
}

export function useKickstarterContext() {
  return useContext(KickstarterContext)
}
