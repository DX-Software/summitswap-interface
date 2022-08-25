import { ArrowBackIcon, ArrowForwardIcon, BinanceIcon, Box, Breadcrumbs, Button, Flex, Heading, Skeleton, Text, useModal, WalletIcon } from "@koda-finance/summitswap-uikit"
import { Grid } from "@mui/material"
import AccountIcon from "components/AccountIcon"
import { useKickstarterContext } from "contexts/kickstarter"
import { Kickstarter } from "hooks/useKickstarter"
import { format } from "date-fns"
import React, { useState } from "react"
import styled from "styled-components"
import { shortenAddress } from "utils"
import FundingInput from "./FundingInput"
import MobilePayment from "./MobilePayment"
import PaymentModal from "./PaymentModal"

type Props = {
  kickstarter: Kickstarter
  onBack: () => void
  togglePayment: () => void
  backedAmount: string
  handleBackedAmountChanged: (value: string) => void
}

const MobileBanner = styled(Flex)`
  background: gray;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  display: none;

  @media (max-width: 900px) {
    display: block;
  }
`

const DesktopBanner = styled.div`
  background: gray;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  flex-shrink: 0;

  @media (max-width: 900px) {
    display: none;
  }
`

const Name = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-transform: uppercase;
  margin-bottom: 8px;
`

const Title = styled(Text)`
  font-weight: bold;
  margin-bottom: 32px;
`

const Divider = styled.div`
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.colors.inputColor};
  margin: 24px 0px;
`

const SideItems = styled(Grid)`
  @media (max-width: 900px) {
    display: none;
  }
`

const DesktopPaymentWrapper = styled(Grid)<{ isVisibleOnMobile: boolean }>`
  @media (max-width: 900px) {
    display: ${({ isVisibleOnMobile }) => (isVisibleOnMobile ? "block!important" : "none!important")};
  }
`

const SideWrapper = styled(Flex)`
  flex-direction: column;
  border-radius: 8px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.menuItemBackground};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.backgroundDisabled};
`

const OnlineDot = styled(Box)<{ isOnline: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${({ isOnline, theme }) => isOnline ? theme.colors.linkColor : theme.colors.textDisabled};
`

const ButtonContinue = styled(Button)`
  display: none;
  @media (max-width: 900px) {
    display: flex;
  }
`

function ProjectPayment({ backedAmount, handleBackedAmountChanged, kickstarter, onBack, togglePayment }: Props) {
  const { account, accountBalance, onPresentConnectModal } = useKickstarterContext()

  const [showPayment] = useModal(<PaymentModal title="Payment Process" />)
  const [isMobilePaymentPage, setIsMobilePaymentPage] = useState(false)

  return (
    <Flex flexDirection="column">
      <Flex flex={1} borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={onBack}>
            My Project
          </Text>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={togglePayment}>
            Project Details
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            Payment
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={onBack}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: "underline" }}>back to Project Details</Text>
      </Flex>
      <DesktopPaymentWrapper container spacing={2} isVisibleOnMobile={!isMobilePaymentPage}>
        <Grid item xs={12} md={7}>
          <Heading size="lg" marginBottom="8px">
            Back Project
          </Heading>
          <MobileBanner marginBottom="16px" />
          <Flex style={{ columnGap: "16px" }}>
            <DesktopBanner />
            <Flex flexDirection="column">
              <Name>{kickstarter.creator}</Name>
              <Title>{kickstarter.title}</Title>
              <Flex style={{ columnGap: "8px" }}>
                <BinanceIcon />
                <Text fontSize="24px" color="textSubtle"><b style={{ color: "white" }}>{kickstarter.totalContribution.toString()}</b> / {kickstarter.projectGoals.toString()} BNB</Text>
              </Flex>
            </Flex>
          </Flex>
          <Divider />
          <Text color="textSubtle" marginBottom="4px">Project Reward</Text>
          <Text marginBottom="16px">{kickstarter.rewardDescription}</Text>
          <Text color="textSubtle" marginBottom="4px">Reward Distribution</Text>
          <Text>{format(new Date(kickstarter.rewardDistributionTimestamp * 1000), 'LLLL do, yyyy')}</Text>
        </Grid>
        <SideItems item xs={12} md={5}>
          <SideWrapper marginBottom="16px">
            <Heading size="md" marginBottom="8px">Backing Project</Heading>
            <Text color="textSubtle" marginBottom="16px">
              You have to back with minimum amount of <b style={{ color: "#00D4A4" }}>{kickstarter.minContribution.toString()} BNB</b> to participate in this project
            </Text>
            <FundingInput label="Enter Backing Amount" value={backedAmount} onChange={handleBackedAmountChanged} />
            {!account && (
              <Button
                variant='tertiary'
                startIcon={<WalletIcon />}
                style={{ fontFamily: 'Poppins', marginTop: "32px" }}
                onClick={onPresentConnectModal}>
                Connect Your Wallet
              </Button>
            )}
            {account && (
              <Button
                variant='awesome'
                endIcon={<ArrowForwardIcon color="text" />}
                style={{ fontFamily: 'Poppins', marginTop: "32px" }}
                onClick={showPayment}>
                Proceed
              </Button>
            )}
          </SideWrapper>
          <SideWrapper>
            <Flex alignItems="center" marginBottom="8px" style={{ columnGap: "8px" }}>
              <OnlineDot isOnline={!!account} />
              <Text fontSize="12px">Connected Wallet</Text>
            </Flex>
            {!account && (
              <Text color="textDisabled">No wallet connected.</Text>
            )}
            {account && (
              <Flex alignItems="center" style={{ columnGap: "8px" }}>
                <AccountIcon account={account} size={32} />
                <Flex flexDirection="column" marginRight= "auto">
                  <Text fontSize="16px" color="textDisabled">{shortenAddress(account)}</Text>
                </Flex>
                {!accountBalance ? (
                  <Skeleton width={100} height={28} />
                ) : (
                  <Text fontWeight="bold">{accountBalance} BNB</Text>
                )}
              </Flex>
            )}
          </SideWrapper>
        </SideItems>
      </DesktopPaymentWrapper>
      {isMobilePaymentPage && <MobilePayment showPayment={showPayment} />}
      {!isMobilePaymentPage && (
        <ButtonContinue
          endIcon={<ArrowForwardIcon color="text" />}
          style={{ fontFamily: 'Poppins', marginTop: "32px" }}
          onClick={() => setIsMobilePaymentPage(true)}>
          Continue
        </ButtonContinue>
      )}
    </Flex>
  )
}

export default ProjectPayment
