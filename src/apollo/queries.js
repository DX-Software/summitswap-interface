/* eslint-disable */
import gql from 'graphql-tag'

export const FACTORY_ADDRESS = process.env.REACT_APP_FACTORY_ADDRESS
export const BUNDLE_ID = '1'

export const ETH_PRICE = (block) => {
  const queryString = block
    ? `
    query bundles {
      bundles(where: { id: ${BUNDLE_ID} } block: {number: ${block}}) {
        id
        bnbPrice
      }
    }
  `
    : ` query bundles {
      bundles(where: { id: ${BUNDLE_ID} }) {
        id
        bnbPrice
      }
    }
  `
  return gql(queryString)
}

export const GLOBAL_DATA = (block) => {
  const queryString = ` query uniswapFactories {
      uniswapFactories(
       ${block ? `block: { number: ${block}}` : ``}
       where: { id: "${FACTORY_ADDRESS}" }) {
        id
        totalVolumeUSD
        totalVolumeETH
        untrackedVolumeUSD
        totalLiquidityUSD
        totalLiquidityETH
        txCount
        pairCount
      }
    }`
  return gql(queryString)
}

const TokenFields = `
  fragment TokenFields on Token {
    id
    name
    symbol
    derivedBNB
    tradeVolume
    tradeVolumeUSD
    untrackedVolumeUSD
    totalLiquidity
    txCount
  }
`

export const TOKENS_CURRENT = gql`
  ${TokenFields}
  query tokens {
    tokens(first: 200, orderBy: tradeVolumeUSD, orderDirection: desc) {
      ...TokenFields
    }
  }
`
