import {
  ArrowBackIcon,
  Breadcrumbs,
  Button,
  FileIcon,
  Flex,
  NavTab,
  Skeleton,
  Text,
} from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useBackedKickstarterById, useKickstarterById, useKickstarterContributors } from 'api/useKickstarterApi'
import { getTokenImageBySymbol } from 'connectors'
import { format } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { BackedKickstarter, Kickstarter, KickstarterContributor } from 'types/kickstarter'
import { formatNumber } from 'utils/formatInfoNumbers'
import { Divider, ImgCurrency } from '../shared'
import ProjectPayment from './ProjectPayment'
import Highlight from './Highlight'

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
                  <Text>{formatNumber(kickstarter?.minContribution?.toString())}</Text>
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
        contributionAmount: data.contributionAmount,
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
