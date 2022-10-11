import React, { useEffect, useState } from 'react'
import { Menu as UikitMenu } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import useGetPriceData from 'hooks/useGetPriceData'
import useKodaPrice from 'hooks/useKodaPrice'
import useKapexPrice from 'hooks/useKapexPrice'
import { useLocation } from 'react-router-dom'
import config from './config'
import login from '../../utils/login'

const Menu: React.FC = (props) => {
  const { account, activate, deactivate, chainId } = useWeb3React()
  const { toggleTheme } = useTheme()

  const location = useLocation()
  const priceData = useGetPriceData()
  const cakePriceUsd = priceData ? Number(priceData.prices.Cake) : undefined
  const kodaPriceUsd = useKodaPrice()
  const kapexPriceUsd = useKapexPrice()
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
      login={(connectorId: string) => login(connectorId, activate, chainId)}
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
