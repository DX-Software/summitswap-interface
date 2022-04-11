interface PairResponse {
  token0: {
    id: string
    symbol: string
    derivedBNB: number
  }
  token1: {
    id: string
    symbol: string
    derivedBNB: number
  }
}

export interface MintResponse {
  id: string
  timestamp: string
  pair: PairResponse
  to: string
  amount0: string
  amount1: string
  amountUSD: string
}

export interface SwapResponse {
  id: string
  timestamp: string
  pair: PairResponse
  from: string
  amount0In: string
  amount1In: string
  amount0Out: string
  amount1Out: string
  amountUSD: string
}

export interface BurnResponse {
  id: string
  timestamp: string
  pair: PairResponse
  sender: string
  amount0: string
  amount1: string
  amountUSD: string
}
export interface TokenDayData {
  date: number // UNIX timestamp in seconds
  dailyVolumeUSD: string
  totalLiquidityUSD: string
}

export interface TokenDayDatasResponse {
  tokenDayDatas: TokenDayData[]
}

// Footprint is the same, declared just for better readability
export type SummitDayData = TokenDayData
export type PancakeDayData = TokenDayData

export interface SummitDayDatasResponse {
  summitDayDatas: SummitDayData[]
}

export interface PancakeDayDatasResponse {
  pancakeDayDatas: PancakeDayData[]
}

export interface PairDayData {
  date: number // UNIX timestamp in seconds
  dailyVolumeUSD: string
  reserveUSD: string
}

export interface PairDayDatasResponse {
  pairDayDatas: PairDayData[]
}

export interface FormattedHistory {
  time: number
  open: number
  close: number
  high: number
  low: number
}
