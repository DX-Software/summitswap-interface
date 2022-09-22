import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { ResetCSS } from '@koda-finance/summitswap-uikit'
import { HashRouter } from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material'
import BigNumber from 'bignumber.js'
import GlobalStyle from './style/Global'
import App from './pages/App'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import Providers from './Providers'
import 'inter-ui'
import './i18n'
import withClearCache from './components/ClearCache'

if ('ethereum' in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false
}

window.addEventListener('error', () => {
  localStorage?.removeItem('redux_localstorage_simple_lists')
})

const ClearCacheAppComponent = withClearCache(App)

BigNumber.config({ EXPONENTIAL_AT: 20 })

ReactDOM.render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <Providers>
        <>
          <ListsUpdater />
          <ApplicationUpdater />
          <TransactionUpdater />
          <MulticallUpdater />
        </>
        <ResetCSS />
        <GlobalStyle />
        <HashRouter>
          <ClearCacheAppComponent />
        </HashRouter>
      </Providers>
    </StyledEngineProvider>
  </StrictMode>,
  document.getElementById('root')
)
