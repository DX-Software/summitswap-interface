import { BUSD, KODA, USDC, USDT, NULL_ADDRESS } from '.'

export const PRESALE_FACTORY_ADDRESS = `${process.env.REACT_APP_PRESALE_FACTORY_ADDRESS}`

export const FEE_PAYMENT_TOKEN = 2 // 2%
export const FEE_PRESALE_TOKEN = 2 // 2%
export const FEE_EMERGENCY_WITHDRAW = 10 // 2%

export const FEE_DECIMALS = 9

export const PRESALE_CARDS_PER_PAGE = 9
export const ADDRESS_PER_PAGE = 5
export const PRESALES_PER_PAGE_ADMIN_PANEL = 10

export const CONTACT_INFO_DELIMITER = '.|*|.'

export const RADIO_VALUES = {
  WHITELIST_ENABLED: true,
  WHITELIST_DISABLED: false,
  VESTING_ENABLED: true,
  VESTING_DISABLED: false,
  REFUND_TYPE_REFUND: 0,
  REFUND_TYPE_BURN: 1,
  LISTING_SS_100: 0, // 100% liquididty added to summitswap
  LISTING_PS_100: 1, // 25% liquididty added to pancakeswap
  LISTING_SS75_PK25: 2, // 75% liquididty added to summitswap + 25% added to pancakeswap
}

export const TOKEN_CHOICES = {
  BNB: NULL_ADDRESS,
  KODA: KODA.address,
  BUSD: BUSD.address,
  USDC: USDC.address,
  USDT: USDT.address,
}

export const ROUTER_OPTIONS = [
  {
    label: 'Summitswap',
    value: `${RADIO_VALUES.LISTING_SS_100}`,
  },
  {
    label: 'Pancakeswap',
    value: `${RADIO_VALUES.LISTING_PS_100}`,
  },
  {
    label: 'Both',
    value: `${RADIO_VALUES.LISTING_SS75_PK25}`,
  },
]

export const DAY_OPTIONS = [...Array(28).keys()].map((i) => ({
  label: `${i + 1}`,
  value: `${i + 1}`,
}))

export const HOUR_OPTIONS = [...Array(24).keys()].map((i) => ({
  label: `${i}`,
  value: `${i}`,
}))

export const CONTACT_METHOD_OPTIONS = [
  {
    label: 'Telegram',
    value: 'Telegram',
  },
  {
    label: 'Discord',
    value: 'Discord',
  },
  {
    label: 'Email',
    value: 'Email',
  },
]

export const HEADERS_WHITELIST = [
  { label: 'Number', key: 'number' },
  { label: 'Wallet', key: 'wallet' },
]

export const HEADERS_CONTRIBUTORS = [
  { label: 'Number', key: 'number' },
  { label: 'Wallet', key: 'wallet' },
  { label: 'Currency', key: 'currency' },
  { label: 'Amount', key: 'amount' },
]

export const ALL_PRESALE_OPTION = {
  value: 'All Presales',
  label: 'Default (All)',
}

export const PUBLIC_ONLY_OPTION = {
  value: 'Public',
  label: 'Public Only',
}

export const WHITELIST_ONLY = {
  value: 'Whitelist',
  label: 'Whitelist Only',
}
