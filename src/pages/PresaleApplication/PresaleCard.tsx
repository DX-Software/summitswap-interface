import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { differenceInDays, formatDuration, intervalToDuration } from 'date-fns'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Box, Button, Flex, Progress, Text, darkColors } from '@koda-finance/summitswap-uikit'
import { usePresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { RowBetween } from 'components/Row'
import { fetchPresaleInfo, fetchFeeInfo, fetchProjectDetails, checkSalePhase } from 'utils/presale'
import { FEE_DECIMALS, TOKEN_CHOICES } from 'constants/presale'
import { NULL_ADDRESS } from 'constants/index'
import { PresaleInfo, ProjectDetails, FeeInfo, PresalePhases } from './types'
import ProgressWrapper from './ProgressWrapper'
import PresaleTags from './PresaleTags'

interface Props {
  presaleAddress: string
  viewPresaleHandler: (address: string) => void
}

const StyledCard = styled(Box)`
  box-sizing: border-box;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.background} 51.44%, ${darkColors.input} 100%);
  border: 1px solid ${darkColors.textDisabled};
  border-radius: 8px;
  min-width: 306px;
  padding: 16px;
  margin-bottom: 16px;

  @media (max-width: 330px) {
    width: 100%;
    min-width: 250px;
  }
`

const StyledImage = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  @media (max-width: 480px) {
    height: 36px;
    width: 36px;
  }
`
const StyledText = styled(Text)`
  font-size: ${({ fontSize }) => fontSize || '16px'};
  @media (max-width: 480px) {
    font-size: ${({ fontSize }) => `calc(${fontSize} - 2px)` || '14px'};
  }
`

const PresalePhaseTitle = ({ presaleInfo }: { presaleInfo: PresaleInfo | undefined }) => {
  const [days, setDays] = useState<number>()
  const [hours, setHours] = useState<number>()
  const [seconds, setSeconds] = useState<number>()
  const [minutes, setMinutes] = useState<number>()
  const [currentTime, setCurrentTime] = useState(new Date())

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

  const formatedDate = () => {
    return formatDuration(
      {
        days,
        hours,
        minutes,
        seconds,
      },
      { delimiter: ':' }
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

  switch (checkSalePhase(presaleInfo)) {
    case PresalePhases.PresalePhase:
      return (
        <RowBetween>
          <StyledText fontSize="14px" color="sidebarColor">
            Presale Ends in
          </StyledText>
          <StyledText fontSize="14px" bold color="failure">
            {formatedDate()}
          </StyledText>
        </RowBetween>
      )
    case PresalePhases.PresaleNotStarted:
      return (
        <RowBetween>
          <StyledText fontSize="14px" color="textSubtle">
            Presale Starts in
          </StyledText>
          <StyledText fontSize="14px" bold color="textSubtle">
            {formatedDate()}
          </StyledText>
        </RowBetween>
      )
    case PresalePhases.PresaleEnded:
      return (
        <StyledText fontSize="14px" color="textSubtle">
          This presale has ended
        </StyledText>
      )
    case PresalePhases.PresaleCancelled:
      return (
        <StyledText fontSize="14px" color="textSubtle">
          This presale has been cancelled
        </StyledText>
      )
    case PresalePhases.ClaimPhase:
      return (
        <StyledText fontSize="14px" color="success">
          Presale has been finalized
        </StyledText>
      )
    default:
      return <></>
  }
}

const PresaleCard = ({ presaleAddress, viewPresaleHandler }: Props) => {
  const { account } = useWeb3React()

  const [currency, setCurrency] = useState('BNB')
  const [isAccountWhitelisted, setIsAccountWhitelisted] = useState(false)
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [claimableTokens, setClaimableTokens] = useState<BigNumber>()
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>()

  const presaleContract = usePresaleContract(presaleAddress)
  const presaleToken = useToken(presaleInfo?.presaleToken)
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken !== NULL_ADDRESS ? presaleFeeInfo?.paymentToken : undefined
  )

  useEffect(() => {
    async function checkIfAccountWhitelisted() {
      setIsAccountWhitelisted((await presaleContract?.getWhitelist()).includes(account))
    }
    if (account && presaleContract) checkIfAccountWhitelisted()
  }, [account, presaleContract])

  useEffect(() => {
    async function fetchClaimableTokens() {
      setClaimableTokens(await presaleContract?.getAvailableTokenToClaim(account))
    }
    if (account && presaleContract) fetchClaimableTokens()
  }, [account, presaleContract])

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract)
      const feeInfo = await fetchFeeInfo(presaleContract)
      const projDetails = await fetchProjectDetails(presaleContract)
      setPresaleInfo({ ...preInfo })
      setPresaleFeeInfo({ ...feeInfo })
      setProjectDetails({ ...projDetails })
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

  return (
    <StyledCard marginX="4px">
      <PresaleTags isAccountWhitelisted={isAccountWhitelisted} presaleInfo={presaleInfo} />
      <StyledText fontSize="12px" marginTop="8px" color="textSubtle">
        {presaleToken?.name || ''}
      </StyledText>
      <StyledText bold fontSize="18px">
        {projectDetails?.projectName}
      </StyledText>
      <Flex marginTop="8px">
        {projectDetails ? <StyledImage src={projectDetails.logoUrl} /> : <Box height="48px" />}
        <Flex marginLeft="8px" flexDirection="column" justifyContent="space-between">
          <StyledText bold color="textSubtle">
            {presaleToken?.symbol}
          </StyledText>
          <StyledText fontSize="14px">{`1 ${currency} = ${formatUnits(presaleInfo?.presaleRate || 0)} ${
            presaleToken?.symbol || ''
          }`}</StyledText>
        </Flex>
      </Flex>
      <Flex marginTop="12px" flexDirection="column" justifyContent="center" alignItems="center">
        <StyledText fontSize="12px" color="textSubtle">
          Soft / Hard
        </StyledText>
        <StyledText bold fontSize="20px">
          {`${formatUnits(presaleInfo?.softcap || 0, paymentToken?.decimals)} ${currency} - ${formatUnits(
            presaleInfo?.hardcap || 0,
            paymentToken?.decimals
          )} ${currency}`}
        </StyledText>
      </Flex>
      <Box marginTop="8px">
        <RowBetween>
          <StyledText fontSize="12px" color="textSubtle">
            {`${formatUnits(presaleInfo?.softcap || 0, paymentToken?.decimals)} ${currency}`}
          </StyledText>
          <StyledText fontSize="12px" color="textSubtle">
            {`${formatUnits(presaleInfo?.hardcap || 0, paymentToken?.decimals)} ${currency}`}
          </StyledText>
        </RowBetween>
        <ProgressWrapper>
          <Progress
            primaryStep={
              presaleInfo && new Date() > new Date(presaleInfo.startPresaleTime.mul(1000).toNumber()) ? 100 : 0
            }
            secondaryStep={presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toNumber()}
          />
        </ProgressWrapper>
        <StyledText fontSize="12px" color="textSubtle">
          {!presaleInfo?.isApproved || new Date() < new Date(presaleInfo.startPresaleTime.mul(1000).toNumber()) ? (
            <StyledText fontSize="12px" color="textSubtle">
              Presale hasn’t started yet
            </StyledText>
          ) : (
            <StyledText fontSize="12px" color="textSubtle">
              <StyledText style={{ display: 'inline-block' }} fontSize="12px" bold color="linkColor">
                {`${presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toNumber()}%`}
              </StyledText>
              &nbsp;reached ({`${formatUnits(presaleInfo?.totalBought || 0, paymentToken?.decimals)} ${currency}`})
            </StyledText>
          )}
        </StyledText>
      </Box>
      <Box marginTop="16px">
        <RowBetween>
          <StyledText fontSize="14px">Liquidity</StyledText>
          <StyledText fontSize="14px">{`${presaleInfo?.liquidity.mul(100).div(10 ** FEE_DECIMALS)}%`}</StyledText>
        </RowBetween>
        <RowBetween>
          <StyledText fontSize="14px">Lockup Time</StyledText>
          <StyledText fontSize="14px">{presaleInfo?.liquidyLockTimeInMins.div(60).toString()}</StyledText>
        </RowBetween>
        <StyledText fontSize="10px" style={{ height: '16px' }} marginTop="2px" marginBottom="8px" color="warning">
          {presaleInfo?.isClaimPhase && claimableTokens?.gt(0) ? 'You haven’t claimed your token yet' : ''}
        </StyledText>
      </Box>
      <Button
        onClick={() => viewPresaleHandler(presaleAddress)}
        width="100%"
        variant={presaleInfo?.isApproved ? 'secondary' : 'tertiary'}
      >
        View Presale
      </Button>
      <Box marginTop="8px">
        <PresalePhaseTitle presaleInfo={presaleInfo} />
      </Box>
    </StyledCard>
  )
}

export default PresaleCard
