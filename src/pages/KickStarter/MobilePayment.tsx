import { ArrowForwardIcon, BinanceIcon, Box, Button, Flex, Heading, Text, WalletIcon } from "@koda-finance/summitswap-uikit"
import { useKickstarterContext } from "contexts/kickstarter"
import React from "react"
import styled from "styled-components"
import FundingInput from "./FundingInput"

type Props = {
  showPayment: () => void
}

const Banner = styled.div`
  background: gray;
  width: 60px;
  height: 60px;
  border-radius: 8px;
`

const Name = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-transform: uppercase;
`

const Title = styled(Text)`
  font-weight: bold;
  margin-bottom: 4px;
`

const Divider = styled.div`
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.colors.inputColor};
  margin: 24px 0px;
`

const ImgAccount = styled.div`
  width: 40px;
  height: 40px;
  background: gray;
  border-radius: 50%;
`

const ConnectionWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.menuItemBackground};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.backgroundDisabled};
  border-radius: 8px;
  flex-direction: column;
  padding: 12px 16px;
  margin-top: 8px;
  row-gap: 8px;
`

const OnlineDot = styled(Box)<{ isOnline: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${({ isOnline, theme }) => isOnline ? theme.colors.linkColor : theme.colors.textDisabled};
`

function MobilePayment({ showPayment }: Props) {
  const { account, onPresentConnectModal } = useKickstarterContext()

  return (
    <Flex flexDirection="column">
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
            <Text color="textSubtle"><b style={{ color: "white" }}>0.0000123</b> / 10 BNB</Text>
          </Flex>
        </Flex>
      </Flex>
      <Divider />
      <Heading size="lg" marginBottom="8px">
        Backing Project
      </Heading>
      <Text color="textSubtle" style={{ marginBottom: "24px" }}>
        You have to back with minimum amount of <b style={{ color: "#00D4A4" }}>0.005 BNB</b> to participate in this project
      </Text>
      <FundingInput label="Enter Backing Amount" value={1} onChange={(value) => console.log("value", value)} />
      <ConnectionWrapper>
        <Flex alignItems="center" marginTop="8px" style={{ columnGap: "8px" }}>
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
      </ConnectionWrapper>
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
          Continue
        </Button>
      )}
    </Flex>
  )
}

export default MobilePayment
