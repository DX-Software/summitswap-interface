import { ArrowBackIcon, BinanceIcon, Breadcrumbs, Button, FacebookIcon, FileIcon, Flex, Progress, ShareIcon, Skeleton, Tag, Text, TwitterIcon } from "@koda-finance/summitswap-uikit"
import { Grid, TabScrollButton } from "@mui/material"
import Tooltip from "components/Tooltip"
import { useKickstarterContext } from "contexts/kickstarter"
import { format } from "date-fns"
import useKickstarter from "hooks/useKickstarter"
import ImgCornerIllustration from "img/corner-illustration.svg"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import copyText from "utils/copyText"
import DonatorCard from "./DonatorCard"
import ProgressBox from "./ProgressBox"
import ProjectPayment from "./ProjectPayment"
import { Donator } from "./types"
import { getDayRemaining } from "./utility"

enum TabCode {
  PROJECT_DETAILS = "PROJECT_DETAILS",
  REWARDS = "REWARDS",
  DONATORS = "DONATORS",
}

type Props = {
  projectAddress: string
  onBack: () => void
}

type Tab = {
  label: string
  code: TabCode
}

const ImageAndDescriptionWrapper = styled(Flex)`
  column-gap: 32px;
  row-gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const DesktopBanner = styled(Flex)`
  width: 240px;
  height: 230px;
  border-radius: 8px;
  background-color: gray;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`

const MobileBanner = styled(Flex)`
  width: 100%;
  height: 230px;
  border-radius: 8px;
  background-color: gray;
  flex-shrink: 0;
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`

const Label = styled(Tag)`
  text-transform: uppercase;
`

const Link = styled.a`
  color: ${({ theme }) => theme.colors.linkColor};
  text-decoration: underline;
`

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: white;
`

const SocialMedia = styled.a`
  display: flex;
  height: fit-content;
  padding: 12px 18px;
  background-color: white;
  border-radius: 20px;
`

const TabTitle = styled(Text)<{ selected: boolean }>`
  position: relative;
  cursor: pointer;
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
  color: ${({ selected, theme }) => (selected ? theme.colors.primary : theme.colors.text)};
  &:after {
    content: "";
    display: ${({ selected }) => (selected ? "block" : "none")};
    width: 100%;
    height: 5px;
    background-color: ${({ theme }) => theme.colors.primary};
    position: absolute;
    bottom: -10px;

  }
`;

const TabContent = styled(Flex)`
  flex-direction: column;
  padding-right: 16px;
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

const StyledCornerIllustration = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
`

function ProjectDetails({ projectAddress, onBack }: Props) {
  const { account } = useKickstarterContext()
  const kickstarter = useKickstarter(projectAddress)
  const generalTabs: Tab[] = [
    {
      code: TabCode.PROJECT_DETAILS,
      label: "Project Details",
    },
    {
      code: TabCode.REWARDS,
      label: "Rewards",
    },
  ]

  const tabs: Tab[] = account?.toLowerCase() === kickstarter?.owner.id ? [
    ...generalTabs,
    {
      code: TabCode.DONATORS,
      label: "Donators",
    },
  ] : generalTabs

  const [selectedTab, setSelectedTab] = useState(tabs[0].code)
  const [donators, setDonators] = useState<Donator[]>([
    {
      name: "John Doe",
      email: "johndoe@email.com",
      walletAddress: "0x1234567890123456789012345678901234567890",
      amount: 100,
    },
    {
      name: "Samuel Doe",
      email: "samueldoe@email.com",
      walletAddress: "0x1234567890123456789012345678901234567890",
      amount: 0.01,
    },
    {
      name: "Ann Doe",
      email: "anndoe@email.com",
      walletAddress: "0x1234567890123456789012345678901234567890",
      amount: 0.21,
    },
    {
      name: "Jimmy Doe",
      email: "jimmydoe@email.com",
      walletAddress: "0x1234567890123456789012345678901234567890",
      amount: 0.21,
    },
  ])
  const [hasBackedProject, setHasBackedProject] = useState(true)
  const [backedAmount, setBackedAmount] = useState(1000)
  const [isPayment, setIsPayment] = useState(false)
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  const displayTooltip = () => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }

  const togglePayment = () => {
    setIsPayment((prevValue) => !prevValue)
  }

  useEffect(() => {
    if (account?.toLowerCase() === kickstarter?.owner.id) return
    if (selectedTab !== TabCode.DONATORS) return
    setSelectedTab(TabCode.PROJECT_DETAILS)
  }, [selectedTab, account, kickstarter])

  if (isPayment) {
    return <ProjectPayment onBack={onBack} togglePayment={togglePayment}  />
  }

  const currentPageLink = encodeURIComponent(`${window.location.href}?kickstarter=${kickstarter?.id}`)

  return (
    <Flex flexDirection="column">
      <Flex flex={1}>
        <Flex flex={1} borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
          <Breadcrumbs>
            <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={onBack}>
              My Project
            </Text>
            <Text color="borderColor" style={{ fontWeight: 700 }}>
              Project Details
            </Text>
          </Breadcrumbs>
        </Flex>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={onBack}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: "underline" }}>back to Browse Projects</Text>
      </Flex>
      <ImageAndDescriptionWrapper>
        <DesktopBanner />
        <Flex flexDirection="column">
          <Flex style={{ columnGap: "8px" }} marginBottom="8px">
            {hasBackedProject && (
              <Label variant="default"><b>backed</b></Label>
            )}
            <Label variant="failure"><b>7 days left</b></Label>
          </Flex>
          {!kickstarter ? (
            <Skeleton height={36} marginBottom="24px" />
          ) : (
            <Text fontSize="40px" marginBottom="24px">
              {kickstarter.title}
            </Text>
          )}
          <MobileBanner marginBottom="24px" />
          <Flex style={{ columnGap: "8px" }}>
            <BinanceIcon width="20px" />
            {!kickstarter ? (
              <Skeleton height={28} width={30} marginBottom="24px" />
            ) : (
              <Text fontWeight="bold" fontSize="24px">
                {kickstarter.totalContribution.toString()}
              </Text>
            )}
          </Flex>
          <Text color="textSubtle" marginBottom="16px">backed of 10 BNB goal</Text>
          <ProgressBox maxWidth="400px" marginBottom="8px">
            <Progress primaryStep={30} />
          </ProgressBox>
          <Flex style={{ columnGap: "8px" }} alignItems="center" marginBottom="16px">
            {!kickstarter ? (
              <Skeleton width={45} />
            ) : (
              <Text fontWeight="bold">{getDayRemaining(kickstarter.endTimestamp)} days left</Text>
            )}
            <Dot />
            <Text>0 backers</Text>
          </Flex>
          {hasBackedProject && (
            <BackedAmountWrapper flexDirection="column" marginBottom="16px">
              <StyledCornerIllustration src={ImgCornerIllustration} />
              <Text fontWeight="bold" marginBottom="4px">You have backed this project</Text>
              <Text>Backed amount&nbsp;&nbsp;&nbsp;&nbsp;{backedAmount} BNB</Text>
            </BackedAmountWrapper>
          )}
          <Flex style={{ columnGap: "8px" }} alignItems="center">
            <Button onClick={togglePayment}>Back this project</Button>
            {!kickstarter ? (
              <Skeleton width={50} height={38} />
            ) : (
              <Tooltip placement="top" text="Copied" show={isTooltipDisplayed}>
                <SocialMedia
                  type="button"
                  style={{ cursor: "pointer" }}
                  onClick={() => copyText(currentPageLink, displayTooltip)}>
                  <ShareIcon width="14px" />
                </SocialMedia>
              </Tooltip>
            )}
            {!kickstarter ? (
              <Skeleton width={50} height={38} />
            ) : (
              <SocialMedia
                style={{ cursor: "pointer" }}
                href={`https://twitter.com/intent/tweet?text=Let's ontribute to "${kickstarter?.title}" Kickstarter ${currentPageLink}`}
                target="_blank">
                <TwitterIcon width="14px" />
              </SocialMedia>
            )}
            {!kickstarter ? (
              <Skeleton width={50} height={38} />
            ) : (
              <SocialMedia
                style={{ cursor: "pointer" }}
                href={`https://www.facebook.com/sharer/sharer.php?u=${currentPageLink}`}
                target="_blank">
                <FacebookIcon width="14px" />
              </SocialMedia>
            )}
          </Flex>
        </Flex>
      </ImageAndDescriptionWrapper>
      <Flex style={{ columnGap: "32px" }} flex={1} borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="10px">
        {tabs.map((tab) => (
          <TabTitle key={tab.code} onClick={() => setSelectedTab(tab.code)} selected={tab.code === selectedTab}>
            {tab.label}
          </TabTitle>
        ))}
      </Flex>
      <TabContent
        style={{ height: selectedTab === TabCode.DONATORS ? "350px": "auto", overflowY: selectedTab === TabCode.DONATORS ? "scroll": "auto" }}
        borderBottom="1px solid"
        borderBottomColor="inputColor"
        paddingY="24px"
        marginBottom="24px">
        {selectedTab === TabCode.PROJECT_DETAILS && (
          <>
            <Text color="textSubtle" marginBottom="4px">Project Description</Text>
            {!kickstarter ? (
              <>
                <Skeleton marginBottom={2} />
                <Skeleton marginBottom={2} />
                <Skeleton />
              </>
            ) : (
              <Text>{kickstarter.projectDescription}</Text>
            )}
            <br />
            <Grid container spacing="16px">
              <Grid item xs={12} sm={6}>
                <Flex flexDirection="column" marginRight="auto">
                  <Text color="textSubtle" marginBottom="4px">Project Created</Text>
                  {!kickstarter ? (
                    <Skeleton width={150} />
                  ) : (
                    <Text>{format(new Date(kickstarter.createdAt * 1000), 'LLLL do, yyyy')}</Text>
                  )}
                </Flex>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Flex flexDirection="column" marginRight="auto">
                <Text color="textSubtle" marginBottom="4px">Project Due Date</Text>
                {!kickstarter ? (
                  <Skeleton width={150} />
                ) : (
                  <Text>{format(new Date(kickstarter.endTimestamp * 1000), 'LLLL do, yyyy')}</Text>
                )}
              </Flex>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing="16px">
              <Grid item xs={12} sm={6}>
                <Flex flexDirection="column" marginRight="auto">
                  <Text color="textSubtle" marginBottom="4px">Minimum Balance Participation</Text>
                  {!kickstarter ? (
                    <Skeleton width={150} />
                  ) : (
                    <Flex style={{ columnGap: "8px" }}>
                      <BinanceIcon width="20px" />
                      {!kickstarter ? (
                        <Skeleton height={28} width={30} marginBottom="24px" />
                      ) : (
                        <Text>{kickstarter.minContribution.toString()}</Text>
                      )}
                    </Flex>
                  )}
                </Flex>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Flex flexDirection="column" marginRight="auto">
                <Text color="textSubtle" marginBottom="4px">Project Creator</Text>
                {!kickstarter ? (
                  <Skeleton width={150} />
                ) : (
                  <Text>{kickstarter.creator}</Text>
                )}
              </Flex>
              </Grid>
            </Grid>
          </>
        )}
        {selectedTab === TabCode.REWARDS && (
          <>
            <Text color="textSubtle" marginBottom="4px">Reward Description</Text>
            {!kickstarter ? (
              <>
                <Skeleton marginBottom={2} />
                <Skeleton marginBottom={2} />
                <Skeleton />
              </>
            ) : (
              <Text>{kickstarter.rewardDescription}</Text>
            )}
            <br />
            <Text color="textSubtle" marginBottom="4px">Reward Distribution</Text>
            {!kickstarter ? (
              <Skeleton width={150} />
            ) : (
              <Text>
                {format(new Date(kickstarter.rewardDistributionTimestamp * 1000), 'LLLL do, yyyy')}
              </Text>
            )}
            <br />
            <Text color="textSubtle" marginBottom="4px">Reward Status</Text>
            <Text>
              {!kickstarter?.hasDistributedRewards && "Not"} Distributed
            </Text>
            <br />
            {hasBackedProject && (
              <>
                <Text color="warning" fontWeight="bold" marginBottom="4px">Have you received the reward for this project?</Text>
                <Text fontSize="12px">
                  If you haven&apos;t received any reward after the due date,
                  you may <Link href="/">contact our support</Link>
                </Text>
              </>
            )}
          </>
        )}
        {selectedTab === TabCode.DONATORS && (
          <>
            {donators.length === 0 && (
              <Text color="textDisabled" marginTop="16px">There are no backer for this project. Share your project to everyone now.</Text>
            )}
            {donators.map((donator, index) => (
              <DonatorCard
                key={donator.walletAddress}
                donator={donator}
                isFirstItem={index === 0}
                isLastItem={index === donators.length - 1}
              />
            ))}
          </>
        )}
      </TabContent>
      {account?.toLowerCase() === kickstarter?.owner.id && (
        <Button variant="primary" marginRight="auto" startIcon={<FileIcon color="text" />}>
          Download Donator List
        </Button>
      )}
    </Flex>
  )
}

export default ProjectDetails
