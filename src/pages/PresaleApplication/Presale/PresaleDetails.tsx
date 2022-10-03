import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatUnits } from 'ethers/lib/utils'
import { Box, Flex, darkColors, HelpIcon } from '@koda-finance/summitswap-uikit'
import { usePresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { fetchPresaleInfo, fetchFeeInfo } from 'utils/presale'
import { RowFixed } from 'components/Row'
import { MouseoverTooltip } from 'components/Tooltip'
import { FEE_DECIMALS, TOKEN_CHOICES, RADIO_VALUES } from 'constants/presale'
import { PresaleInfo, FeeInfo } from '../types'
import { DetailText, StyledText, Divider, DetailTextValue } from './Shared'

interface Props {
  presaleAddress: string
}

const VestingPlaceholder = styled.div`
  width: 0px;
  height: inherit;
  border: 2px solid ${({ theme }) => theme.colors.primaryDark};
  margin-left: 35px;
  @media (max-width: 480px) {
    margin-left: 5px;
  }
`

const PresaleDetails = ({ presaleAddress }: Props) => {
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [currency, setCurrency] = useState('BNB')

  const presaleContract = usePresaleContract(presaleAddress)
  const presaleToken = useToken(presaleInfo?.presaleToken)

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
    const currentCurrency = Object.keys(TOKEN_CHOICES).find(
      (key) => TOKEN_CHOICES[key] === presaleFeeInfo?.paymentToken
    )
    setCurrency(currentCurrency as string)
  }, [presaleFeeInfo])

  return (
    <Box>
      <StyledText marginBottom="2px" bold color={darkColors.primaryDark}>
        Presale Details
      </StyledText>
      <Divider />
      <Flex marginTop="4px" justifyContent="space-between">
        <DetailText>Presale Rate</DetailText>
        <DetailTextValue>
          {`1 ${currency} = ${formatUnits(presaleInfo?.presaleRate || 0)} ${presaleToken?.symbol || ''}`}{' '}
        </DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Listing Rate</DetailText>
        <DetailTextValue>
          {`1 ${currency} = ${formatUnits(presaleInfo?.listingRate || 0)} ${presaleToken?.symbol || ''}`}{' '}
        </DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Unsold Tokens</DetailText>
        <DetailTextValue>
          {presaleInfo?.refundType === RADIO_VALUES.REFUND_TYPE_REFUND ? 'Refund' : 'BURN'}
        </DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Claim System</DetailText>
        <RowFixed>
          <DetailTextValue marginRight="4px">{presaleInfo?.isVestingEnabled ? 'Vesting' : 'Claim All'}</DetailTextValue>
          <MouseoverTooltip
            size="11px"
            text={
              presaleInfo?.isVestingEnabled
                ? 'You will be able to claim your tokens gradually based on the interval defined'
                : 'You will be able to claim 100% of your tokens after the presale ends'
            }
          >
            <HelpIcon width="12px" color="info" />
          </MouseoverTooltip>
        </RowFixed>
      </Flex>
      {presaleInfo?.isVestingEnabled && (
        <Flex marginTop="8px" justifyContent="start">
          <VestingPlaceholder />
          <Box marginLeft="16px">
            <StyledText fontSize="14px" bold color={darkColors.primaryDark}>
              Vesting System
            </StyledText>
            <RowFixed marginTop="4px">
              <StyledText style={{ width: '150px' }} fontSize="14px">
                Vesting Percentage
              </StyledText>
              <StyledText fontSize="14px">{`${presaleInfo?.maxClaimPercentage
                .mul(100)
                .div(10 ** FEE_DECIMALS)}%`}</StyledText>
            </RowFixed>
            <RowFixed marginTop="2px">
              <StyledText style={{ width: '150px' }} fontSize="14px">
                Interval Day
              </StyledText>
              <StyledText fontSize="14px">{`${presaleInfo?.claimIntervalDay}`}</StyledText>
            </RowFixed>
            <RowFixed marginTop="2px">
              <StyledText style={{ width: '150px' }} fontSize="14px">
                Interval Time (UTC)
              </StyledText>
              <StyledText fontSize="14px">
                {`${
                  presaleInfo?.claimIntervalHour.lt(10)
                    ? `0${presaleInfo?.claimIntervalHour}`
                    : presaleInfo?.claimIntervalHour
                }:00 UTC`}
              </StyledText>
            </RowFixed>
            <StyledText color="textSubtle" marginTop="6px" fontSize="14px">
              Every
              <StyledText fontSize="14px" style={{ display: 'inline' }} color="primaryDark" bold>
                &nbsp;{`${presaleInfo?.maxClaimPercentage.mul(100).div(10 ** FEE_DECIMALS)}%`}&nbsp;
              </StyledText>
              of the total claimable token will be available for redeem on
              <StyledText fontSize="14px" style={{ display: 'inline' }} color="primaryDark" bold>
                &nbsp;{`day ${presaleInfo?.claimIntervalDay}`}&nbsp;
              </StyledText>
              at
              <StyledText fontSize="14px" style={{ display: 'inline' }} color="primaryDark" bold>
                &nbsp;
                {`${
                  presaleInfo?.claimIntervalHour.lt(10)
                    ? `0${presaleInfo?.claimIntervalHour}`
                    : presaleInfo?.claimIntervalHour
                }:00 UTC`}
                &nbsp;
              </StyledText>
              of the following month
            </StyledText>
          </Box>
        </Flex>
      )}
    </Box>
  )
}

export default PresaleDetails
