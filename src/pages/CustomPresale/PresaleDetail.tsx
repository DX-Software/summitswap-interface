import React, { useState, useEffect } from 'react'
import { intervalToDuration, differenceInDays } from 'date-fns'
import { Token } from '@koda-finance/summitswap-sdk'
import { BigNumber } from 'ethers'
import styled from 'styled-components'
import { Text, Box, Flex } from '@koda-finance/summitswap-uikit'
import { RowBetween, RowFixed } from 'components/Row'
import checkSalePhase from 'utils/checkSalePhase'
import { SUMMITSWAP_LINK, PANKCAKESWAP_LINK, FEE_DECIMALS } from '../../constants/presale'
import { ROUTER_ADDRESS } from '../../constants'
import { PresaleInfo, PresalePhases } from './types'
import { TextHeading, TextSubHeading } from './StyledTexts'

interface Props {
  presaleInfo: PresaleInfo | undefined
  presaleAddress: string
  formatUnits: (amount: BigNumber | undefined, decimals: number) => string
  token: Token | null | undefined
}

const TimeBox = styled.div`
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72px;
  color: #fff;
  font-weight: 700;
  font-size: 17px;
  text-align: center;
  background: linear-gradient(to bottom, #00c095 0%, #00c095 50%, #00d5a5 50%, #00d5a5 100%);
  border-radius: 5px;
  @media (max-width: 1450px) {
    height: 55px;
    width: 55px;
    font-size: 13px;
  }
  @media (max-width: 1200px) {
    height: 72px;
    width: 72px;
    font-size: 17px;
  }
  @media (max-width: 967px) {
    height: 55px;
    width: 55px;
    font-size: 13px;
  }
  @media (max-width: 800px) {
    height: 72px;
    width: 72px;
    font-size: 17px;
  }
  @media (max-width: 480px) {
    height: 45px;
    width: 45px;
    font-size: 10px;
  }
`

const TimeBoxTitle = styled(Text)`
  width: 72px;
  font-weight: 700;
  font-size: 17px;
  text-align: center;
  margin-top: 5px;
  @media (max-width: 1450px) {
    width: 55px;
    font-size: 13px;
  }
  @media (max-width: 1200px) {
    width: 72px;
    font-size: 17px;
  }
  @media (max-width: 967px) {
    width: 55px;
    font-size: 13px;
  }
  @media (max-width: 800px) {
    width: 72px;
    font-size: 17px;
  }
  @media (max-width: 480px) {
    width: 45px;
    font-size: 10px;
  }
`

export const PresaleInfoHeadingText = styled(Text)`
  font-weight: 700;
  font-size: 15px;
  @media (max-width: 480px) {
    font-size: 10px;
  }
`

export const PresaleInfoValueText = styled(Text)`
  font-weight: 400;
  font-size: 15px;
  max-width: 60%;
  word-wrap: break-word;
  text-align: right;
  @media (max-width: 480px) {
    font-size: 10px;
  }
`
const LinkText = styled.a`
  font-size: 15px;
  width: 200px;
  text-align: right;
  text-decoration-line: underline;
  color: #00d5a5;
  font-weight: 700;
  @media (max-width: 480px) {
    font-size: 10px;
  }
`
const PresaleDetail = ({ presaleInfo, presaleAddress, formatUnits, token }: Props) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [days, setDays] = useState<number>()
  const [hours, setHours] = useState<number>()
  const [minutes, setMinutes] = useState<number>()
  const [seconds, setSeconds] = useState<number>()

  useEffect(() => {
    if (
      presaleInfo &&
      (checkSalePhase(presaleInfo) === PresalePhases.PresaleNotStarted ||
        checkSalePhase(presaleInfo) === PresalePhases.PresalePhase)
    ) {
      const timer = setTimeout(() => {
        const startDate = new Date()
        const endDate =
          checkSalePhase(presaleInfo) === PresalePhases.PresaleNotStarted
            ? new Date(presaleInfo.startPresaleTime.mul(1000).toNumber())
            : new Date(presaleInfo.endPresaleTime.mul(1000).toNumber())
        const interval = intervalToDuration({
          start: startDate,
          end: endDate,
        })
        setDays(Math.abs(differenceInDays(startDate, endDate)))
        setHours(interval.hours)
        setMinutes(interval.minutes)
        setSeconds(interval.seconds)
        setCurrentTime(new Date())
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
    return undefined
  }, [presaleInfo, currentTime])

  const presaleDetailTitle = () => {
    switch (checkSalePhase(presaleInfo)) {
      case PresalePhases.PresalePhase:
        return 'This presale ends in :'
      case PresalePhases.PresaleNotStarted:
        return 'This presale starts in :'
      case PresalePhases.PresaleEnded:
        return 'This presale is ended.'
      case PresalePhases.PresaleCancelled:
        return 'This presale is cancelled.'
      default:
        return ''
    }
  }

  return (
    <Box padding="25px" width="100%" borderRadius="20px" background="#011724">
      <TextHeading marginBottom="20px" textAlign="center">
        {presaleDetailTitle()}
      </TextHeading>
      {(checkSalePhase(presaleInfo) === PresalePhases.PresaleNotStarted ||
        checkSalePhase(presaleInfo) === PresalePhases.PresalePhase) && (
        <>
          {' '}
          <RowFixed marginX="auto">
            <TimeBox>{days}</TimeBox>
            <TextSubHeading marginX="5px">:</TextSubHeading>
            <TimeBox>{hours}</TimeBox>
            <TextSubHeading marginX="5px">:</TextSubHeading>
            <TimeBox>{minutes}</TimeBox>
            <TextSubHeading marginX="5px">:</TextSubHeading>
            <TimeBox>{seconds}</TimeBox>
          </RowFixed>
          <RowFixed marginBottom="20px" marginX="auto">
            <TimeBoxTitle>Days</TimeBoxTitle>
            <Box width="16px" />
            <TimeBoxTitle>Hours</TimeBoxTitle>
            <Box width="16px" />
            <TimeBoxTitle>Minutes</TimeBoxTitle>
            <Box width="16px" />
            <TimeBoxTitle>Seconds</TimeBoxTitle>
          </RowFixed>
        </>
      )}
      <TextSubHeading marginTop="30px">Presale Details :</TextSubHeading>
      <Flex marginTop="20px" alignItems="baseline" justifyContent="space-between">
        <PresaleInfoHeadingText>Presale Address</PresaleInfoHeadingText>
        <PresaleInfoValueText color="#00D5A5">{presaleAddress}</PresaleInfoValueText>
      </Flex>
      <Flex marginTop="15px" alignItems="baseline" justifyContent="space-between">
        <PresaleInfoHeadingText>Presale Rate</PresaleInfoHeadingText>
        <PresaleInfoValueText>
          1 BNB = {formatUnits(presaleInfo?.presaleRate, 18)} {token?.symbol}
        </PresaleInfoValueText>
      </Flex>
      <Flex marginTop="15px" alignItems="baseline" justifyContent="space-between">
        <PresaleInfoHeadingText>Listing Rate</PresaleInfoHeadingText>
        <PresaleInfoValueText>
          1 BNB = {formatUnits(presaleInfo?.listingRate, 18)} {token?.symbol}
        </PresaleInfoValueText>
      </Flex>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Softcap</PresaleInfoHeadingText>
        <PresaleInfoValueText>{formatUnits(presaleInfo?.softcap, 18)} BNB</PresaleInfoValueText>
      </RowBetween>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Hardcap</PresaleInfoHeadingText>
        <PresaleInfoValueText>{formatUnits(presaleInfo?.hardcap, 18)} BNB</PresaleInfoValueText>
      </RowBetween>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Min Buy</PresaleInfoHeadingText>
        <PresaleInfoValueText>{formatUnits(presaleInfo?.minBuyBnb, 18)} BNB</PresaleInfoValueText>
      </RowBetween>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Max Buy</PresaleInfoHeadingText>
        <PresaleInfoValueText>{formatUnits(presaleInfo?.maxBuyBnb, 18)} BNB</PresaleInfoValueText>
      </RowBetween>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Liquidity Percent</PresaleInfoHeadingText>
        <PresaleInfoValueText>
          {Number(formatUnits(presaleInfo?.liquidity, FEE_DECIMALS - 2)).toFixed(0)}%
        </PresaleInfoValueText>
      </RowBetween>
      <RowBetween marginTop="15px">
        <PresaleInfoHeadingText>Listing On</PresaleInfoHeadingText>
        <LinkText
          href={
            presaleInfo?.router !== ROUTER_ADDRESS
              ? `${SUMMITSWAP_LINK}${token?.address}`
              : `${PANKCAKESWAP_LINK}${token?.address}`
          }
          rel="noopener noreferrer"
          target="_blank"
        >
          {presaleInfo?.router === ROUTER_ADDRESS ? 'Summitswap' : 'Pancakeswap'}
        </LinkText>
      </RowBetween>
      <Flex marginTop="15px" alignItems="baseline" justifyContent="space-between">
        <PresaleInfoHeadingText>Presale Start Time </PresaleInfoHeadingText>
        <PresaleInfoValueText>
          {presaleInfo ? new Date(presaleInfo.startPresaleTime.mul(1000).toNumber()).toUTCString() : ''}
        </PresaleInfoValueText>
      </Flex>
      <Flex marginTop="15px" alignItems="baseline" justifyContent="space-between">
        <PresaleInfoHeadingText>Presale End Time </PresaleInfoHeadingText>
        <PresaleInfoValueText>
          {presaleInfo ? new Date(presaleInfo.endPresaleTime.mul(1000).toNumber()).toUTCString() : ''}
        </PresaleInfoValueText>
      </Flex>
      <Flex marginTop="15px" alignItems="baseline" justifyContent="space-between">
        <PresaleInfoHeadingText>Liquidity Lock Time</PresaleInfoHeadingText>
        <PresaleInfoValueText>
          {presaleInfo && presaleInfo.liquidyLockTimeInMins.div(60).toNumber()} minutes after pool ends
        </PresaleInfoValueText>
      </Flex>
    </Box>
  )
}

export default PresaleDetail
