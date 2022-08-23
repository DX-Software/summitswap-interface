import React from 'react'
import { Box, Tag, Text, LockIcon, UnLockIcon, CircleFilledIcon } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { RowFixed } from 'components/Row'
import { PresaleInfo } from './types'

const StyledText = styled(Text)`
  font-size: ${({ fontSize }) => fontSize || '16px'};
  @media (max-width: 480px) {
    font-size: ${({ fontSize }) => `calc(${fontSize} - 2px)` || '14px'};
  }
`

const PresaleTags = ({ presaleInfo }: { presaleInfo: PresaleInfo | undefined }) => {
  const SaleTypeTage = () => (
    <Box marginLeft="6px">
      {presaleInfo?.isVestingEnabled ? (
        <Tag startIcon={<LockIcon width="10px" color="textDisabled" />} variant="default">
          <StyledText color="black" bold fontSize="12px">
            WHITELIST ONLY
          </StyledText>
        </Tag>
      ) : (
        <Tag startIcon={<UnLockIcon width="10px" color="primary" />} variant="default">
          <StyledText color="primary" bold fontSize="12px">
            PUBLIC
          </StyledText>
        </Tag>
      )}
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
  if (new Date() < new Date(presaleInfo.startPresaleTime.mul(1000).toNumber())) {
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
  if (new Date() < new Date(presaleInfo.endPresaleTime.mul(1000).toNumber())) {
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
  if (new Date() > new Date(presaleInfo.endPresaleTime.mul(1000).toNumber())) {
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
  return <></>
}

export default PresaleTags
