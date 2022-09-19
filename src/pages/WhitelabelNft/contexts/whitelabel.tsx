import React, { createContext, useContext, useState } from 'react'

type WhitelabelNftContextProps = {
  activeTab: number
  setActiveTab: React.Dispatch<React.SetStateAction<number>>

  whitelabelNftId: string
  setWhitelabelNtId: React.Dispatch<React.SetStateAction<string>>
}

const WhitelabelNftContext = createContext<WhitelabelNftContextProps>({
  activeTab: 0,
  setActiveTab: () => null,

  whitelabelNftId: '',
  setWhitelabelNtId: () => null,
})

export function WhitelabelNftProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [whitelabelNftId, setWhitelabelNtId] = useState<string>('')

  return (
    <WhitelabelNftContext.Provider
      value={{
        activeTab,
        setActiveTab,

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
