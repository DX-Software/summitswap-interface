import React from 'react'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { ModalProvider } from '@koda-finance/summitswap-uikit'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { LocalizationProvider } from '@mui/lab'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NetworkContextName } from './constants'
import store from './state'
import getLibrary from './utils/getLibrary'
import { ThemeContextProvider } from './ThemeContext'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <ThemeContextProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <QueryClientProvider client={queryClient}>
                <ModalProvider>{children}</ModalProvider>
              </QueryClientProvider>
            </LocalizationProvider>
          </ThemeContextProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  )
}

export default Providers
