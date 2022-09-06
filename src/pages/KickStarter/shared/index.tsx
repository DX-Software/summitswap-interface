import React from 'react'
import { CheckmarkIcon, CloseIcon, Flex, Skeleton, Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { KickstarterApprovalStatus } from 'types/kickstarter'
import { getKickstarterApprovalStatusLabel } from 'utils/kickstarter'

type InfoProps = {
  title: string
  description: string
  isLoading?: boolean
}
type CurrencyInfoProps = {
  title: string
  description: string
  iconUrl: string
  isLoading?: boolean
}
type StatusInfoProps = {
  title: string
  approvalStatus: KickstarterApprovalStatus
  isLoading?: boolean
}

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.info};
`

const StatusText = styled(Text)<{ approvalStatus: KickstarterApprovalStatus }>`
  ${({ approvalStatus, theme }) => approvalStatus === KickstarterApprovalStatus.WAITING_FOR_APPROVAL && `
    color: ${theme.colors.info};
  `}
  ${({ approvalStatus, theme }) => approvalStatus === KickstarterApprovalStatus.APPROVED && `
    color: ${theme.colors.primary};
  `}
  ${({ approvalStatus, theme }) => approvalStatus === KickstarterApprovalStatus.REJECTED && `
    color: ${theme.colors.failure};
  `}
`

const ImgCurrency = styled.div<{ image: string }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  flex-shrink: 0;

  background: ${(props) => `gray url(${props.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;
`

export const Divider = styled(Flex)`
  width: 100%;
  height: 1px;
  margin: 16px 0px;
  background-color: ${({theme}) => theme.colors.inputColor};
`

export const TextInfo = ({ title, description, isLoading = false }: InfoProps) => {
  return (
    <>
      <Text fontSize="14px" color="textSubtle" marginBottom="4px">
        {title}
      </Text>
      {isLoading ? <Skeleton width={180} height={24} /> : <Text>{description}</Text>}
    </>
  )
}

export const CurrencyInfo = ({ title, description, iconUrl, isLoading }: CurrencyInfoProps) => {
  return (
    <>
      <Text fontSize="14px" color="textSubtle" marginBottom="4px">
        {title}
      </Text>
      {isLoading ? (
        <Skeleton width={90} height={24} />
      ) : (
        <Flex style={{ columnGap: '8px', alignItems: 'center' }}>
          <ImgCurrency image={iconUrl} />
          <Text>{description}</Text>
        </Flex>
      )}
    </>
  )
}

export const StatusInfo = ({ title, approvalStatus, isLoading = false }: StatusInfoProps) => {
  return (
    <>
      <Text fontSize="14px" color="textSubtle" marginBottom="4px">
        {title}
      </Text>
      {isLoading ? (
        <Skeleton width={90} height={24} />
      ) : (
        <Flex style={{ columnGap: '8px', alignItems: 'center' }}>
          {approvalStatus === KickstarterApprovalStatus.WAITING_FOR_APPROVAL && <StatusDot />}
          {approvalStatus === KickstarterApprovalStatus.APPROVED && <CheckmarkIcon width="24px" />}
          {approvalStatus === KickstarterApprovalStatus.REJECTED && <CloseIcon width="28px" color='failure' />}
          <StatusText approvalStatus={approvalStatus}>{getKickstarterApprovalStatusLabel(approvalStatus)}</StatusText>
        </Flex>
      )}
    </>
  )
}
