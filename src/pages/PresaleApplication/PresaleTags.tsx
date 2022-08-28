import React, { useEffect, useState } from 'react'
import { Box, Tag, Text, LockIcon, UnLockIcon, CircleFilledIcon } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { RowFixed } from 'components/Row'
import { checkSalePhase } from 'utils/presale'
import { PresaleInfo, PresalePhases } from './types'

const StyledText = styled(Text)`
  font-size: ${({ fontSize }) => fontSize || '16px'};
  @media (max-width: 480px) {
    font-size: ${({ fontSize }) => `calc(${fontSize} - 2px)` || '14px'};
  }
`

interface Props {
  isAccountWhitelisted?: boolean
  presaleInfo?: PresaleInfo
}

const PresaleTags = ({ presaleInfo, isAccountWhitelisted }: Props) => {
  const [presalePhase, setPresalePhase] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

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
  }, [presaleInfo, currentTime, presalePhase])

  useEffect(() => {
    if (presaleInfo) {
      setPresalePhase(checkSalePhase(presaleInfo))
    }
  }, [presaleInfo])

  const SaleTypeTage = () => (
    <Box marginLeft="6px">
      {presaleInfo?.isWhitelistEnabled &&
        (isAccountWhitelisted ? (
          <Tag startIcon={<UnLockIcon width="10px" color="primary" />} variant="default">
            <StyledText color="primary" bold fontSize="12px">
              WHITELIST ONLY
            </StyledText>
          </Tag>
        ) : (
          <Tag startIcon={<LockIcon width="10px" color="textDisabled" />} variant="default">
            <StyledText color="black" bold fontSize="12px">
              WHITELIST ONLY
            </StyledText>
          </Tag>
        ))}
    </Box>
  )

  if (!presaleInfo) return <Box height="26px" />

  if (!presaleInfo.isApproved)
    return (
      <Tag variant="info">
        <StyledText bold fontSize="12px">
          WAITING FOR APPROVAL
        </StyledText>
      </Tag>
    )
  if (presalePhase === PresalePhases.PresaleNotStarted) {
    return (
      <RowFixed>
        <Tag variant="binance">
          <StyledText bold fontSize="12px">
            UPCOMING
          </StyledText>
        </Tag>
        {SaleTypeTage()}
      </RowFixed>
    )
  }
  if (presalePhase === PresalePhases.PresalePhase) {
    return (
      <RowFixed>
        <Tag startIcon={<CircleFilledIcon color="currentColor" width="10px" />} variant="failure">
          <StyledText bold fontSize="12px">
            LIVE
          </StyledText>
        </Tag>
        {SaleTypeTage()}
      </RowFixed>
    )
  }
  if (presalePhase === PresalePhases.PresaleEnded || presalePhase === PresalePhases.ClaimPhase) {
    return (
      <RowFixed>
        <Tag bold variant="textDisabled">
          <StyledText bold fontSize="12px">
            ENDED
          </StyledText>
        </Tag>
        {SaleTypeTage()}
      </RowFixed>
    )
  }
  if (presalePhase === PresalePhases.PresaleCancelled) {
    return (
      <RowFixed>
        <Tag bold variant="textDisabled">
          <StyledText bold fontSize="12px">
            CANCELLED
          </StyledText>
        </Tag>
        {SaleTypeTage()}
      </RowFixed>
    )
  }
  return <></>
}

export default PresaleTags
