import { Web3Provider } from '@ethersproject/providers'
import { ChainId, Token } from '@koda-finance/summitswap-sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { CHAIN_ID, BSC_NETWORK_URL, ETH_NETWORK_URL, BSC_CHAIN_ID, ETH_CHAIN_ID } from '../constants'
import { BscConnector } from './bsc/bscConnector'
import { NetworkConnector } from './NetworkConnector'

const ChainIds = {
  BSCMAINNET: ChainId.MAINNET,
  BSCTESTNET: ChainId.BSCTESTNET,
  ETHEREUM: 1,
  GOERLI: 5,
}

const CHAIN_PARAMS = {
  [ChainIds.BSCMAINNET]: {
    chainId: `0x${ChainId.MAINNET.toString(16)}`,
    chainName: `Binance Smart Chain Mainnet`,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18,
    },
    rpcUrls: [BSC_NETWORK_URL],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  [ChainIds.BSCTESTNET]: {
    chainId: `0x${ChainId.BSCTESTNET.toString(16)}`,
    chainName: `Binance Smart Chain Testnet`,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18,
    },
    rpcUrls: [BSC_NETWORK_URL],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
  [ChainIds.ETHEREUM]: {
    chainId: `0x${ChainIds.ETHEREUM.toString(16)}`,
    chainName: `Ethereum Mainnet`,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'eth',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  [ChainIds.GOERLI]: {
    chainId: `0x${ChainIds.GOERLI.toString(16)}`,
    chainName: `Goerli Testnet`,
    nativeCurrency: {
      name: 'GoerliETH',
      symbol: 'GoerliETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.infura.io/v3/'],
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
  },
}

export const addNetwork = async (chainId: number) => {
  const provider = window.ethereum
  try {
    await (provider as any).request({
      method: 'wallet_addEthereumChain',
      params: [CHAIN_PARAMS[chainId]],
    })
  } catch (error) {
    console.error('Failed to setup the network in Metamask:', error)
    return false
  }
  return true
}

export const switchNetwork = async (chainId: number) => {
  const provider = window.ethereum
  if (provider) {
    await (provider as any).request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
  }
}

export const setupNetwork = async (chainId = CHAIN_ID) => {
  const provider = window.ethereum
  if (provider) {
    try {
      await switchNetwork(chainId)
    } catch (err: any) {
      if (err.code === 4902) {
        return addNetwork(chainId)
      }
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
  return true
}

if (typeof BSC_NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_BSC_NETWORK_URL must be a defined environment variable`)
}

if (typeof ETH_NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_ETH_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [BSC_CHAIN_ID]: BSC_NETWORK_URL, [ETH_CHAIN_ID]: ETH_NETWORK_URL },
  defaultChainId: BSC_CHAIN_ID,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  // eslint-disable-next-line no-return-assign
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [BSC_CHAIN_ID, ETH_CHAIN_ID],
})

export const bsc = new BscConnector({ supportedChainIds: [56] })

// mainnet only
export const walletconnect = () =>
  new WalletConnectConnector({
    rpc: { [BSC_CHAIN_ID]: BSC_NETWORK_URL, [ETH_CHAIN_ID]: ETH_NETWORK_URL },
  })

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: BSC_NETWORK_URL,
  appName: 'Summitswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg',
})

export const getTokenImageByAddress = (token: Token) => {
  const branch = CHAIN_ID === 56 ? 'main' : 'develop'
  return `https://raw.githubusercontent.com/Koda-Finance/summitswap-data/${branch}/images/coins/${token.symbol?.toLowerCase()}.png`
}

export const getTokenImageBySymbol = (symbol?: string) => {
  const branch = CHAIN_ID === 56 ? 'main' : 'develop'
  return `https://raw.githubusercontent.com/Koda-Finance/summitswap-data/${branch}/images/coins/${symbol?.toLowerCase()}.png`
}

export const registerToken = async (token: Token) => {
  const provider = window.ethereum
  const tokenAdded = await (provider as any).request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: getTokenImageByAddress(token),
      },
    },
  })

  return tokenAdded
}
