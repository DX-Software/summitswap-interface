import React, { createContext, useContext, useEffect, useState } from 'react'
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
})

export function WhitelabelNftProvider({ children }: { children: React.ReactNode }) {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState<number>(0)
  const [hideBrowseInfoSection, setHideBrowseInfoSection] = useState(false)
  const [whitelabelNftId, setWhitelabelNtId] = useState<string>('')
  const [tokenId, setTokenId] = useState<string>('')

  useEffect(() => {
    if (whitelabelNftId === '') {
      history.replace({
        search: '',
      })
      setTokenId('')
    }
  }, [history, whitelabelNftId])

  useEffect(() => {
    if (whitelabelNftId !== '' && tokenId === '') {
      history.replace({
        search: `?whitelabel-nft=${whitelabelNftId}`,
      })
    }
  }, [history, whitelabelNftId, tokenId])

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
      }}
    >
      {children}
    </WhitelabelNftContext.Provider>
  )
}

export function useWhitelabelNftContext() {
  return useContext(WhitelabelNftContext)
}
