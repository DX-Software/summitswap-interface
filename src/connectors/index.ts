import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { ChainId, Token } from '@koda-finance/summitswap-sdk'
import { RPC } from 'constants/rpc'
import getLibrary from 'utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'
import { BscConnector } from './bsc/bscConnector'
import { CHAIN_ID, NETWORK_URL } from '../constants'

export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.BSCTESTNET]: 'https://testnet.bscscan.com',
}

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[process.env.REACT_APP_CHAIN_ID as string]

export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID as string, 10)
    try {
      await (provider as any).request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: `Binance Smart Chain ${process.env.REACT_APP_CHAIN_ID === '56' ? 'Mainnet' : 'Testnet'}`,
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
          },
        ],
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

let network: NetworkConnector | undefined

export const getNetworkConnector = (): NetworkConnector => {
  if (network) {
    return network
  }

  const defaultChainId = localStorage.getItem('chain-id')

  // eslint-disable-next-line no-return-assign
  return (network = new NetworkConnector({
    defaultChainId: defaultChainId ? Number(defaultChainId) : 1,
    urls: RPC,
  }))
}

// export const network = new NetworkConnector({
//   urls: { [CHAIN_ID]: NETWORK_URL },
// })

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  // eslint-disable-next-line no-return-assign
  return (networkLibrary = networkLibrary ?? getLibrary(getNetworkConnector().provider))
}

export const injected = new InjectedConnector({
  supportedChainIds: [CHAIN_ID],
})

export const bsc = new BscConnector({ supportedChainIds: [56] })

// mainnet only
export const walletconnect = () =>
  new WalletConnectConnector({
    rpc: { [CHAIN_ID]: NETWORK_URL },
  })

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Summitswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg',
})

export const registerToken = async (token: Token) => {
  const branch = CHAIN_ID === 56 ? 'main' : 'develop'
  const provider = window.ethereum
  const tokenAdded = await (provider as any).request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: `https://raw.githubusercontent.com/Koda-Finance/summitswap-data/${branch}/images/coins/${token.symbol?.toLowerCase()}.png`,
      },
    },
  })

  return tokenAdded
}
