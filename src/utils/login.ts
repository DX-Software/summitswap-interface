import { UnsupportedChainIdError } from '@web3-react/core'
import { NoEthereumProviderError } from '@web3-react/injected-connector'
import { connectorLocalStorageKey } from '@summitswap-uikit'
import { injected, bsc, walletconnect, setupNetwork } from 'connectors'
import { NoBscProviderError } from 'connectors/bsc/bscConnector'
import { AbstractConnector } from '@web3-react/abstract-connector'

export default async function login(
  connectorId: string,
  activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => Promise<void>
) {
  if (connectorId === 'walletconnect') {
    await activate(walletconnect())
  } else if (connectorId === 'bsc') {
    await activate(bsc)
  } else {
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
}
