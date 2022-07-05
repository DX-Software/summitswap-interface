import { Token } from '@koda-finance/summitswap-sdk'
import { Box, Flex } from '@koda-finance/summitswap-uikit'
import { RowBetween } from 'components/Row'
import { FEE_BNB_N_TOKEN, FEE_BNB_ONLY, FEE_DECIMALS } from 'constants/presale'
import { useTotalSupply } from 'data/TotalSupply'
import { formatUnits } from 'ethers/lib/utils'
import React, { useMemo } from 'react'
import { PresaleInfoHeadingText, PresaleInfoValueText } from './PresaleDetail'
import { TextHeading } from './StyledTexts'
import { PresaleInfo } from './types'

interface Props {
  presaleInfo: PresaleInfo | undefined
  token: Token | null | undefined
}

const TokenDetails = ({ presaleInfo, token }: Props) => {
  const tokenSupply = useTotalSupply(token as Token | undefined)

  const tokensForPresale: string = useMemo(
    () => formatUnits(presaleInfo?.presaleRate.mul(presaleInfo?.hardcap) || 0, 36),
    [presaleInfo?.hardcap, presaleInfo?.presaleRate]
  )
  const tokensForLiquidity: string | undefined = useMemo(
    () =>
      presaleInfo &&
      (
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
      ).toFixed(2),
    [presaleInfo, tokensForPresale]
  )

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
        <PresaleInfoValueText>{tokensForLiquidity || ''}</PresaleInfoValueText>
      </RowBetween>
    </Box>
  )
}
export default TokenDetails
