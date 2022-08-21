import React from 'react'
import styled from 'styled-components'
import { Box, CheckmarkIcon, Flex, Text } from '@koda-finance/summitswap-uikit'
import CopyButton from 'components/CopyButton'
import { PresaleInfo } from '../types'

const ResonsiveFlex = styled(Flex)`
  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const StatusBox = styled(Box)`
  background: ${({ theme }) => theme.colors.menuItemBackground};
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.backgroundDisabled};
  border-radius: 5px;
`

const TextStatusBox = styled(Text)`
  text-align: left;
  word-wrap: break-word;
  @media (max-width: 600px) {
    font-size: 12px;
  }
  @media (max-width: 350px) {
    font-size: 9px;
    max-width: 100%;
  }
  @media (max-width: 280px) {
    max-width: 120px;
  }
`

const CopyButtonWrapper = styled(Box)`
  @media (max-width: 380px) {
    display: none;
  }
`
interface Props {
  presaleInfo: PresaleInfo | undefined
  presaleAddress: string
  isPresaleEdit?: boolean
}

const PresaleStatus = ({ presaleInfo, presaleAddress, isPresaleEdit = false }: Props) => {
  const getColor = () => {
    if (isPresaleEdit) {
      return 'warning'
    }
    if (presaleInfo?.isApproved) {
      return 'primary'
    }
    return 'info'
  }
  return (
    <StatusBox>
      <ResonsiveFlex flexWrap="wrap">
        <TextStatusBox color="textSubtle" style={{ width: '160px' }}>
          Presale Status
        </TextStatusBox>
        <TextStatusBox color={getColor()}>
          <TextStatusBox bold color={getColor()} style={{ display: 'inline' }}>
            {presaleInfo?.isApproved ? <CheckmarkIcon color="primary" width="15px" /> : 'O'}
          </TextStatusBox>
          &nbsp;{presaleInfo?.isApproved ? 'Approved' : 'Waiting for Approval'}
        </TextStatusBox>
      </ResonsiveFlex>
      <ResonsiveFlex flexWrap="wrap">
        <TextStatusBox color="textSubtle" style={{ width: '160px' }}>
          Presale Address
        </TextStatusBox>
        <Flex flex="wrap" alignItems="center">
          <TextStatusBox>{presaleAddress}&nbsp;</TextStatusBox>
          <CopyButtonWrapper style={{ position: 'relative' }}>
            <CopyButton
              color="linkColor"
              text={presaleAddress}
              tooltipMessage="Copied"
              tooltipTop={20}
              tooltipRight={-30}
              width="15px"
            />
          </CopyButtonWrapper>
        </Flex>
      </ResonsiveFlex>
    </StatusBox>
  )
}

export default PresaleStatus
