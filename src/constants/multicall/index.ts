import { ChainId } from '@koda-finance/summitswap-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
  [ChainId.BSCTESTNET]: "0x9e84Ef65Bde2905426e3fEf5448a503eaa44491f",
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
