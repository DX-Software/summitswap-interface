import React, { useEffect, useMemo, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { Box, Flex, darkColors } from '@koda-finance/summitswap-uikit'
import { useTokenContract, usePresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'

import { fetchPresaleInfo, fetchFeeInfo } from 'utils/presale'
import { FEE_DECIMALS } from 'constants/presale'
import { PresaleInfo, FeeInfo } from '../types'
import { DetailText, StyledText, Divider, DetailTextValue } from './Shared'

interface Props {
  presaleAddress: string
}

const TokenDetails = ({ presaleAddress }: Props) => {
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>()
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()

  const presaleToken = useToken(presaleInfo?.presaleToken)
  const tokenContract = useTokenContract(presaleInfo?.presaleToken, true)
  const presaleContract = usePresaleContract(presaleAddress)

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract)
      const feeInfo = await fetchFeeInfo(presaleContract)
      setPresaleInfo({ ...preInfo })
      setPresaleFeeInfo({ ...feeInfo })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

  useEffect(() => {
    async function fetchTotalSupply() {
      setTokenTotalSupply(
        Number(formatUnits(await tokenContract?.totalSupply(), presaleToken?.decimals)).toLocaleString()
      )
    }
    if (presaleToken && tokenContract) {
      fetchTotalSupply()
    }
  }, [tokenContract, presaleToken])

  const tokensForPresale: string = useMemo(
    () => formatUnits(presaleInfo?.presaleRate.mul(presaleInfo?.hardcap) || 0, 36),
    [presaleInfo?.hardcap, presaleInfo?.presaleRate]
  )

  const tokenForLiquidity: string = useMemo(() => {
    if (presaleInfo && presaleFeeInfo) {
      const liquidityTokensBnb = presaleInfo.hardcap.mul(presaleInfo.liquidity).div(10 ** FEE_DECIMALS)
      const feePresaleToken = presaleInfo.hardcap
        .mul(presaleFeeInfo.feePresaleToken)
        .div(10 ** FEE_DECIMALS)
        .mul(presaleInfo.presaleRate)

      return formatUnits(presaleInfo.listingRate.mul(liquidityTokensBnb).sub(feePresaleToken), 36)
    }
    return ''
  }, [presaleInfo, presaleFeeInfo])

  return (
    <Box>
      <StyledText marginBottom="2px" bold color={darkColors.primaryDark}>
        Token Details
      </StyledText>
      <Divider />
      <Flex marginTop="4px" justifyContent="space-between">
        <DetailText>Token Name</DetailText>
        <DetailTextValue>{presaleToken?.name}</DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Token Symbol</DetailText>
        <DetailTextValue>{presaleToken?.symbol}</DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Token Decimal</DetailText>
        <DetailTextValue>{presaleToken?.decimals}</DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Token Address</DetailText>
        <DetailTextValue>{presaleToken?.address}</DetailTextValue>
      </Flex>
      <Flex justifyContent="end">
        <StyledText textAlign="right" fontSize="12px" style={{ minWidth: '100%' }} color="failure">
          (Do not send BNB to the token address!)
        </StyledText>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Total Supply</DetailText>
        <DetailTextValue>{`${tokenTotalSupply} ${presaleToken?.symbol}`}</DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Tokens for Presale</DetailText>
        <DetailTextValue>{tokensForPresale}</DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Tokens for Liquidity</DetailText>
        <DetailTextValue>{tokenForLiquidity}</DetailTextValue>
      </Flex>
    </Box>
  )
}

export default TokenDetails
