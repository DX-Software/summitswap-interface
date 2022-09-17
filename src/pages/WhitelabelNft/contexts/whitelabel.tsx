import React, { createContext, useContext, useState } from 'react'

type WhitelabelNftContextProps = {
  activeTab: number
  setActiveTab: React.Dispatch<React.SetStateAction<number>>
}

const WhitelabelNftContext = createContext<WhitelabelNftContextProps>({
  activeTab: 0,
  setActiveTab: () => null,
})

export function WhitelabelNftProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <WhitelabelNftContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </WhitelabelNftContext.Provider>
  )
}

export function useWhitelabelNftContext() {
  return useContext(WhitelabelNftContext)
}
