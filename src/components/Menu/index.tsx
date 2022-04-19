import React, { useEffect, useState } from 'react'
import { Menu as UikitMenu } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useLocation } from 'react-router-dom'
import useTheme from '../../hooks/useTheme'
import useGetPriceData from '../../hooks/useGetPriceData'
import useGetKodaPriceData from '../../hooks/useGetKodaPriceData'
import useGetKapexPriceData from '../../hooks/useGetKapexPriceData'
import config from './config'
import login from '../../utils/login'

const Menu: React.FC = (props) => {
  const { account, activate, deactivate } = useWeb3React()
  const { toggleTheme } = useTheme()

  const location = useLocation()
  const priceData = useGetPriceData()
  const cakePriceUsd = priceData ? Number(priceData.prices.Cake) : undefined
  const kodaPriceData = useGetKodaPriceData()
  const kodaPriceUsd = kodaPriceData ? Number(kodaPriceData['koda-finance'].usd) : undefined
  const kapexPriceUsd = useGetKapexPriceData()
  // const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const [showConnectButton, setShowConnectButton] = useState(true)

  useEffect(() => {
    setShowConnectButton(
      !config.some(
        (o) =>
          o.href &&
          !o.showConnectButton &&
          typeof o.showConnectButton === 'boolean' &&
          location.pathname.includes(o.href)
      )
    )
  }, [location])

  return (
    <UikitMenu
      showConnectButton={showConnectButton}
      links={config}
      account={account as string}
      login={(connectorId: string) => login(connectorId, activate)}
      logout={deactivate}
      isDark
      toggleTheme={toggleTheme}
      cakePriceUsd={cakePriceUsd}
      kodaPriceUsd={kodaPriceUsd}
      kapexPriceUsd={kapexPriceUsd}
      {...props}
    />
  )
}

export default Menu
