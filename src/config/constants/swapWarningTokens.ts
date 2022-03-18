import { Token } from '@koda-finance/summitswap-sdk'
import tokens from './tokens'

const { bondly, safemoon, itam, ccar, bttold } = tokens

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{
  safemoon,
  bondly,
  itam,
  ccar,
  bttold,
}

export default SwapWarningTokens
