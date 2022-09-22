import React, { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import styled from 'styled-components'
import { formatUnits } from 'ethers/lib/utils'
import { AutoRenewIcon, Button, Box, Flex } from '@koda-finance/summitswap-uikit'
import { checkSalePhase } from 'utils/presale'
import { StyledText } from './Shared'
import { PresalePhases, PresaleInfo, LoadingForButton, LoadingButtonTypes } from '../types'

interface Props {
  presaleInfo: PresaleInfo | undefined
  paymentDecimals: number
  currency: string
  boughtAmount: BigNumber
  tokenSymbol: string | undefined
  isMainLoading: boolean
  isLoadingButton: LoadingForButton
  openWithdrawModal?: () => void
}

const ContributionCard = styled(Box)`
  background: ${({ theme }) => theme.colors.primaryDark};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`

const ContributionBox = ({
  boughtAmount,
  currency,
  tokenSymbol,
  presaleInfo,
  isMainLoading,
  paymentDecimals,
  isLoadingButton,
  openWithdrawModal,
}: Props) => {
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
      {presalePhase === PresalePhases.PresalePhase && !presaleInfo?.hardcap.eq(presaleInfo.totalBought) && (
        <>
          <Button
            onClick={openWithdrawModal}
            disabled={isMainLoading || isLoadingButton.isClicked}
            endIcon={
              isLoadingButton.isClicked &&
              isLoadingButton.type === LoadingButtonTypes.EmergencyWithdraw && (
                <AutoRenewIcon spin color="currentColor" />
              )
            }
            marginTop="8px"
            scale="sm"
            width="100%"
            variant="tertiary"
          >
            Withdraw My Contribution
          </Button>
          <StyledText fontSize="10px" marginTop="2px" color="warning">
            {isLoadingButton.error}
          </StyledText>
        </>
      )}
    </ContributionCard>
  ) : (
    <></>
  )
}

export default ContributionBox
