import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { formatUnits } from 'ethers/lib/utils'
import { TelegramIcon, TwitterIcon, DiscordIcon, EmailIcon, Box, Button, Flex } from '@koda-finance/summitswap-uikit'
import { useTokenContract, usePresaleContract, useFactoryPresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import CopyButton from 'components/CopyButton'
import { RowFixed } from 'components/Row'
import { fetchPresaleInfo, fetchFeeInfo, fetchProjectDetails } from 'utils/presale'
import { TOKEN_CHOICES, PRESALE_FACTORY_ADDRESS } from 'constants/presale'
import { PresaleInfo, ProjectDetails, FeeInfo } from '../types'
import { StyledText, Divider } from './Shared'
import PresaleTags from '../PresaleTags'
import TokenDetails from './TokenDetails'
import PresaleDetails from './PresaleDetails'
import GoalSystem from './GoalSystem'
import RouterDetails from './RouterDetails'
import ContributionBox from './ContributionBox'
import BuyTokens from './BuyTokens'

interface Props {
  presaleAddress: string
}

const GridContainer = styled(Box)`
  display: grid;
  grid-column-gap: 16px;
  grid-template-columns: 80px auto;
  grid-template-areas: 'icon tag' 'icon info';
  justify-content: start;
  align-items: start;
  @media (max-width: 500px) {
    grid-template-columns: auto;
    grid-template-areas: 'tag' 'icon' 'info';
    grid-column-gap: 0;
  }
`
const StyledImage = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 50%;
  grid-area: icon;
  @media (max-width: 500px) {
    height: 60px;
    width: 60px;
  }
`

const TagWrapper = styled(Box)`
  grid-area: tag;
`

const InfoWrapper = styled(Box)`
  grid-area: info;
`

const Link = styled.a`
  background: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 90px;
  margin-right: 8px;
`

const Presale = ({ presaleAddress }: Props) => {
  const { account, library } = useWeb3React()

  const [isLoading, setIsLoading] = useState(false)
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>()
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>()
  const [currency, setCurrency] = useState('BNB')

  const presaleToken = useToken(presaleInfo?.presaleToken)
  const tokenContract = useTokenContract(presaleInfo?.presaleToken, true)
  const presaleContract = usePresaleContract(presaleAddress)
  const factoryContract = useFactoryPresaleContract(PRESALE_FACTORY_ADDRESS)

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract)
      const feeInfo = await fetchFeeInfo(presaleContract)
      const projDetails = await fetchProjectDetails(presaleContract)
      setPresaleInfo({ ...preInfo })
      setPresaleFeeInfo({ ...feeInfo })
      setProjectDetails({ ...projDetails })
    }
    if (presaleContract && account) {
      fetchData()
    }
  }, [presaleContract, account])

  useEffect(() => {
    async function fetchTotalSupply() {
      setTokenTotalSupply(
        Number(formatUnits(await tokenContract?.totalSupply(), presaleToken?.decimals)).toLocaleString()
      )
    }
    if (presaleToken && tokenContract) {
      fetchTotalSupply()
    }
  }, [tokenContract, presaleToken])

  useEffect(() => {
    const currentCurrency = Object.keys(TOKEN_CHOICES).find(
      (key) => TOKEN_CHOICES[key] === presaleFeeInfo?.paymentToken
    )
    setCurrency(currentCurrency as string)
  }, [presaleFeeInfo])

  return (
    <Flex flexWrap="wrap" justifyContent="space-between">
      <Box width="570px">
        <GridContainer>
          <StyledImage src={projectDetails?.logoUrl || ''} />
          <TagWrapper>
            <PresaleTags presaleInfo={presaleInfo} />
          </TagWrapper>
          <InfoWrapper>
            <StyledText marginTop="8px" fontSize="14px" color="textSubtle">
              {presaleToken?.name}
            </StyledText>
            <StyledText lineHeight={1} bold fontSize="24px">
              {projectDetails?.projectName}
            </StyledText>
            <Flex marginTop="4px" alignItems="center" marginBottom="16px">
              <StyledText marginRight="5px" fontSize="14px" color="primaryDark">
                {presaleAddress}
              </StyledText>
              <Box style={{ position: 'relative' }}>
                <CopyButton
                  color="linkColor"
                  text={presaleAddress}
                  tooltipMessage="Copied"
                  tooltipTop={-40}
                  tooltipRight={-30}
                  width="15px"
                />
              </Box>
            </Flex>
            <Button variant="secondary" scale="sm" disabled>
              Finalize Presale
            </Button>
            <RowFixed marginTop="16px" marginBottom="32px">
              {projectDetails?.telegramId && (
                <Link href={projectDetails.telegramId} rel="noopener noreferrer" target="_blank">
                  <TelegramIcon color="currentColor" />
                </Link>
              )}
              {projectDetails?.twitterId && (
                <Link href={projectDetails.twitterId} rel="noopener noreferrer" target="_blank">
                  <TwitterIcon color="currentColor" />
                </Link>
              )}
              {projectDetails?.discordId && (
                <Link href={projectDetails.discordId} rel="noopener noreferrer" target="_blank">
                  <DiscordIcon color="currentColor" />
                </Link>
              )}
              {projectDetails?.email && (
                <Link href={`mailTo:${projectDetails.email}`} rel="noopener noreferrer" target="_blank">
                  <EmailIcon color="currentColor" />
                </Link>
              )}
            </RowFixed>
          </InfoWrapper>
        </GridContainer>
        <Divider infoDivider />
        <StyledText marginBottom="16px" marginTop="24px" fontSize="20px" bold>
          Presale System
        </StyledText>
        <TokenDetails presaleAddress={presaleAddress} />
        <Box marginTop="24px" />
        <PresaleDetails presaleAddress={presaleAddress} />
        <Box marginTop="24px" />
        <GoalSystem presaleInfo={presaleInfo} currency={currency} />
        <Box marginTop="24px" />
        <RouterDetails presaleInfo={presaleInfo} />
      </Box>
      <Box width="330px">
        <ContributionBox
          currency={currency}
          presaleAddress={presaleAddress}
          tokenSymbol={presaleToken?.symbol}
          presaleRate={presaleInfo?.presaleRate}
        />
        <BuyTokens presaleAddress={presaleAddress} />
      </Box>
    </Flex>
  )
}

export default Presale
