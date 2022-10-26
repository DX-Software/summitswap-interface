import React, { useState, useEffect } from 'react'
import { differenceInDays, intervalToDuration } from 'date-fns'
import styled from 'styled-components'
import { Box, Flex, darkColors } from '@koda-finance/summitswap-uikit'
import { checkSalePhase } from 'utils/presale'
import { StyledText } from './Shared'
import { PresalePhases, PresaleInfo } from '../types'

interface Props {
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

const TimeBox = styled(Box)<{ isPresalePhase: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 36px;
  border-radius: 4px;
  background: ${({ theme, isPresalePhase }) => (isPresalePhase ? theme.colors.failure : theme.colors.primary)};
`

const TimeDetails = ({ presaleInfo }: Props) => {
  const [presalePhase, setPresalePhase] = useState<string>('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [days, setDays] = useState<number>()
  const [hours, setHours] = useState<number>()
  const [minutes, setMinutes] = useState<number>()
  const [seconds, setSeconds] = useState<number>()

  useEffect(() => {
    if (presaleInfo) {
      const presalePhase_ = checkSalePhase(presaleInfo)
      const timer = setTimeout(() => {
        if (presalePhase_ !== presalePhase) setPresalePhase(presalePhase_)
        if (presalePhase === PresalePhases.PresalePhase || presalePhase === PresalePhases.PresaleNotStarted) {
          const startDate = new Date()
          const endDate =
            presalePhase === PresalePhases.PresaleNotStarted
              ? new Date(presaleInfo.startPresaleTime.mul(1000).toNumber())
              : new Date(presaleInfo.endPresaleTime.mul(1000).toNumber())
          const interval = intervalToDuration({
            start: startDate,
            end: endDate,
          })
          setDays(Math.abs(differenceInDays(endDate, startDate)))
          setHours(interval.hours)
          setMinutes(interval.minutes)
          setSeconds(interval.seconds)
          setCurrentTime(startDate)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [presaleInfo, presalePhase, currentTime])

  const phaseText = () => {
    switch (presalePhase) {
      case PresalePhases.PresalePhase:
        return 'Presale Ends in'
      case PresalePhases.PresaleNotStarted:
        return 'Presale Starts in'
      case PresalePhases.PresaleEnded:
        return 'Presale has ended'
      case PresalePhases.PresaleCancelled:
        return 'Presale Cancelled'
      case PresalePhases.ClaimPhase:
        return 'Presale has ended'
      default:
        return ''
    }
  }

  return (
    <Card>
      <StyledText fontSize="20px" fontWeight={700} color="sidebarColor">
        {phaseText()}
      </StyledText>
      {presaleInfo &&
        (presalePhase === PresalePhases.PresalePhase || presalePhase === PresalePhases.PresaleNotStarted) && (
          <>
            <Flex alignItems="center" marginTop="16px" justifyContent="space-between" maxWidth="300px">
              <TimeBox isPresalePhase={presalePhase === PresalePhases.PresalePhase}>
                <StyledText fontWeight={700}>{days}D</StyledText>
              </TimeBox>
              <StyledText fontWeight={700}>:</StyledText>
              <TimeBox isPresalePhase={presalePhase === PresalePhases.PresalePhase}>
                <StyledText fontWeight={700}>{hours}H</StyledText>
              </TimeBox>
              <StyledText fontWeight={700}>:</StyledText>
              <TimeBox isPresalePhase={presalePhase === PresalePhases.PresalePhase}>
                <StyledText fontWeight={700}>{minutes}M</StyledText>
              </TimeBox>
              <StyledText fontWeight={700}>:</StyledText>
              <TimeBox isPresalePhase={presalePhase === PresalePhases.PresalePhase}>
                <StyledText fontWeight={700}>{seconds}S</StyledText>
              </TimeBox>
            </Flex>
            {presalePhase === PresalePhases.PresaleNotStarted ? (
              <StyledText color="primary" marginTop="4px" fontSize="12px">
                Presale Coming Soon!
              </StyledText>
            ) : (
              <StyledText color="failure" marginTop="4px" fontSize="12px">
                Join presale before it ends!
              </StyledText>
            )}
          </>
        )}
      <Box marginTop="16px">
        <StyledText fontSize="14px" color="textSubtle">
          Presale Start Time
        </StyledText>
        <StyledText fontWeight={700}>
          {new Date(presaleInfo?.startPresaleTime.mul(1000).toNumber() || 0).toUTCString().replace('GMT', 'UTC')}
        </StyledText>
      </Box>
      <Box marginTop="16px">
        <StyledText fontSize="14px" color="textSubtle">
          Presale End Time
        </StyledText>
        <StyledText fontWeight={700}>
          {new Date(presaleInfo?.endPresaleTime.mul(1000).toNumber() || 0).toUTCString().replace('GMT', 'UTC')}
        </StyledText>
      </Box>
    </Card>
  )
}

export default TimeDetails
