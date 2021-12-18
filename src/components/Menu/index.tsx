import React, { useContext } from 'react'
import { connectorLocalStorageKey, Menu as UikitMenu } from '@summitswap-uikit'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { allLanguages } from 'constants/localisation/languageCodes'
import { LanguageContext } from 'hooks/LanguageContext'
import useTheme from 'hooks/useTheme'
import useGetPriceData from 'hooks/useGetPriceData'
import { injected, bsc, walletconnect, setupNetwork } from 'connectors'
import { NoEthereumProviderError } from '@web3-react/injected-connector'
import { NoBscProviderError } from 'connectors/bsc/bscConnector'
import links from './config'

const Menu: React.FC = (props) => {
  const { account, activate, deactivate } = useWeb3React()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const priceData = useGetPriceData()
  const cakePriceUsd = priceData ? Number(priceData.prices.Cake) : undefined

  return (
    <UikitMenu
      links={links}
      account={account as string}
      login={async (connectorId: string) => {
        if (connectorId === 'walletconnect') {
          await activate(walletconnect)
        }
        else if (connectorId === 'bsc') {
          await activate(bsc)
        }
        else {
          await activate(injected, async (error: Error) => {
            if (error instanceof UnsupportedChainIdError) {
              const hasSetup = await setupNetwork()
              if (hasSetup) {
                activate(injected)
              }
            } else {
              window.localStorage.removeItem(connectorLocalStorageKey)
              if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
                window.alert('Provider Error, No provider was found')
              } else {
                window.alert(`${error.name}, ${error.message}`)
              }
            }
          })
        }
      }}
      logout={deactivate}
      isDark
      toggleTheme={toggleTheme}
      currentLang='EN'
      setLang= {(): void => undefined}
      langs={[]}
      cakePriceUsd={cakePriceUsd}
      {...props}
    />
  )
}

export default Menu
