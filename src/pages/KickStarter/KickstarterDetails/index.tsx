import {
  ArrowBackIcon,
  Breadcrumbs,
  Button,
  FacebookIcon,
  FileIcon,
  Flex,
  NavTab,
  Progress,
  ShareIcon,
  Skeleton,
  Text,
  TwitterIcon,
} from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useBackedKickstarterById, useKickstarterById, useKickstarterContributors } from 'api/useKickstarterApi'
import Tooltip from 'components/Tooltip'
import { getTokenImageBySymbol } from 'connectors'
import { format } from 'date-fns'
import ImgCornerIllustration from 'img/corner-illustration.svg'
import React, { useEffect, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { BackedKickstarter, Kickstarter, KickstarterContributor, KickstarterProgressStatus } from 'types/kickstarter'
import copyText from 'utils/copyText'
import { getKickstarterStatus, getKickstarterStatusLabel } from 'utils/kickstarter'
import { Divider, ImgCurrency } from '../shared'
import ProgressBox from '../shared/ProgressBox'
import StatusLabel from '../shared/StatusLabel'
import ProjectPayment from './ProjectPayment'

type Tab = {
  label: string
  code: TabCode
}

enum TabCode {
  PROJECT_DETAILS = 'project_details',
  REWARDS = 'rewards',
  DONATORS = 'donators',
}

type KickstarterDetailsProps = {
  previousPage: string
  kickstarterId: string
  handleKickstarterId: (kickstarterId: string) => void
}

type HeaderProps = {
  previousPage: string
  handleKickstarterId: (kickstarterId: string) => void
}

type HighlightProps = {
  kickstarter?: Kickstarter
  backedKickstarter?: BackedKickstarter
  isLoading?: boolean
  handleIsPayment: (value: boolean) => void
}

type ProjectDetailsProps = {
  kickstarter?: Kickstarter
  isLoading?: boolean
}

type RewardsProps = {
  kickstarter?: Kickstarter
  backedKickstarter?: BackedKickstarter
  isLoading?: boolean
}

type DonatorsProps = {
  kickstarterContributors: KickstarterContributor[]
}

type DonatorCardProps = {
  kickstarterContributor: KickstarterContributor
  isFirstItem: boolean
  isLastItem: boolean
}

const Link = styled.a`
  color: ${({ theme }) => theme.colors.linkColor};
  text-decoration: underline;
`

const WhiteDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: white;
`

const ImgKickstarterDesktop = styled(Flex)<{ image: string }>`
  width: 240px;
  height: 230px;
  border-radius: 8px;
  flex-shrink: 0;

  background: ${(props) => `url(${props.image}) gray`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;

  @media (max-width: 768px) {
    display: none;
  }
`

const ImgKickstarterMobile = styled(Flex)<{ image: string }>`
  width: 100%;
  height: 230px;
  border-radius: 8px;
  flex-shrink: 0;
  display: none;

  background: ${(props) => `url(${props.image}) gray`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;

  @media (max-width: 768px) {
    display: block;
  }
`

const BackedAmountWrapper = styled(Flex)`
  position: relative;
  padding: 12px 0;
  padding-left: 54px;
  padding-right: 16px;
  background-color: ${({ theme }) => theme.colors.info};
  border-radius: 8px;
  overflow: hidden;
`

const ImgIllustration = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
`

const SocialMedia = styled.a`
  display: flex;
  height: fit-content;
  padding: 12px 18px;
  background-color: white;
  border-radius: 20px;
`

const HighlightContainer = styled(Flex)`
  column-gap: 32px;
  row-gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const DonatorWrapper = styled(Flex)`
  row-gap: 4px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Header = ({ previousPage, handleKickstarterId }: HeaderProps) => {
  const backToMyProject = () => handleKickstarterId('')

  return (
    <>
      <Breadcrumbs>
        <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={backToMyProject}>
          {previousPage}
        </Text>
        <Text color="borderColor" style={{ fontWeight: 700 }}>
          Project Details
        </Text>
      </Breadcrumbs>
      <Divider />
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={backToMyProject}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: 'underline' }}>
          back to {previousPage}
        </Text>
      </Flex>
    </>
  )
}

const Highlight = ({ kickstarter, backedKickstarter, handleIsPayment, isLoading = true }: HighlightProps) => {
  const progressStatus = getKickstarterStatus(kickstarter?.endTimestamp?.toNumber() || 0)

  const fundedPercentage = useMemo(() => {
    if (
      !kickstarter ||
      !kickstarter.totalContribution ||
      !kickstarter.projectGoals ||
      kickstarter.totalContribution.eq(0) ||
      kickstarter.projectGoals.eq(0)
    ) {
      return 0
    }
    return kickstarter?.totalContribution?.div(kickstarter.projectGoals).times(100).toNumber()
  }, [kickstarter])

  const currentPageLink = window.location.href

  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  const displayTooltip = () => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }

  return (
    <HighlightContainer>
      {isLoading ? (
        <Skeleton width={240} height={230} />
      ) : (
        <ImgKickstarterDesktop image={kickstarter?.imageUrl || ''} />
      )}
      <Flex flexDirection="column">
        {isLoading ? (
          <Flex style={{ columnGap: '8px' }} marginBottom="8px">
            <Skeleton height={26} width={74} />
            <Skeleton height={26} width={74} />
            <Skeleton height={26} width={74} />
          </Flex>
        ) : (
          <Flex style={{ columnGap: '8px' }} marginBottom="8px">
            {backedKickstarter && (
              <StatusLabel>
                <b>BACKED</b>
              </StatusLabel>
            )}
            <StatusLabel status={progressStatus}>
              {getKickstarterStatusLabel(kickstarter?.endTimestamp?.toNumber() || 0)}
            </StatusLabel>
          </Flex>
        )}
        {isLoading ? (
          <Skeleton height={36} width={300} marginBottom="24px" />
        ) : (
          <Text fontSize="40px" marginBottom="24px">
            {kickstarter?.title}
          </Text>
        )}
        {kickstarter && <ImgKickstarterMobile image={kickstarter.imageUrl || ''} marginBottom="24px" />}
        <Flex style={{ columnGap: '8px', alignItems: 'center', marginBottom: '4px' }}>
          {isLoading ? (
            <Skeleton height={28} width={28} />
          ) : (
            <ImgCurrency image={getTokenImageBySymbol(kickstarter?.tokenSymbol)} />
          )}
          {isLoading ? (
            <Skeleton height={28} width={42} />
          ) : (
            <Text fontWeight="bold" fontSize="24px">
              {kickstarter?.totalContribution?.toString()}
            </Text>
          )}
        </Flex>
        {isLoading ? (
          <Skeleton height={24} width={240} marginBottom="16px" />
        ) : (
          <Text color="textSubtle" marginBottom="16px">
            backed of {kickstarter?.projectGoals?.toString() || 0} {kickstarter?.tokenSymbol} goal
          </Text>
        )}
        {!isLoading && (
          <ProgressBox maxWidth="400px" marginBottom="8px">
            <Progress primaryStep={fundedPercentage} />
          </ProgressBox>
        )}
        <Flex style={{ columnGap: '8px' }} alignItems="center" marginBottom="16px">
          {isLoading ? (
            <Skeleton width={200} />
          ) : (
            <>
              {progressStatus !== KickstarterProgressStatus.COMPLETED && (
                <>
                  <Text fontWeight="bold">
                    {getKickstarterStatusLabel(kickstarter?.endTimestamp?.toNumber() || 0, true)}
                  </Text>
                  <WhiteDot />
                </>
              )}
              <Text>{kickstarter?.totalContributor?.toString() || '0'} backers</Text>
            </>
          )}
        </Flex>
        {backedKickstarter && (
          <BackedAmountWrapper flexDirection="column" marginBottom="16px">
            <ImgIllustration src={ImgCornerIllustration} />
            <Text fontWeight="bold" marginBottom="4px">
              You have backed this project
            </Text>
            <Text>
              Backed amount&nbsp;&nbsp;&nbsp;&nbsp;{backedKickstarter.amount?.toString()} {kickstarter?.tokenSymbol}
            </Text>
          </BackedAmountWrapper>
        )}

        <Flex style={{ columnGap: '8px' }} alignItems="center">
          {isLoading && <Skeleton width={162} height={38} />}
          {!isLoading && progressStatus !== KickstarterProgressStatus.COMPLETED && (
            <Button onClick={() => handleIsPayment(true)}>Back this project</Button>
          )}
          {isLoading ? (
            <Skeleton width={50} height={38} />
          ) : (
            <Tooltip placement="top" text="Copied" show={isTooltipDisplayed}>
              <SocialMedia
                type="button"
                style={{ cursor: 'pointer' }}
                onClick={() => copyText(currentPageLink, displayTooltip)}
              >
                <ShareIcon width="14px" />
              </SocialMedia>
            </Tooltip>
          )}
          {isLoading ? (
            <Skeleton width={50} height={38} />
          ) : (
            <SocialMedia
              style={{ cursor: 'pointer' }}
              href={`https://twitter.com/intent/tweet?text=Let's ontribute to "${kickstarter?.title}" Kickstarter ${currentPageLink}`}
              target="_blank"
            >
              <TwitterIcon width="14px" />
            </SocialMedia>
          )}
          {isLoading ? (
            <Skeleton width={50} height={38} />
          ) : (
            <SocialMedia
              style={{ cursor: 'pointer' }}
              href={`https://www.facebook.com/sharer/sharer.php?u=${currentPageLink}`}
              target="_blank"
            >
              <FacebookIcon width="14px" />
            </SocialMedia>
          )}
        </Flex>
      </Flex>
    </HighlightContainer>
  )
}

const ProjectDetails = ({ kickstarter, isLoading }: ProjectDetailsProps) => {
  return (
    <>
      <Text color="textSubtle" marginBottom="4px">
        Project Description
      </Text>
      {isLoading ? (
        <>
          <Skeleton marginBottom={2} />
          <Skeleton marginBottom={2} />
          <Skeleton />
        </>
      ) : (
        <Text>{kickstarter?.projectDescription}</Text>
      )}
      <br />
      <Grid container spacing="16px">
        <Grid item xs={12} sm={6}>
          <Flex flexDirection="column" marginRight="auto">
            <Text color="textSubtle" marginBottom="4px">
              Project Created
            </Text>
            {isLoading ? (
              <Skeleton width={150} />
            ) : (
              <Text>{format(new Date((kickstarter?.createdAt?.toNumber() || 0) * 1000), 'LLLL do, yyyy')}</Text>
            )}
          </Flex>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Flex flexDirection="column" marginRight="auto">
            <Text color="textSubtle" marginBottom="4px">
              Project Due Date
            </Text>
            {isLoading ? (
              <Skeleton width={150} />
            ) : (
              <Text>{format(new Date((kickstarter?.endTimestamp?.toNumber() || 0) * 1000), 'LLLL do, yyyy')}</Text>
            )}
          </Flex>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing="16px">
        <Grid item xs={12} sm={6}>
          <Flex flexDirection="column" marginRight="auto">
            <Text color="textSubtle" marginBottom="4px">
              Minimum Balance Participation
            </Text>
            {isLoading ? (
              <Skeleton width={150} />
            ) : (
              <Flex style={{ columnGap: '8px' }}>
                <ImgCurrency image={getTokenImageBySymbol(kickstarter?.tokenSymbol)} />
                {isLoading ? (
                  <Skeleton height={28} width={30} marginBottom="24px" />
                ) : (
                  <Text>{kickstarter?.minContribution?.toString()}</Text>
                )}
              </Flex>
            )}
          </Flex>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Flex flexDirection="column" marginRight="auto">
            <Text color="textSubtle" marginBottom="4px">
              Project Creator
            </Text>
            {isLoading ? <Skeleton width={150} /> : <Text>{kickstarter?.creator}</Text>}
          </Flex>
        </Grid>
      </Grid>
    </>
  )
}

const Rewards = ({ kickstarter, backedKickstarter, isLoading }: RewardsProps) => {
  return (
    <>
      <Text color="textSubtle" marginBottom="4px">
        Reward Description
      </Text>
      {isLoading ? (
        <>
          <Skeleton marginBottom={2} />
          <Skeleton marginBottom={2} />
          <Skeleton />
        </>
      ) : (
        <Text>{kickstarter?.rewardDescription}</Text>
      )}
      <br />
      <Text color="textSubtle" marginBottom="4px">
        Reward Distribution
      </Text>
      {isLoading ? (
        <Skeleton width={150} />
      ) : (
        <Text>
          {format(new Date((kickstarter?.rewardDistributionTimestamp?.toNumber() || 0) * 1000), 'LLLL do, yyyy')}
        </Text>
      )}
      <br />
      {backedKickstarter && (
        <>
          <Text color="warning" fontWeight="bold" marginBottom="4px">
            Have you received the reward for this project?
          </Text>
          <Text fontSize="12px">
            If you haven&apos;t received any reward after the due date, you may{' '}
            <Link href="/">contact our support</Link>
          </Text>
        </>
      )}
    </>
  )
}

const DonatorCard = ({ isFirstItem, isLastItem, kickstarterContributor }: DonatorCardProps) => {
  return (
    <DonatorWrapper
      justifyContent="space-between"
      paddingTop={isFirstItem ? 0 : '16px'}
      paddingBottom={isLastItem ? 0 : '12px'}
      borderBottom={`${isLastItem ? 0 : 1}px solid`}
      borderBottomColor="inputColor"
    >
      <Flex flexDirection="column">
        <Text fontSize="14px" color="textSubtle">
          {kickstarterContributor.walletAddress}
        </Text>
      </Flex>
      <Flex alignItems="center" style={{ columnGap: '8px' }}>
        <ImgCurrency image={getTokenImageBySymbol(kickstarterContributor.currencySymbol)} />
        <Text fontSize="24px" fontWeight="bold">
          {kickstarterContributor.contributionAmount}
        </Text>
      </Flex>
    </DonatorWrapper>
  )
}

const Donators = ({ kickstarterContributors }: DonatorsProps) => {
  return (
    <>
      {!kickstarterContributors ||
        (kickstarterContributors.length === 0 && (
          <Text color="textDisabled" marginTop="16px">
            There are no backer for this project. Share your project to everyone now.
          </Text>
        ))}
      {kickstarterContributors &&
        kickstarterContributors.map((contributor, index) => (
          <DonatorCard
            key={contributor._id}
            kickstarterContributor={contributor}
            isFirstItem={index === 0}
            isLastItem={index === kickstarterContributors.length - 1}
          />
        ))}
    </>
  )
}

function KickstarterDetails({ previousPage, kickstarterId, handleKickstarterId }: KickstarterDetailsProps) {
  const { account } = useWeb3React()
  const history = useHistory()
  const kickstarter = useKickstarterById(kickstarterId)
  const kickstarterContributors = useKickstarterContributors(kickstarterId)
  const backedKickstarter = useBackedKickstarterById(`${kickstarterId.toString()}-${account?.toString()}`)

  const [isPayment, setIsPayment] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const generalTabs: Tab[] = useMemo(
    () => [
      {
        code: TabCode.PROJECT_DETAILS,
        label: 'Project Details',
      },
      {
        code: TabCode.REWARDS,
        label: 'Rewards',
      },
    ],
    []
  )

  const tabs: Tab[] = useMemo(
    () =>
      account?.toLowerCase() === kickstarter?.data?.owner?.id
        ? [
            ...generalTabs,
            {
              code: TabCode.DONATORS,
              label: 'Donators',
            },
          ]
        : generalTabs,
    [account, generalTabs, kickstarter?.data]
  )

  const selectedTab = useMemo(() => tabs[activeTabIndex], [tabs, activeTabIndex])

  const csvHeaders = [
    { label: 'Number', key: 'number' },
    { label: 'Wallet', key: 'wallet' },
    { label: 'Email', key: 'email' },
    { label: 'Currency Address', key: 'currencyAddress' },
    { label: 'Currency Symbol', key: 'currencySymbol' },
    { label: 'Amount', key: 'contributionAmount' },
    { label: 'Created At', key: 'createdAt' },
  ]

  const csvData = !kickstarterContributors.data
    ? []
    : kickstarterContributors.data.map((data, index) => ({
        number: index + 1,
        wallet: data.walletAddress,
        email: data.email,
        currencyAddress: data.currencyAddress,
        currencySymbol: data.currencySymbol,
        amount: data.contributionAmount,
        createdAt: format(new Date(data.createdAt || 0), 'yyyy-MM-dd HH:mm:ss'),
      }))

  useEffect(() => {
    if (kickstarter.isFetched && !kickstarter.data) {
      handleKickstarterId('')
    }
  }, [kickstarter, handleKickstarterId])

  useEffect(() => {
    if (kickstarter.data) {
      history.replace({
        search: `?kickstarter=${kickstarter.data.id}`,
      })
    }
    return () => {
      history.replace({
        search: '',
      })
    }
  }, [history, kickstarter])

  if (isPayment && kickstarter.data) {
    return (
      <ProjectPayment
        previousPage={previousPage}
        backedKickstarter={backedKickstarter}
        handleKickstarterId={handleKickstarterId}
        handleIsPayment={setIsPayment}
        kickstarterQueryResult={kickstarter}
      />
    )
  }

  return (
    <Flex flexDirection="column">
      <Header previousPage={previousPage} handleKickstarterId={handleKickstarterId} />
      <Highlight
        kickstarter={kickstarter.data}
        backedKickstarter={backedKickstarter.data}
        isLoading={kickstarter.isFetching || backedKickstarter.isFetching}
        handleIsPayment={setIsPayment}
      />
      <NavTab mb="32px" activeIndex={activeTabIndex} onItemClick={setActiveTabIndex}>
        {tabs.map((navItem) => (
          <Text key={navItem.code}>{navItem.label}</Text>
        ))}
      </NavTab>
      <Divider style={{ margin: '0px' }} />
      <Flex
        flexDirection="column"
        paddingRight="16px"
        style={{
          height: selectedTab.code === TabCode.DONATORS ? '350px' : 'auto',
          overflowY: selectedTab.code === TabCode.DONATORS ? 'scroll' : 'auto',
        }}
        borderBottom="1px solid"
        borderBottomColor="inputColor"
        paddingY="24px"
        marginBottom="24px"
      >
        {selectedTab.code === TabCode.PROJECT_DETAILS && (
          <ProjectDetails kickstarter={kickstarter.data} isLoading={kickstarter.isFetching} />
        )}
        {selectedTab.code === TabCode.REWARDS && (
          <Rewards
            kickstarter={kickstarter.data}
            backedKickstarter={backedKickstarter.data}
            isLoading={kickstarter.isFetching || backedKickstarter.isFetching}
          />
        )}
        {selectedTab.code === TabCode.DONATORS && (
          <Donators kickstarterContributors={kickstarterContributors.data || []} />
        )}
      </Flex>

      {account && kickstarter?.data && account.toLowerCase() === kickstarter.data.owner?.id && (
        <Button
          variant="primary"
          marginRight="auto"
          startIcon={<FileIcon color="text" />}
          as={CSVLink}
          data={csvData}
          headers={csvHeaders}
          filename={`kickstarter-${kickstarter.data.id}.csv`}
        >
          Download Donator List
        </Button>
      )}
    </Flex>
  )
}

export default React.memo(KickstarterDetails)
