import { Box, Button, Progress, Text } from '@koda-finance/summitswap-uikit'
import { RowBetween } from 'components/Row'
import Tag from 'components/Tag'
import { FEE_DECIMALS } from 'constants/presale'
import { differenceInDays, formatDuration, intervalToDuration } from 'date-fns'
import { formatUnits } from 'ethers/lib/utils'
import { useToken } from 'hooks/Tokens'
import { usePresaleContract } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import checkSalePhase from 'utils/checkSalePhase'
import fetchPresaleInfo from 'utils/fetchPresaleInfo'
import ProgressBox from './PresaleProgress/ProgressBox'
import { TextHeading } from './StyledTexts'
import { PresaleInfo, PresalePhases } from './types'

interface Props {
  presaleAddress: string
}

const StyledTextCard = styled(Text)`
  font-weight: 400;
  font-size: 14px;
  opacity: 0.5;
  text-align: right;
`

const PresaleCard = ({ presaleAddress }: Props) => {
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [contributors, setContributors] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [days, setDays] = useState<number>()
  const [hours, setHours] = useState<number>()
  const [minutes, setMinutes] = useState<number>()
  const [seconds, setSeconds] = useState<number>()

  const token = useToken(presaleInfo?.presaleToken)
  const presaleContract = usePresaleContract(presaleAddress)

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract)
      setPresaleInfo({ ...preInfo })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

  const formatedDate = () => {
    return formatDuration(
      {
        days,
        hours,
        minutes,
        seconds,
      },
      { delimiter: ' : ' }
    ).replace(/\sday(s?)|\shour(s?)|\sminute(s?)|\ssecond(s?)/gi, (x) => {
      switch (x) {
        case ' day':
        case ' days':
          return 'D'
        case ' hour':
        case ' hours':
          return 'H'
        case ' minute':
        case ' minutes':
          return 'M'
        case ' second':
        case ' seconds':
          return 'S'
        default:
          return ''
      }
    })
  }

  useEffect(() => {
    const presalePhase = checkSalePhase(presaleInfo)
    if (presaleInfo) {
      const timer = setTimeout(() => {
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
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [presaleInfo, currentTime])

  useEffect(() => {
    async function getContributors() {
      setContributors(await presaleContract?.getContributors())
    }
    if (presaleInfo && presaleContract) getContributors()
  }, [presaleInfo, presaleContract])

  return (
    <Box
      marginTop="30px"
      marginX="5px"
      padding="40px"
      width="400px"
      height="560px"
      borderRadius="10px"
      background="#000F18"
    >
      <TextHeading style={{ height: '36px' }}>{token?.name}</TextHeading>
      <Tag saleTypeTag={presaleInfo?.isWhitelistEnabled}>
        {presaleInfo?.isWhitelistEnabled ? 'WHITELIST' : 'PUBLIC'}
      </Tag>
      <Text marginTop="20px">
        1 BNB = {Number(formatUnits(presaleInfo?.presaleRate || 0, 18)).toFixed(2)} {token?.symbol}
      </Text>
      <Text marginTop="20px">
        Progress ({presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toNumber().toFixed(2)}%)
      </Text>
      <ProgressBox paddingY="5px" isProgressBnb>
        <Progress primaryStep={presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toNumber()} />
      </ProgressBox>
      <RowBetween>
        <Text>{`${Number(formatUnits(presaleInfo?.totalBought || 0, 18)).toFixed(2)} BNB`}</Text>
        <Text>{`${Number(formatUnits(presaleInfo?.hardcap || 0, 18)).toFixed(2)} BNB`}</Text>
      </RowBetween>
      <RowBetween marginTop="15px">
        <Text fontWeight={700} fontSize="17px">
          Presale Status:
        </Text>
        <StyledTextCard textTransform="capitalize">{checkSalePhase(presaleInfo).toLowerCase()}</StyledTextCard>
      </RowBetween>
      <RowBetween marginTop="10px">
        <Text fontWeight={700} fontSize="17px">
          Liquidity%:
        </Text>
        <StyledTextCard>
          {Number(formatUnits(presaleInfo?.liquidity || 0, FEE_DECIMALS - 2)).toFixed(0)}%
        </StyledTextCard>
      </RowBetween>
      <RowBetween marginTop="10px">
        <Text fontWeight={700} fontSize="17px">
          Lockup Time:
        </Text>
        <StyledTextCard>{presaleInfo?.liquidyLockTimeInMins.div(60).toNumber()} minutes</StyledTextCard>
      </RowBetween>
      <RowBetween marginTop="10px">
        <Text fontWeight={700} fontSize="17px">
          Contributor:
        </Text>
        <StyledTextCard>{contributors.length}</StyledTextCard>
      </RowBetween>
      <RowBetween marginTop="20px">
        {(checkSalePhase(presaleInfo) === PresalePhases.PresaleNotStarted ||
          checkSalePhase(presaleInfo) === PresalePhases.PresalePhase) && (
          <Box>
            <Text fontWeight={700} fontSize="17px">
              Sale {checkSalePhase(presaleInfo) === PresalePhases.PresaleNotStarted ? 'Starts' : 'Ends'} in:{' '}
            </Text>
            <Text fontSize="15px">{formatedDate()}</Text>
          </Box>
        )}
        <Box>
          <Text fontWeight={700} fontSize="17px">
            Soft / Hard :{' '}
          </Text>
          <Text fontSize="15px">{`${formatUnits(presaleInfo?.softcap || 0, 18)} BNB - ${formatUnits(
            presaleInfo?.hardcap || 0,
            18
          )} BNB`}</Text>
        </Box>
      </RowBetween>
      <a href={`/#/presale?address=${presaleAddress}`} rel="noreferrer" target="_blank">
        <Button marginTop="20px" width="100%">
          View Pool
        </Button>
      </a>
    </Box>
  )
}

export default PresaleCard
