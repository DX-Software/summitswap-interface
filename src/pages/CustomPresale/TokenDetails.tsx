import React from 'react'
import { Token } from '@koda-finance/summitswap-sdk'
import { BigNumber } from 'ethers'
import { Box, Flex } from '@koda-finance/summitswap-uikit'
import { useTotalSupply } from '../../data/TotalSupply'
import { RowBetween } from '../../components/Row'
import { FEE_DECIMALS, FEE_BNB_N_TOKEN, FEE_BNB_ONLY } from '../../constants/presale'
import { TextHeading } from './BuyTokens'
import { PresaleInfoHeadingText, PresaleInfoValueText } from './PresaleDetail'
import { PresaleInfo } from './types'

interface Props {
  presaleInfo: PresaleInfo | undefined
  formatUnits: (amount: BigNumber | undefined, decimals: number) => string
  token: Token | null | undefined
}

const TokenDetails = ({ presaleInfo, formatUnits, token }: Props) => {
  const tokenSupply = useTotalSupply(token as Token | undefined)

  let tokensForPresale
  let tokensForLiquidity
  if (presaleInfo) {
    tokensForPresale = formatUnits(presaleInfo.presaleRate.mul(presaleInfo.hardcap), 36)
    tokensForLiquidity = (
      Number(
        formatUnits(
          presaleInfo.liquidity
            .mul(
              presaleInfo.hardcap.sub(
                presaleInfo.hardcap.mul(presaleInfo.feeType ? FEE_BNB_N_TOKEN : FEE_BNB_ONLY).div(100)
              )
            )
            .mul(presaleInfo.listingRate),
          36 + FEE_DECIMALS
        )
      ) - (presaleInfo.feeType ? Number(tokensForPresale) * (FEE_BNB_N_TOKEN / 100) : 0)
    ).toFixed(2)
  }

  return (
    <Box marginTop="30px" padding="25px" width="100%" borderRadius="20px" background="#011724">
      <TextHeading marginTop="15px">Token Details :</TextHeading>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Token Name</PresaleInfoHeadingText>
        <PresaleInfoValueText>{token?.name}</PresaleInfoValueText>
      </RowBetween>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Token Symbol</PresaleInfoHeadingText>
        <PresaleInfoValueText>{token?.symbol}</PresaleInfoValueText>
      </RowBetween>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Token Decimals</PresaleInfoHeadingText>
        <PresaleInfoValueText>{token?.decimals}</PresaleInfoValueText>
      </RowBetween>
      <Flex marginTop="15px" alignItems="baseline" justifyContent="space-between">
        <PresaleInfoHeadingText>Token Address</PresaleInfoHeadingText>
        <PresaleInfoValueText color="#00D5A5">{token?.address}</PresaleInfoValueText>
      </Flex>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Total Supply</PresaleInfoHeadingText>
        <PresaleInfoValueText>
          {tokenSupply?.toFixed(0)} {token?.symbol}
        </PresaleInfoValueText>
      </RowBetween>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Tokens for Presale</PresaleInfoHeadingText>
        <PresaleInfoValueText>{tokensForPresale}</PresaleInfoValueText>
      </RowBetween>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Tokens for Liquidity</PresaleInfoHeadingText>
        <PresaleInfoValueText>{tokensForLiquidity}</PresaleInfoValueText>
      </RowBetween>
    </Box>
  )
}
export default TokenDetails
