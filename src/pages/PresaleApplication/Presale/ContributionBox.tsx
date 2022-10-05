import { Box, Flex } from '@koda-finance/summitswap-uikit'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { checkSalePhase } from 'utils/presale'
import { PresaleInfo, PresalePhases } from '../types'
import { StyledText } from './Shared'

interface Props {
  presaleInfo: PresaleInfo | undefined
  paymentDecimals: number
  currency: string
  boughtAmount: BigNumber
  tokenSymbol: string | undefined
}

const ContributionCard = styled(Box)`
  background: ${({ theme }) => theme.colors.primaryDark};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`

const ContributionBox = ({ boughtAmount, currency, tokenSymbol, presaleInfo, paymentDecimals }: Props) => {
  const [presalePhase, setPresalePhase] = useState<string>(PresalePhases.PresalePhase)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (presaleInfo) {
      const presalePhase_ = checkSalePhase(presaleInfo)
      const timer = setTimeout(() => {
        if (presalePhase === PresalePhases.PresalePhase) {
          setCurrentTime(new Date())
          if (presalePhase_ !== presalePhase) setPresalePhase(presalePhase_)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [presaleInfo, presalePhase, currentTime])

  return boughtAmount.gt(0) ? (
    <ContributionCard>
      <StyledText fontSize="14px" marginBottom="2px" bold>
        You have contributed to this presale
      </StyledText>
      <Flex justifyContent="space-between">
        <StyledText fontSize="12px">Total Contribution</StyledText>
        <StyledText fontSize="12px">{`${formatUnits(boughtAmount, paymentDecimals)} ${currency}`}</StyledText>
      </Flex>
      <Flex justifyContent="space-between">
        <StyledText fontSize="12px">Token Conversion</StyledText>
        <StyledText fontSize="12px">
          {`${formatUnits(boughtAmount.mul(presaleInfo?.presaleRate || 0), 18 + paymentDecimals)} ${tokenSymbol}`}
        </StyledText>
      </Flex>
    </ContributionCard>
  ) : (
    <></>
  )
}

export default React.memo(ContributionBox)
