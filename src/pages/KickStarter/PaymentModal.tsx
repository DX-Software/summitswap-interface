import { BinanceIcon, Button, Flex, Modal, Text, WalletIcon } from "@koda-finance/summitswap-uikit";
import React from "react"
import styled from "styled-components";

type PaymentModalProps = {
  title: string;
}

const ContentWrapper = styled(Flex)`
  flex-direction: column;
  border-top: 1px dashed;
  border-color: ${({ theme }) => theme.colors.primaryDark};
  padding: 24px;
`

const Banner = styled.div`
  width: 63px;
  height: 63px;
  border-radius: 8px;
  background: gray;
`

const Name = styled(Text)`
  font-size: 12px;
  text-transform: uppercase;
`

const Title = styled(Text)`
  font-size: 14px;
  font-weight: bold;
`

const ImgAccount = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: gray;
`

const DescriptionWrapper = styled(Flex)`
  padding: 8px 0;
  border-top: 1px solid;
  border-color: ${({ theme }) => theme.colors.inputColor};
  justify-content: space-between;
`

function PaymentModal({ title }: PaymentModalProps) {
  return (
    <Modal title={title} bodyPadding="0">
      <ContentWrapper>
        <Flex marginBottom="16px" style={{ columnGap: "8px" }}>
          <Banner />
          <Flex flexDirection="column">
            <Name color="textSubtle" marginBottom="4px">Roger Kenter</Name>
            <Title>Roger Kenter#1 Project</Title>
          </Flex>
        </Flex>
        <Text fontWeight="bold" color="warning" marginBottom="8px">Payment Details</Text>
        <Flex alignItems="center" marginBottom="16px" style={{ columnGap: "8px" }}>
          <ImgAccount />
          <Flex flexDirection="column" marginRight="auto">
            <Text fontSize="14px">Account 1</Text>
            <Text fontSize="12px" color="textDisabled">0x7Bb...0E8C3</Text>
          </Flex>
          <Text fontWeight="bold" color="primaryDark">3.4927 BNB</Text>
        </Flex>
        <DescriptionWrapper marginBottom="24px">
          <Text fontWeight="bold" small>Total Payment</Text>
          <Flex style={{ columnGap: "5px" }}>
            <BinanceIcon />
            <Text small fontWeight="bold">0.005</Text>
          </Flex>
        </DescriptionWrapper>
        <Button startIcon={<WalletIcon color="text" />}>Pay Now</Button>
      </ContentWrapper>
    </Modal>
  )
}

export default PaymentModal
