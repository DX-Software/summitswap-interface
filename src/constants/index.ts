import { ChainId, JSBI, Percent, Token, WETH } from '@summitswap-libs'

export const ROUTER_ADDRESS = `${process.env.REACT_APP_ROUTER_ADDRESS}`
export const FACTORY_ADDRESS = `${process.env.REACT_APP_FACTORY_ADDRESS}`
export const INIT_CODE_HASH = `${process.env.REACT_APP_INIT_CODE_HASH}`
export const REFERRAL_ADDRESS = `${process.env.REACT_APP_REFERRAL_ADDRESS}`

export const ADDITIONAL_ROUTER_ADDRESSES: string[] = process.env.REACT_APP_ADDITIONAL_ROUTER_ADDRESS?.split(",") ?? []
export const ADDITIONAL_FACTORY_ADDRESSES: string[] = process.env.REACT_APP_ADDITIONAL_FACTORY_ADDRESS?.split(",") ?? []
export const ADDITIONAL_INIT_CODE_HASHES: string[] = process.env.REACT_APP_ADDITIONAL_INIT_CODE_HASH?.split(",") ?? []

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const SUMMITCHECK_API = `${process.env.REACT_APP_SUMMITCHECK_API}`
export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID ?? '56')


// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}


export const DAI = new Token(ChainId.MAINNET, '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', 18, 'DAI', 'Dai Stablecoin')
export const BUSD = new Token(ChainId.MAINNET, '0xe9e7cea3dedca5984780bafc599bd69add087d56', 18, 'BUSD', 'Binance USD')
export const USDT = new Token(ChainId.MAINNET, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'Tether USD')
export const UST = new Token(
  ChainId.MAINNET,
  '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
  18,
  'UST',
  'Wrapped UST Token'
  )

export const BUSDs = {
  [ChainId.MAINNET]: BUSD,
  [ChainId.BSCTESTNET]: new Token(ChainId.BSCTESTNET, '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7', 18, 'BUSD', 'Binance USD'),
}

// TODO: Use real kapex addresses
export const KAPEXs = {
  [ChainId.MAINNET]: undefined,
  [ChainId.BSCTESTNET]: new Token(ChainId.BSCTESTNET, '0xe0eBb40d8Aa7f498eD461feDaB361033f6B73C43', 18, 'KAPEX', 'KAPEX'),
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.BSCTESTNET]: [WETH[ChainId.BSCTESTNET]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT, UST],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x8094e772fa4a60bdeb1dfec56ab040e17dd608d5', 18, 'KODA', 'KODA Token'),
      new Token(ChainId.MAINNET, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
    ],
    [BUSD, USDT],
    [DAI, USDT],
  ],
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 80
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
