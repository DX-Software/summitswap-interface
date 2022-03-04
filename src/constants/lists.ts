import { CHAIN_ID } from "./index"

const fileName = CHAIN_ID === 56 ? "bsc" : "bsc-testnet"
export const DEFAULT_TOKEN_LIST_URL = `https://raw.githubusercontent.com/Koda-Finance/summitswap-data/main/build/${fileName}.json`

export const DEFAULT_LIST_OF_LISTS: string[] = [DEFAULT_TOKEN_LIST_URL]
