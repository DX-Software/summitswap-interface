import { BinanceIcon, Button, Flex, InjectedModalProps, Modal, Skeleton, Text, WalletIcon } from "@koda-finance/summitswap-uikit"
import React, { useCallback } from "react"
import { Kickstarter } from "hooks/useKickstarter"
import styled from "styled-components"
import { TransactionResponse } from '@ethersproject/providers'
import { shortenAddress } from "utils"
import AccountIcon from "components/AccountIcon"

interface PaymentModalProps extends InjectedModalProps {
  account: string | null | undefined;
  accountBalance: string | undefined;
  totalPayment: string;
  kickstarter: Kickstarter;
  handlePayment: () => void;
}

const ContentWrapper = styled(Flex)`
  flex-direction: column;
  border-top: 1px dashed;
  border-color: ${({ theme }) => theme.colors.primaryDark};
  padding: 24px;
`

const Banner = styled.div<{ image: string }>`
  width: 63px;
  height: 63px;
  border-radius: 8px;
  background: ${(props) => `url(${props.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;
`

const Name = styled(Text)`
  font-size: 12px;
  text-transform: uppercase;
`

const Title = styled(Text)`
  font-size: 14px;
  font-weight: bold;
`

const DescriptionWrapper = styled(Flex)`
  padding: 8px 0;
  border-top: 1px solid;
  border-color: ${({ theme }) => theme.colors.inputColor};
  justify-content: space-between;
`

function PaymentModal({ account, accountBalance, totalPayment, kickstarter, onDismiss, handlePayment }: PaymentModalProps) {

  const pay = useCallback(() => {
    handlePayment()
    if (onDismiss) onDismiss()
  }, [handlePayment, onDismiss])

  return (
    <Modal title="Payment Process" bodyPadding="0" onDismiss={onDismiss}>
      <ContentWrapper>
        <Flex marginBottom="16px" style={{ columnGap: "8px" }}>
          <Banner image={kickstarter.imageUrl} />
          <Flex flexDirection="column">
            <Name color="textSubtle" marginBottom="4px">{kickstarter.creator}</Name>
            <Title style={{ maxWidth: "320px" }}>{kickstarter.title}</Title>
          </Flex>
        </Flex>
        {account && (
          <>
            <Text fontWeight="bold" color="warning" marginBottom="8px">Payment Details</Text>
            <Flex alignItems="center" marginBottom="16px" style={{ columnGap: "8px" }}>
              <AccountIcon account={account} size={32} />
              <Flex flexDirection="column" marginRight="auto">
                <Text fontSize="12px" color="textDisabled">{shortenAddress(account)}</Text>
              </Flex>
              {!accountBalance ? (
                <Skeleton width={100} height={28} />
              ) : (
                <Text fontWeight="bold" color="primaryDark">{accountBalance} BNB</Text>
              )}
            </Flex>
          </>
        )}
        <DescriptionWrapper marginBottom="24px">
          <Text fontWeight="bold" small>Total Payment</Text>
          <Flex style={{ columnGap: "5px" }}>
            <BinanceIcon />
            <Text small fontWeight="bold">{totalPayment}</Text>
          </Flex>
        </DescriptionWrapper>
        <Button startIcon={<WalletIcon color="text" />} onClick={pay}>Pay Now</Button>
      </ContentWrapper>
    </Modal>
  )
}

export default PaymentModal
