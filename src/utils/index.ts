import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@koda-finance/summitswap-sdk'
import SummitswapRouterAbi from '../constants/abis/summitswap-router.json'
import { ROUTER_ADDRESS } from '../constants'
import { TokenAddressMap } from '../state/lists/hooks'
import { getExplorerLink } from './explorers'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getBscScanLink(chainId: ChainId, data: string, type: 'transaction' | 'token' | 'address' | 'block'): string {
  return getExplorerLink(chainId, data, type)
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(Math.floor(num)), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// account is optional
export function getRouterContract(
  _: number,
  library: Web3Provider,
  account?: string,
  routerAddress: string = ROUTER_ADDRESS
): Contract {
  return getContract(routerAddress, SummitswapRouterAbi, library, account)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']

export function abbreviateNumber(number) {
  // what tier? (determines SI symbol)
  // eslint-disable-next-line no-bitwise
  const tier = (Math.log10(Math.abs(number)) / 3) | 0

  // if zero, we don't need a suffix
  if (tier === 0) return number

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier]
  const scale = 10 ** (tier * 3)

  // scale the number
  const scaled = number / scale

  // format number and add suffix
  return scaled.toFixed(1) + suffix
}
