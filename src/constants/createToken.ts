import { Option } from 'react-dropdown'
import { ROUTER_ADDRESS, PANCAKESWAP_ROUTER_V2_ADDRESS } from "."


export enum TokenType {
  Standard = 'Standard',
  Liquidity = 'Liquidity',
}

export const TOKEN_CREATOR_ADDRESS = {
  [TokenType.Standard]: `${process.env.REACT_APP_STANDARD_TOKEN_CREATOR_ADDRESS}`,
  [TokenType.Liquidity]: `${process.env.REACT_APP_LIQUIDITY_TOKEN_CREATOR_ADDRESS}`,
}

export const STANDARD_TOKEN_OPTION : Option= {
  value: TokenType.Standard,
  label: `${TokenType.Standard} Token`
}

export const LIQUIDITY_TOKEN_OPTION: Option = {
  value: TokenType.Liquidity,
  label: `${TokenType.Liquidity} Token`
}

export const SUMMITSWAP_ROUTER_OPTION: Option = { value: ROUTER_ADDRESS, label: 'Summitswap Router' }
export const PANCAKESWAP_ROUTER_OPTION: Option = { value: PANCAKESWAP_ROUTER_V2_ADDRESS, label: 'Pancakeswap Router' }

export const BSC_SCAN = `${process.env.REACT_APP_BSCSCAN}`

export const MAX_TOKEN_SUPPLY = "500000000000000000000"

export const MIN_TAX_VALUE = 0.01
export const MAX_TOTAL_TAX_VALUE = 25

