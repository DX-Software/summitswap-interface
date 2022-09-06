import { ArrowBackIcon, Breadcrumbs, Flex, Heading, Skeleton, Text } from "@koda-finance/summitswap-uikit"
import { Grid } from "@mui/material"
import React, { useState } from "react"
import styled from "styled-components"
import { KickstarterApprovalStatus } from "types/kickstarter"
import { CurrencyInfo, Divider, StatusInfo, TextInfo } from "../shared"

type KickstarterDetailsProps = {
  previousPage: string
  kickstarterId: string
  handleKickstarterId: (value: string) => void
}

type HeaderProps = {
  previousPage: string
  handleKickstarterId: (value: string) => void
}

const ImgKickstarter = styled.div<{ image: string }>`
  width: 240px;
  height: 230px;
  border-radius: 8px;
  flex-shrink: 0;

  background: ${(props) => `gray url(${props.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;

  @media (max-width: 768px) {
    width: 100%;
    height: 230px;
  }
`

const ProjectDetailsContainer = styled(Flex)`
  column-gap: 16px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Header = ({previousPage, handleKickstarterId}: HeaderProps) => {
  return (
    <>
      <Flex borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={() => handleKickstarterId("")}>
            {previousPage}
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            Project Details
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={() => handleKickstarterId("")}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: "underline" }}>back to Admin Panel</Text>
      </Flex>
    </>
  )
}

const ProjectDetails = () => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Project Details</Heading>
      <ProjectDetailsContainer>
        <ImgKickstarter image="https://picsum.photos/400" />
        <br />
        <Flex flexDirection="column">
          <StatusInfo title="Project Status" approvalStatus={KickstarterApprovalStatus.WAITING_FOR_APPROVAL} />
          <Divider />
          <TextInfo title="Project Title" description="Summit Swap #1 Project" />
          <br />
          <TextInfo title="Project Creator" description="SUMMITSWAP" />
          <br />
          <TextInfo title="Project Description" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non nibh a, commodo aliquam nullam pharetra viverra. Etiam odio aliquam quis lacus, justo, aliquam molestie suspendisse tempus." />
          <br />
          <Grid container spacing="16px">
            <Grid item xs={12} sm={6} lg={4}>
              <CurrencyInfo title="Project Currency" description="BNB" iconUrl="/images/coins/bnb.png" />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <CurrencyInfo title="Project Goals" description="101" iconUrl="/images/coins/bnb.png" />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <CurrencyInfo title="Minimum Backing" description="10" iconUrl="/images/coins/bnb.png" />
            </Grid>
          </Grid>
        </Flex>
      </ProjectDetailsContainer>
    </>
  )
}

const FundAndRewardsSystem = () => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Fund & Reward System</Heading>
      <TextInfo
        title="Creator Wallet Address"
        description="0x653222feCf0C7a936C121832561f9DD8774eE496"
      />
      <br />
      <TextInfo
        title="Reward Description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non nibh a, commodo aliquam nullam pharetra viverra. Etiam odio aliquam quis lacus, justo, aliquam molestie suspendisse tempus."
      />
      <br />
      <Grid container spacing="16px">
        <Grid item xs={12} sm={6}>
          <TextInfo
            title="Project Due Date"
            description="Tuesday, July 26th 2022"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo
            title="Reward Description"
            description="Tuesday, July 26th 2022"
            tooltipText="This is only an estimated date. It might be possible for the reward to be distributed earlier or later from scheduled."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo title="Contact Method" description="Telegram" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo title="Telegram ID" description="summitswap" />
        </Grid>
      </Grid>
    </>
  )
}

const Withdrawal = () => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Withdrawal Fee Amount</Heading>
      <Grid container spacing="16px">
        <Grid item xs={12} sm={6} lg={4}>
          <TextInfo
            title="Fee Method"
            description="Percentage"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <TextInfo
            title="Fee Percentage"
            description="5%"
          />
        </Grid>
      </Grid>
    </>
  )
}

const EditWithdrawal = () => {
  return (
    <>
      <Heading size='lg' marginBottom="8px" color="sidebarActiveColor">Withdrawal Fee Amount</Heading>
      <Text>Withdrawal fee is collected when project creator wants to withdraw their project fund</Text>
      <br />
    </>
  )
}

function KickstarterDetails({ previousPage, kickstarterId, handleKickstarterId }: KickstarterDetailsProps) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <Flex flexDirection="column">
      <Header previousPage={previousPage} handleKickstarterId={handleKickstarterId} />
      <ProjectDetails />
      <Divider />
      <FundAndRewardsSystem />
      <Divider />
      <Withdrawal />
    </Flex>
  )
}

export default KickstarterDetails
