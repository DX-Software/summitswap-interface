import React, { useState, useCallback, useEffect } from 'react'
import { intervalToDuration, differenceInDays, formatDuration } from 'date-fns'
import { BigNumber, ethers } from 'ethers'
import styled from 'styled-components'
import { Text, Box, Button, Progress } from '@koda-finance/summitswap-uikit'
import { useToken } from '../../hooks/Tokens'
import { usePresaleContract } from '../../hooks/useContract'
import { RowBetween } from '../../components/Row'
import { FEE_DECIMALS } from '../../constants/presale'
import Tag from '../../components/Tag'
import { PresaleInfo, FieldNames, PresalePhases } from './types'
import { TextHeading } from './StyledTexts'
import ProgressBox from './PresaleProgress/ProgressBox'

interface Props {
  presaleAddress: string
}

const StyledTextCard = styled(Text)`
  font-weight: 400;
  font-size: 14px;
  opacity: 0.5;
  text-align: right;
`

export default function PresaleCard({ presaleAddress }: Props) {
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
      const owner: string = await presaleContract?.owner()
      const info = await presaleContract?.getInfo()
      const obKeys = [
        FieldNames.presaleToken,
        FieldNames.router,
        FieldNames.presaleRate,
        FieldNames.listingRate,
        FieldNames.liquidyLockTimeInMins,
        FieldNames.minBuyBnb,
        FieldNames.maxBuyBnb,
        FieldNames.softcap,
        FieldNames.hardcap,
        FieldNames.liquidity,
        FieldNames.startPresaleTime,
        FieldNames.endPresaleTime,
        FieldNames.totalBought,
        FieldNames.feeType,
        FieldNames.refundType,
        FieldNames.isWhitelistEnabled,
        FieldNames.isClaimPhase,
        FieldNames.isPresaleCancelled,
        FieldNames.isWithdrawCancelledTokens,
      ]
      const preInfo: PresaleInfo = info.reduce(
        (acc: any, cur: string | BigNumber | number | boolean, i: number) => {
          acc[obKeys[i]] = cur
          return acc
        },
        { owner }
      )
      setPresaleInfo({ ...preInfo })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

  const checkPhase = useCallback((presale: PresaleInfo | undefined) => {
    if (presale) {
      if (presale.isPresaleCancelled) {
        return PresalePhases.PresaleCancelled
      }
      if (presale.isClaimPhase) {
        return PresalePhases.ClaimPhase
      }
      if (presale.startPresaleTime.mul(1000).lt(BigNumber.from(Date.now()))) {
        if (presale.endPresaleTime.mul(1000).gt(BigNumber.from(Date.now()))) {
          return PresalePhases.PresalePhase
        }
        return PresalePhases.PresaleEnded
      }
      return PresalePhases.PresaleNotStarted
    }
    return ''
  }, [])

  const formatUnits = useCallback((amount: BigNumber | undefined, decimals: number) => {
    return amount ? ethers.utils.formatUnits(amount, decimals) : ''
  }, [])

  const formatedDate = () => {
    return formatDuration(
      {
        days,
        hours,
        minutes,
        seconds,
      },
      { delimiter: ': ' }
    ).replace(/ days| day| hours| hour| minutes| minute| seconds| second/gi, (x: string) => {
      switch (x) {
        case ' days' || ' day':
          return 'D '
        case ' hours' || ' hour':
          return 'H '
        case ' minutes' || ' minute':
          return 'M '
        case ' seconds' || ' second':
          return 'S '
        default:
          return ''
      }
    })
  }

  useEffect(() => {
    const presalePhase = checkPhase(presaleInfo)
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
  }, [presaleInfo, currentTime, checkPhase])

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
        1 BNB = {formatUnits(presaleInfo?.presaleRate, 18)} {token?.symbol}
      </Text>
      <Text marginTop="20px">Progress ({presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toString()}%)</Text>
      <ProgressBox paddingY="5px" isProgressBnb>
        <Progress primaryStep={presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toNumber()} />
      </ProgressBox>
      <RowBetween>
        <Text>{`${formatUnits(presaleInfo?.totalBought, 18)} BNB`}</Text>
        <Text>{`${formatUnits(presaleInfo?.hardcap, 18)} BNB`}</Text>
      </RowBetween>
      <RowBetween marginTop="15px">
        <Text fontWeight={700} fontSize="17px">
          Presale Status:
        </Text>
        <StyledTextCard textTransform="capitalize">{checkPhase(presaleInfo).toLowerCase()}</StyledTextCard>
      </RowBetween>
      <RowBetween marginTop="10px">
        <Text fontWeight={700} fontSize="17px">
          Liquidity%:
        </Text>
        <StyledTextCard>{Number(formatUnits(presaleInfo?.liquidity, FEE_DECIMALS - 2)).toFixed(0)}%</StyledTextCard>
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
        {(checkPhase(presaleInfo) === PresalePhases.PresaleNotStarted ||
          checkPhase(presaleInfo) === PresalePhases.PresalePhase) && (
          <Box>
            <Text fontWeight={700} fontSize="17px">
              Sale {checkPhase(presaleInfo) === PresalePhases.PresaleNotStarted ? 'Starts' : 'Ends'} in:{' '}
            </Text>
            <Text fontSize="15px">{formatedDate()}</Text>
          </Box>
        )}
        <Box>
          <Text fontWeight={700} fontSize="17px">
            Soft / Hard :{' '}
          </Text>
          <Text fontSize="15px">{`${formatUnits(presaleInfo?.softcap, 18)} BNB - ${formatUnits(
            presaleInfo?.hardcap,
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
