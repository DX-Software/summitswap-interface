import { connectorLocalStorageKey } from '@koda-finance/summitswap-uikit'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError } from '@web3-react/core'
import { InjectedConnector, NoEthereumProviderError } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import config from 'components/Menu/config'
import { bsc, setupNetwork } from 'connectors'
import { NoBscProviderError } from 'connectors/bsc/bscConnector'
import { BSC_CHAIN_ID, NETWORK_URLS } from 'constants/index'

export default async function login(
  connectorId: string,
  activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => Promise<void>
) {
  const { location } = window
  const menu = config.find((entry) => location.href.includes(`${entry.href}`))
  const expectedChainId = menu?.supportedChainId || BSC_CHAIN_ID

  const injected = new InjectedConnector({
    supportedChainIds: [expectedChainId],
  })

  const walletconnect = new WalletConnectConnector({
    rpc: { [expectedChainId]: NETWORK_URLS[expectedChainId] },
  })

  if (connectorId === 'walletconnect') {
    await activate(walletconnect)
  } else if (connectorId === 'bsc') {
    await activate(bsc)
  } else {
    await activate(injected, async (error: Error) => {
      if (error instanceof UnsupportedChainIdError) {
        const hasSetup = await setupNetwork(expectedChainId)
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
}
