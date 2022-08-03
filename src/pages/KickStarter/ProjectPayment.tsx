import { ArrowBackIcon, ArrowForwardIcon, BinanceIcon, Box, Breadcrumbs, Button, Flex, Heading, Text, useWalletModal, WalletIcon } from "@koda-finance/summitswap-uikit"
import { Grid } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import React, { useCallback } from "react"
import styled from "styled-components"
import login from "utils/login"
import FundingInput from "./FundingInput"

type Props = {
  toggleSelectedProject: () => void
  togglePayment: () => void
}

const Banner = styled.div`
  background: gray;
  width: 120px;
  height: 120px;
  border-radius: 8px;
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

const ImgAccount = styled.div`
  width: 40px;
  height: 40px;
  background: gray;
  border-radius: 50%;
`;

function ProjectPayment({ toggleSelectedProject, togglePayment }: Props) {
  const { account, activate, deactivate } = useWeb3React()
  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <Flex flexDirection="column">
      <Flex flex={1} borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={toggleSelectedProject}>
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={toggleSelectedProject}>
            <ArrowBackIcon color="linkColor" />
            <Text color="linkColor" style={{ textDecoration: "underline" }}>back to Project Details</Text>
          </Flex>
          <Heading size="lg" marginBottom="8px">
            Back Project
          </Heading>
          <Flex style={{ columnGap: "16px" }}>
            <Banner />
            <Flex flexDirection="column">
              <Name>ROGER KENTER</Name>
              <Title>Roger Kenter#1 Project</Title>
              <Flex style={{ columnGap: "8px" }}>
                <BinanceIcon />
                <Text fontSize="24px" color="textSubtle"><b style={{ color: "white" }}>0.0000123</b> / 10 BNB</Text>
              </Flex>
            </Flex>
          </Flex>
          <Divider />
          <Text color="textSubtle" marginBottom="4px">Project Reward</Text>
          <Text marginBottom="16px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies consequat tincidunt nulla neque laoreet elit. Ipsum malesuada quam vel maecenas tempus aliquet semper tortor. Tortor, auctor lectus nam pu
          </Text>
          <Text color="textSubtle" marginBottom="4px">Reward Distribution</Text>
          <Text>September 09th, 2022</Text>
        </Grid>
        <Grid item xs={12} sm={5}>
          <SideWrapper marginBottom="16px">
            <Heading size="md" marginBottom="8px">Backing Project</Heading>
            <Text color="textSubtle" marginBottom="16px">
              You have to back with minimum amount of <b style={{ color: "#00D4A4" }}>0.005 BNB</b> to participate in this project
            </Text>
            <FundingInput label="Enter Backing Amount" value={1} onChange={(value) => console.log("value", value)} />
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
                onClick={onPresentConnectModal}>
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
                <ImgAccount />
                <Flex flexDirection="column" marginRight= "auto">
                  <Text fontSize="14px">Account 1</Text>
                  <Text fontSize="12px" color="textDisabled">0x7Bb...0E8C3</Text>
                </Flex>
                <Text fontWeight="bold">3.4927 BNB</Text>
              </Flex>
            )}
          </SideWrapper>
        </Grid>
      </Grid>
    </Flex>
  )
}

export default ProjectPayment
