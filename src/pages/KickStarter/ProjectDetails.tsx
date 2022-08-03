import { ArrowBackIcon, BinanceIcon, Breadcrumbs, Button, FacebookIcon, FileIcon, Flex, Progress, ShareIcon, Tag, Text, TwitterIcon } from "@koda-finance/summitswap-uikit"
import { Grid } from "@mui/material"
import React, { useState } from "react"
import styled from "styled-components"
import ImgCornerIllustration from "img/corner-illustration.svg"
import DonatorCard from "./DonatorCard"
import ProgressBox from "./ProgressBox"
import { Donator } from "./types"
import ProjectPayment from "./ProjectPayment"

type Props = {
  toggleSelectedProject: () => void
}

type Tab = {
  label: string
  code: "project_details" | "rewards" | "donators"
}

const Banner = styled(Flex)`
  width: 270px;
  height: 230px;
  border-radius: 8px;
  background-color: gray;
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

const SocialMedia = styled(Flex)`
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
  height: 350px;
  overflow-y: scroll;
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

function ProjectDetails({ toggleSelectedProject }: Props) {
  const tabs: Tab[] = [
    {
      code: "project_details",
      label: "Project Details",
    },
    {
      code: "rewards",
      label: "Rewards",
    },
    {
      code: "donators",
      label: "Donators",
    },
  ]
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

  const togglePayment = () => {
    setIsPayment((prevValue) => !prevValue)
  }

  if (isPayment) {
    return <ProjectPayment toggleSelectedProject={toggleSelectedProject} togglePayment={togglePayment}  />
  }

  return (
    <Flex flexDirection="column">
      <Flex flex={1}>
        <Flex flex={1} borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
          <Breadcrumbs>
            <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={toggleSelectedProject}>
              My Project
            </Text>
            <Text color="borderColor" style={{ fontWeight: 700 }}>
              Project Details
            </Text>
          </Breadcrumbs>
        </Flex>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={toggleSelectedProject}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: "underline" }}>back to Browse Projects</Text>
      </Flex>
      <Flex style={{ columnGap: '32px' }} marginBottom="32px">
        <Banner />
        <Flex flexDirection="column">
          <Flex style={{ columnGap: "8px" }} marginBottom="8px">
            {hasBackedProject && (
              <Label variant="default"><b>backed</b></Label>
            )}
            <Label variant="failure"><b>7 days left</b></Label>
          </Flex>
          <Text fontSize="40px" marginBottom="24px">SummitSwap#1 Fundraising Project</Text>
          <Flex style={{ columnGap: "8px" }}>
            <BinanceIcon width="20px" />
            <Text fontWeight="bold" fontSize="24px">0.0000123</Text>
          </Flex>
          <Text color="textSubtle" marginBottom="16px">backed of 10 BNB goal</Text>
          <ProgressBox maxWidth="400px" marginBottom="8px">
            <Progress primaryStep={30} />
          </ProgressBox>
          <Flex style={{ columnGap: "8px" }} alignItems="center" marginBottom="16px">
            <Text fontWeight="bold">30 days left</Text>
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
            <SocialMedia>
              <ShareIcon width="14px" />
            </SocialMedia>
            <SocialMedia>
              <TwitterIcon width="14px" />
            </SocialMedia>
            <SocialMedia>
              <FacebookIcon width="14px" />
            </SocialMedia>
          </Flex>
        </Flex>
      </Flex>
      <Flex style={{ columnGap: "32px" }} flex={1} borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="10px">
        {tabs.map((tab) => (
          <TabTitle key={tab.code} onClick={() => setSelectedTab(tab.code)} selected={tab.code === selectedTab}>
            {tab.label}
          </TabTitle>
        ))}
      </Flex>
      <TabContent borderBottom="1px solid" borderBottomColor="inputColor" paddingY="24px" marginBottom="24px">
        {selectedTab === "project_details" && (
          <>
            <Text color="textSubtle" marginBottom="4px">Project Description</Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Ultricies consequat tincidunt nulla neque laoreet elit.
              Ipsum malesuada quam vel gravida at convallis magnis eget pellentesque.
              Viverra dignissim velit consectetur dictum aliquet mattis in commodo aliquam.
              Et etiam eu maecenas tempus aliquet semper tortor. Tortor, auctor lectus nam
            </Text>
            <br />
            <Grid container spacing="16px">
              <Grid item xs={12} sm={6}>
                <Flex flexDirection="column" marginRight="auto">
                  <Text color="textSubtle" marginBottom="4px">Project Created</Text>
                  <Text>June 20th, 2022</Text>
                </Flex>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Flex flexDirection="column" marginRight="auto">
                <Text color="textSubtle" marginBottom="4px">Project Due Date</Text>
                <Text>July 20th, 2022</Text>
              </Flex>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing="16px">
              <Grid item xs={12} sm={6}>
                <Flex flexDirection="column" marginRight="auto">
                  <Text color="textSubtle" marginBottom="4px">Minimum Balance Participation</Text>
                  <Text>July 20th, 2022</Text>
                </Flex>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Flex flexDirection="column" marginRight="auto">
                <Text color="textSubtle" marginBottom="4px">Project Creator</Text>
                <Text>SUMMITSWAP</Text>
              </Flex>
              </Grid>
            </Grid>
          </>
        )}
        {selectedTab === "rewards" && (
          <>
            <Text color="textSubtle" marginBottom="4px">Reward Description</Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Ultricies consequat tincidunt nulla neque laoreet elit.
              Ipsum malesuada quam vel gravida at convallis magnis eget pellentesque.
              Viverra dignissim velit consectetur dictum aliquet mattis in commodo aliquam.
              Et etiam eu maecenas tempus aliquet semper tortor. Tortor, auctor lectus nam
            </Text>
            <br />
            <Text color="textSubtle" marginBottom="4px">Reward Distribution</Text>
            <Text>September 20th, 2022</Text>
            {hasBackedProject && (
              <>
                <br />
                <Text color="textSubtle" marginBottom="4px">Reward Status</Text>
                <Text>Not Distributed</Text>
                <br />
                <Text color="warning" fontWeight="bold" marginBottom="4px">Have you received the reward for this project?</Text>
                <Text fontSize="12px">
                  If you haven&apos;t received any reward after the due date,
                  you may <Link href="/">contact our support</Link>
                </Text>
              </>
            )}
          </>
        )}
        {selectedTab === "donators" && (
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
      <Button variant="primary" marginRight="auto" startIcon={<FileIcon color="text" />}>Download Donator List</Button>
    </Flex>
  )
}

export default ProjectDetails
