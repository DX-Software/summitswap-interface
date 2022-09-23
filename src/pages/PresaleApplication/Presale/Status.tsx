import React, { useState, useEffect } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import styled from 'styled-components'
import { useToken } from 'hooks/Tokens'
import { usePresaleContract } from 'hooks/useContract'
import { Box, Flex, darkColors } from '@koda-finance/summitswap-uikit'
import { checkSalePhase, fetchFeeInfo } from 'utils/presale'
import { NULL_ADDRESS } from 'constants/index'
import { TOKEN_CHOICES } from 'constants/presale'
import { StyledText } from './Shared'
import { PresalePhases, PresaleInfo, FeeInfo } from '../types'

interface Props {
  presaleAddress: string
  presaleInfo: PresaleInfo | undefined
}

const Card = styled(Box)`
  background: ${({ theme }) => theme.colors.menuItemBackground};
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid ${darkColors.borderColor};
  border-radius: 8px;
`

const Status = ({ presaleAddress, presaleInfo }: Props) => {
  const [presalePhase, setPresalePhase] = useState<string>(PresalePhases.PresaleNotStarted)
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currency, setCurrency] = useState('BNB')

  const presaleContract = usePresaleContract(presaleAddress)
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken === NULL_ADDRESS ? undefined : presaleFeeInfo?.paymentToken
  )

  useEffect(() => {
    async function fetchData() {
      const feeInfo = await fetchFeeInfo(presaleContract)
      setPresaleFeeInfo({ ...feeInfo })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

  useEffect(() => {
    if (presaleFeeInfo) {
      const currentCurrency = Object.keys(TOKEN_CHOICES).find(
        (key) => TOKEN_CHOICES[key] === presaleFeeInfo?.paymentToken
      )
      setCurrency(currentCurrency as string)
    }
  }, [presaleFeeInfo])

  useEffect(() => {
    if (presaleInfo) {
      const presalePhase_ = checkSalePhase(presaleInfo)
      const timer = setTimeout(() => {
        if (presalePhase_ !== presalePhase) setPresalePhase(presalePhase_)
        if (presalePhase === PresalePhases.PresalePhase || presalePhase === PresalePhases.PresaleNotStarted) {
          setCurrentTime(new Date())
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [presaleInfo, presalePhase, currentTime])

  const StatusText = () => {
    switch (presalePhase) {
      case PresalePhases.PresalePhase:
        return (
          <StyledText color="failure" fontWeight={700} fontSize="14px">
            Live
          </StyledText>
        )
      case PresalePhases.PresaleNotStarted:
        return (
          <StyledText color="binance" fontWeight={700} fontSize="14px">
            UPCOMING
          </StyledText>
        )
      case PresalePhases.PresaleCancelled:
        return (
          <StyledText color="textSubtle" fontWeight={700} fontSize="14px">
            CANCELLED
          </StyledText>
        )
      default:
        return (
          <StyledText color="textSubtle" fontWeight={700} fontSize="14px">
            ENDED
          </StyledText>
        )
    }
  }

  return (
    <Card>
      <Flex justifyContent="space-between">
        <StyledText fontSize="14px">Status</StyledText>
        {StatusText()}
      </Flex>
      <Flex marginTop="8px" justifyContent="space-between">
        <StyledText fontSize="14px">Presale Type</StyledText>
        <StyledText fontWeight={700} fontSize="14px">
          {presaleInfo?.isWhitelistEnabled ? 'WHITELIST' : 'PUBLIC'}
        </StyledText>
      </Flex>
      <Flex marginTop="8px" justifyContent="space-between">
        <StyledText fontSize="14px">Minimum Buy</StyledText>
        <StyledText fontSize="14px">{`${formatUnits(
          presaleInfo?.minBuy || 0,
          paymentToken?.decimals
        )} ${currency}`}</StyledText>
      </Flex>
      <Flex marginTop="8px" justifyContent="space-between">
        <StyledText fontSize="14px">Maximum Buy</StyledText>
        <StyledText fontSize="14px">{`${formatUnits(
          presaleInfo?.maxBuy || 0,
          paymentToken?.decimals
        )} ${currency}`}</StyledText>
      </Flex>
    </Card>
  )
}

export default Status
