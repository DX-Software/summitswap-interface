import React, { Suspense, useEffect, useState } from 'react'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useReferralContract } from 'hooks/useContract'
import { injected, walletconnect } from 'connectors'
import { useWalletModal } from '@summitswap-uikit'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import AddLiquidity from './AddLiquidity'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import Swap from './Swap'
import CrossChainSwap from './CrossChainSwap'
import Referral from './Referral'
import SummitCheck from './SummitCheck'
import { EN, allLanguages } from '../constants/localisation/languageCodes'
import { LanguageContext } from '../hooks/LanguageContext'
import { TranslationsContext } from '../hooks/TranslationsContext'
import langSrc from '../constants/localisation/translate/index'
import AppHeader from './AppHeader'
import Menu from '../components/Menu'
import { NULL_ADDRESS, REFERRAL_ADDRESS } from '../constants'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  background-repeat: no-repeat;
  background-position: bottom 24px center;
  background-size: 90%;

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    background-repeat: no-repeat;
    background-position: center 420px, 10% 230px, 90% 230px;
    background-size: contain, 266px, 266px;
  }
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const { account, deactivate, activate, error } = useWeb3React()

  useEffect(() => {
    if (error instanceof UnsupportedChainIdError) {
      localStorage.removeItem('walletconnect')
    }
  }, [error])

  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(undefined)
  const [translations, setTranslations] = useState<Array<any>>([])

  const location = useLocation()

  const handleLogin = (connectorId: string) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect())
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem('pancakeSwapLanguage')
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
    } else {
      setSelectedLanguage(EN)
    }
  }, [])

  const getLang = () => {
    return langSrc[selectedLanguage.code] ? langSrc[selectedLanguage.code].src : []
  }

  const fetchTranslationsForSelectedLanguage = async () => {
    setTranslations(getLang())
    setTranslatedLanguage(selectedLanguage)
  }

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslationsForSelectedLanguage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage])

  useEffect(() => {
    const referrerParam = new URLSearchParams(location.search).get('ref')
    const outputParam = new URLSearchParams(location.search).get('output')

    if (referrerParam && outputParam) {
      const referralCached: Record<string, string> = JSON.parse(localStorage.getItem('referral') ?? '{}')
      referralCached[outputParam] = referrerParam
      localStorage.setItem('referral', JSON.stringify(referralCached))
      onPresentConnectModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])


  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <LanguageContext.Provider
          value={{ selectedLanguage, setSelectedLanguage, translatedLanguage, setTranslatedLanguage }}
        >
          <TranslationsContext.Provider value={{ translations, setTranslations }}>
            <Popups />
            <Web3ReactManager>
              <Switch>
                <Route exact strict path="/">
                  <Redirect to="/swap" />
                </Route>
                <Menu>
                  <BodyWrapper>
                    <AppHeader />
                    <Route exact path="/swap" component={Swap} />
                    <Route exact path="/cross-chain-swap" component={CrossChainSwap} />
                    <Route exact path="/swap?ref=:ref" component={Referral} />
                    <Route exact path="/referral" component={Referral} />
                    <Route exact strict path="/find" component={PoolFinder} />
                    <Route exact strict path="/pool" component={Pool} />
                    <Route exact path="/add" component={AddLiquidity} />
                    <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

                    {/* Redirection: These old routes are still used in the code base */}
                    <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                    <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                    <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                    <Route exact path="/summitcheck" component={SummitCheck} />

                    {/* <Route component={RedirectPathToSwapOnly} /> */}
                  </BodyWrapper>
                </Menu>
              </Switch>
            </Web3ReactManager>
            <Marginer />
          </TranslationsContext.Provider>
        </LanguageContext.Provider>
      </AppWrapper>
    </Suspense>
  )
}
