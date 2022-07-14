import { ChainId } from '@koda-finance/summitswap-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: '',
  [ChainId.MATIC]: '',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.OPTIMISM]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONBEAM]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '0x920b7082B39370462a4B53c31af6bEefD5cc9a35',
  [ChainId.BSC]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [ChainId.BSC_TESTNET]: '0x2D1a3Cbe60bAe408eC5cCCE0aEde0fD6B95fd7ec',
  [ChainId.FANTOM]: '',
  [ChainId.CELO]: '',
  [ChainId.HARMONY]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.XDAI]: '',
  [ChainId.TELOS]: '',
  [ChainId.FUSE]: '',
  [ChainId.OKEX]: '',
  [ChainId.HECO]: '',
  [ChainId.PALM]: '',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
