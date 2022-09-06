import { ETHER } from "@koda-finance/summitswap-sdk"
import { useWalletModal } from "@koda-finance/summitswap-uikit"
import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import { KICKSTARTER_FACTORY_ADDRESS } from "constants/kickstarter"
import useBackedKickstarters, { BackedKickstarter } from "hooks/useBackedKickstarters"
import useBackedKickstarterByAccount from "hooks/useBackKickstarterByAccount"
import useBackedKickstartersByAddress, { BackedKickstarter as BackedKickstarterByAddress } from "hooks/useBackKickstartersByAddress"
import useDebounce from "hooks/useDebounce"
import useKickstarter from "hooks/useKickstarter"
import useKickstarterAccount, { KickstarterAccount } from "hooks/useKickstarterAccount"
import useKickstarterByAccount from "hooks/useKickstarterByAccount"
import useKickstarterFactory, { KickstarterFactory } from "hooks/useKickstarterFactory"
import useKickstarters, { Kickstarter, OrderBy, OrderDirection } from "hooks/useKickstarters"
import useKickstartersByTime from "hooks/useKickstartersByTime"
import { NavItem, Project } from "pages/KickStarter/types"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useCurrencyBalance } from "state/wallet/hooks"
import login from "utils/login"

type KickstarterContextProps = {
  account: string | null | undefined
  accountBalance: string | undefined
  onPresentConnectModal: () => void

  isCreate: boolean
  currentCreationStep: number
  projectCreation: Project

  kickstarterFactory?: KickstarterFactory
  kickstarterAccount?: KickstarterAccount

  myKickstarters?: Kickstarter[]
  almostEndedKickstarters?: Kickstarter[]
  kickstarters?: Kickstarter[]

  myProjectAddress?: string
  browseProjectAddress?: string

  myProjectPage: number
  browseProjectPage: number

  kickstarterOnMyProject?: Kickstarter
  kickstarterOnBrowseProject?: Kickstarter

  isPaymentOnMyProjectPage: boolean
  isPaymentOnBrowseProjectPage: boolean

  backingAmountOnMyProjectPage: string
  backingAmountOnBrowseProjectPage: string

  currentBackedAmountOnMyProjectPage?: BigNumber
  currentBackedAmountOnBrowseProjectPage?: BigNumber

  contributorsOnMyProject?: BackedKickstarterByAddress[]
  contributorsOnBrowseProject?: BackedKickstarterByAddress[]

  toggleIsCreate: () => void
  handleCurrentCreationStepChanged: (value: number) => void
  handleOnProjectCreationChanged: (newUpdate: { [key: string]: any }) => void

  handleMyProjectChanged: (address?: string) => void
  handleBrowseProjectChanged: (address?: string) => void
  handleSearchKickstarterChanged: (search: string) => void
  handleKickstarterOrderDirectionChanged: (orderDirection: OrderDirection) => void

  handleMyProjectPageChanged: (page: number) => void
  handleBrowseProjectPageChanged: (page: number) => void

  handleIsPaymentOnMyProjectPage: (value: boolean) => void
  handleIsPaymentOnBrowseProjectPage: (value: boolean) => void

  handleBackingAmountOnMyProjectPageChanged: (value: string) => void
  handleBackingAmountOnBrowseProjectPageChanged: (value: string) => void
};

const initialProjectCreation = {
  title: '',
  creator: '',
  projectDescription: '',
  rewardDescription: '',
  goals: '0',
  minimumBacking: '0',
  projectDueDate: '',
  rewardDistribution: '',
}

const KickstarterContext = createContext<KickstarterContextProps>({
  account: null,
  accountBalance: undefined,
  onPresentConnectModal: () => null,

  isCreate: false,
  currentCreationStep: 1,
  projectCreation: initialProjectCreation,

  myProjectPage: 1,
  browseProjectPage: 1,

  isPaymentOnMyProjectPage: false,
  isPaymentOnBrowseProjectPage: false,

  backingAmountOnMyProjectPage: "",
  backingAmountOnBrowseProjectPage: "",

  toggleIsCreate: () => null,
  handleCurrentCreationStepChanged: () => null,
  handleOnProjectCreationChanged: (newUpdate: { [key: string]: any }) => null,

  handleMyProjectChanged: (newAddress?: string) => null,
  handleBrowseProjectChanged: (newAddress?: string) => null,
  handleSearchKickstarterChanged: (search: string) => null,
  handleKickstarterOrderDirectionChanged: (orderDirection: OrderDirection) => null,

  handleMyProjectPageChanged: (page: number) => null,
  handleBrowseProjectPageChanged: (page: number) => null,

  handleIsPaymentOnMyProjectPage: (value: boolean) => null,
  handleIsPaymentOnBrowseProjectPage: (value: boolean) => null,

  handleBackingAmountOnMyProjectPageChanged: (value: string) => null,
  handleBackingAmountOnBrowseProjectPageChanged: (value: string) => null,
});

export function KickstarterProvider({ children }: { children: React.ReactNode }) {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7

  const { account, activate, deactivate } = useWeb3React()
  const accountBalance = useCurrencyBalance(account ?? undefined, ETHER)

  const [isCreate, setIsCreate] = useState(false)
  const [currentCreationStep, setCurrentCreationStep] = useState(1)
  const [projectCreation, setProjectCreation] = useState<Project>(initialProjectCreation)

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

  const contributionOnMyProjectPage = useBackedKickstarterByAccount(myProjectAddress, account)
  const contributionOnBrowseProjectPage = useBackedKickstarterByAccount(browseProjectAddress, account)

  const searchValue = useDebounce(searchKickstarter || "", 600)
  const almostEndedKickstarters = useKickstartersByTime(currentTimestamp, currentTimestamp + ONE_WEEK_IN_SECONDS, 3)
  const kickstarterFactory = useKickstarterFactory(KICKSTARTER_FACTORY_ADDRESS)
  const kickstarterAccount = useKickstarterAccount(account)
  const myKickstarters = useKickstarterByAccount(account, myProjectPage)
  const kickstarters = useKickstarters(searchValue, OrderBy.TITLE, kickstarterOrderDirection, browseProjectPage)

  const kickstarterOnMyProject = useKickstarter(myProjectAddress)
  const kickstarterOnBrowseProject = useKickstarter(browseProjectAddress)

  const contributorsOnMyProject = useBackedKickstartersByAddress(myProjectAddress)
  const contributorsOnBrowseProject = useBackedKickstartersByAddress(browseProjectAddress)

  useEffect(() => {
    setBackingAmountOnMyProjectPage("")
  }, [isPaymentOnMyProjectPage])

  useEffect(() => {
    setBackingAmountOnBrowseProjectPage("")
  }, [isPaymentOnBrowseProjectPage])

  useEffect(() => {
    if (isCreate) return
    setCurrentCreationStep(1)
    setProjectCreation(initialProjectCreation)
  }, [isCreate])

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const toggleIsCreate = () => {
    setIsCreate((prevValue) => !prevValue)
  }

  const handleOnProjectCreationChanged = useCallback((newUpdate: { [key: string]: any }) => {
    setProjectCreation({ ...projectCreation, ...newUpdate })
  }, [projectCreation])

  const handleBackingAmountOnMyProjectPageChanged = useCallback((value: string) => {
    if ((value !== "" && value.match("^[0-9]{0,9}(\\.[0-9]{0,18})?$") == null)) return
    setBackingAmountOnMyProjectPage(value)
  }, [])

  const handleBackingAmountOnBrowseProjectPageChanged = useCallback((value: string) => {
    if ((value !== "" && value.match("^[0-9]{0,9}(\\.[0-9]{0,18})?$") == null)) return
    setBackingAmountOnBrowseProjectPage(value)
  }, [])

  return (
    <KickstarterContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        account,
        accountBalance: accountBalance?.toSignificant(6),
        onPresentConnectModal,

        isCreate,
        currentCreationStep,
        projectCreation,

        kickstarterFactory,
        kickstarterAccount,

        myKickstarters,
        almostEndedKickstarters,
        kickstarters,

        myProjectAddress,
        browseProjectAddress,
        kickstarterOnMyProject,
        kickstarterOnBrowseProject,

        myProjectPage,
        browseProjectPage,

        isPaymentOnMyProjectPage,
        isPaymentOnBrowseProjectPage,

        backingAmountOnMyProjectPage,
        backingAmountOnBrowseProjectPage,

        currentBackedAmountOnMyProjectPage: contributionOnMyProjectPage?.amount,
        currentBackedAmountOnBrowseProjectPage: contributionOnBrowseProjectPage?.amount,

        contributorsOnMyProject,
        contributorsOnBrowseProject,

        toggleIsCreate,
        handleCurrentCreationStepChanged: setCurrentCreationStep,
        handleOnProjectCreationChanged,

        handleMyProjectChanged: setMyProjectAddress,
        handleBrowseProjectChanged: setBrowseProjectAddress,
        handleSearchKickstarterChanged: setSearchKickstarter,
        handleKickstarterOrderDirectionChanged: setKickstarterOrderDirection,

        handleMyProjectPageChanged: setMyProjectPage,
        handleBrowseProjectPageChanged: setBrowseProjectPage,

        handleIsPaymentOnMyProjectPage: setIsPaymentOnMyProjectPage,
        handleIsPaymentOnBrowseProjectPage: setIsPaymentOnBrowseProjectPage,

        handleBackingAmountOnMyProjectPageChanged,
        handleBackingAmountOnBrowseProjectPageChanged,
      }}
    >
      {children}
    </KickstarterContext.Provider>
  )
}

export function useKickstarterContext() {
  return useContext(KickstarterContext)
}
