import { Option } from 'react-dropdown'
import { BUSD, KODA, USDC, USDT, NULL_ADDRESS } from '.'

export const PRESALE_FACTORY_ADDRESS = `${process.env.REACT_APP_PRESALE_FACTORY_ADDRESS}`
// used as a max token amount to approve factory 
export const MAX_APPROVE_VALUE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export const SUMMITSWAP_LINK = "https://summitswap.finance/#/swap?output="
export const PANKCAKESWAP_LINK = "https://pancakeswap.finance/swap?outputCurrency="

export const MESSAGE_ERROR = 'MESSAGE_ERROR'
export const MESSAGE_SUCCESS = 'MESSAGE_SUCCESS'

export const WHITELIST_SALE: Option = { label: 'Whitelist', value: 'Whitelist' }
export const PUBLIC_SALE: Option = { label: 'Public', value: 'Public' }

export const NO_FILTER: Option = { value: 'NO_FILTER', label: 'No Filter' }
export const FILTER_OWNER: Option = { value: 'OWNER', label: 'Owner' }


export const FEE_BNB_ONLY = 5 // 5%
export const FEE_BNB_N_TOKEN = 2 // 2%
export const FEE_DECIMALS = 9;

export const PRESALE_CARDS_PER_PAGE = 6
export const WHITELIST_ADDRESSES_PER_PAGE = 10

export const WITHDRAW_BNB = 'withdrawBNB'
export const EMERGENCY_WITHDRAW_BNB = 'emergencyWithdrawBNB'

export enum RadioFieldValues {
  whitelistEnable = 'enable',
  whitelistDisable = "disable",
  refundTypeRefund = 0,
  refundTypeBurn = 1,
  feeTypeOnlyBnb = 0,
  feeTypeBnbAndToken = 1,
}

export const TOKEN_CHOICES = {
  BNB: NULL_ADDRESS,
  KODA: KODA.address,
  BUSD: BUSD.address,
  USDC: USDC.address,
  USDT: USDT.address,
}
