import React, { createContext, useContext, useState } from 'react'

type WhitelabelNftContextProps = {
  activeTab: number
  setActiveTab: React.Dispatch<React.SetStateAction<number>>

  hideBrowseInfoSection: boolean
  setHideBrowseInfoSection: React.Dispatch<React.SetStateAction<boolean>>

  whitelabelNftId: string
  setWhitelabelNtId: React.Dispatch<React.SetStateAction<string>>
}

const WhitelabelNftContext = createContext<WhitelabelNftContextProps>({
  activeTab: 0,
  setActiveTab: () => null,

  hideBrowseInfoSection: false,
  setHideBrowseInfoSection: () => null,

  whitelabelNftId: '',
  setWhitelabelNtId: () => null,
})

export function WhitelabelNftProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [hideBrowseInfoSection, setHideBrowseInfoSection] = useState(false)
  const [whitelabelNftId, setWhitelabelNtId] = useState<string>('')

  return (
    <WhitelabelNftContext.Provider
      value={{
        activeTab,
        setActiveTab,

        hideBrowseInfoSection,
        setHideBrowseInfoSection,

        whitelabelNftId,
        setWhitelabelNtId,
      }}
    >
      {children}
    </WhitelabelNftContext.Provider>
  )
}

export function useWhitelabelNftContext() {
  return useContext(WhitelabelNftContext)
}
