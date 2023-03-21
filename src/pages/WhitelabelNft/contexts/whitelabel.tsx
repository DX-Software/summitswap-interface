import { useWeb3React } from '@web3-react/core'
import { ETH_CHAIN_ID } from 'constants/index'
import { useActiveWeb3React } from 'hooks'
import { useWhitelabelFactoryContract } from 'hooks/useContract'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

type WhitelabelNftContextProps = {
  activeTab: number
  setActiveTab: React.Dispatch<React.SetStateAction<number>>

  hideBrowseInfoSection: boolean
  setHideBrowseInfoSection: React.Dispatch<React.SetStateAction<boolean>>

  whitelabelNftId: string
  setWhitelabelNtId: React.Dispatch<React.SetStateAction<string>>

  tokenId: string
  setTokenId: React.Dispatch<React.SetStateAction<string>>

  canCreate: boolean
  setCanCreate: React.Dispatch<React.SetStateAction<boolean>>
}

const WhitelabelNftContext = createContext<WhitelabelNftContextProps>({
  activeTab: 0,
  setActiveTab: () => null,

  hideBrowseInfoSection: false,
  setHideBrowseInfoSection: () => null,

  whitelabelNftId: '',
  setWhitelabelNtId: () => null,

  tokenId: '',
  setTokenId: () => null,

  canCreate: false,
  setCanCreate: () => null,
})

export function WhitelabelNftProvider({ children }: { children: React.ReactNode }) {
  const history = useHistory()
  const { account } = useWeb3React()
  const { chainId } = useActiveWeb3React()
  const whitelabelFactoryContract = useWhitelabelFactoryContract()

  const [activeTab, setActiveTab] = useState<number>(0)
  const [hideBrowseInfoSection, setHideBrowseInfoSection] = useState(false)
  const [whitelabelNftId, setWhitelabelNtId] = useState<string>('')
  const [tokenId, setTokenId] = useState<string>('')
  const [canCreate, setCanCreate] = useState(false)

  const fetchCanCreate = useCallback(async () => {
    if (!account || !whitelabelFactoryContract || chainId !== ETH_CHAIN_ID) return
    const [owner, isAdmin, canAnyoneCreate] = await Promise.all([
      whitelabelFactoryContract.owner(),
      whitelabelFactoryContract.isAdmin(account),
      whitelabelFactoryContract.canAnyoneCreate(),
    ])
    if (account.toLowerCase() === String(owner).toLowerCase() || isAdmin || canAnyoneCreate) {
      setCanCreate(true)
    } else {
      setCanCreate(false)
    }
  }, [account, whitelabelFactoryContract, chainId])

  useEffect(() => {
    if (whitelabelNftId === '' && tokenId !== '') {
      setTokenId('')
    }
  }, [whitelabelNftId, tokenId])

  useEffect(() => {
    if (whitelabelNftId === '') {
      history.replace({
        search: '',
      })
    }
  }, [history, whitelabelNftId])

  useEffect(() => {
    if (whitelabelNftId !== '' && tokenId === '') {
      history.replace({
        search: `?whitelabel-nft=${whitelabelNftId}`,
      })
    }
  }, [history, whitelabelNftId, tokenId])

  useEffect(() => {
    fetchCanCreate()
  }, [fetchCanCreate])

  return (
    <WhitelabelNftContext.Provider
      value={{
        activeTab,
        setActiveTab,

        hideBrowseInfoSection,
        setHideBrowseInfoSection,

        whitelabelNftId,
        setWhitelabelNtId,

        tokenId,
        setTokenId,

        canCreate,
        setCanCreate,
      }}
    >
      {children}
    </WhitelabelNftContext.Provider>
  )
}

export function useWhitelabelNftContext() {
  return useContext(WhitelabelNftContext)
}
