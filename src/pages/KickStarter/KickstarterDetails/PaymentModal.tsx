import { Button, Flex, InjectedModalProps, Modal, Skeleton, Text, WalletIcon } from '@koda-finance/summitswap-uikit'
import AccountIcon from 'components/AccountIcon'
import { getTokenImageBySymbol } from 'connectors'
import { MAX_UINT256, NULL_ADDRESS } from 'constants/index'
import { useTokenContract } from 'hooks/useContract'
import { BigNumber } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Kickstarter } from 'types/kickstarter'
import { shortenAddress } from 'utils'
import { useWeb3React } from '@web3-react/core'
import { ImgCurrency } from '../shared'

interface PaymentModalProps extends InjectedModalProps {
  account: string | null | undefined
  paymentTokenBalance: string
  accountBalance: string | undefined
  totalPayment: string
  kickstarter: Kickstarter
  handlePayment: () => void
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

function PaymentModal({
  account,
  accountBalance,
  totalPayment,
  paymentTokenBalance,
  kickstarter,
  onDismiss,
  handlePayment,
}: PaymentModalProps) {
  const { library } = useWeb3React()
  const [isLoading, setIsLoading] = useState(true)
  const [isApproved, setIsApproved] = useState(false)
  const tokenContract = useTokenContract(kickstarter.paymentToken)
  const pay = useCallback(() => {
    handlePayment()
    if (onDismiss) onDismiss()
  }, [handlePayment, onDismiss])

  const approve = useCallback(async () => {
    if (!tokenContract || !account || !library) {
      return
    }

    const receipt = await tokenContract.approve(kickstarter.id, MAX_UINT256)

    setIsLoading(true)
    await library.waitForTransaction(receipt.hash)
    setIsLoading(false)

    setIsApproved(true)

  }, [account, tokenContract, library, setIsLoading, kickstarter])

  useEffect(() => {
    async function handleIsApproved() {
      let isApprovedTemp = false
      if (kickstarter.paymentToken === NULL_ADDRESS) {
        isApprovedTemp = true
      } else if (!kickstarter.paymentToken || !tokenContract || !account) {
        isApprovedTemp = false
      } else {
        const userBalance = (await tokenContract.balanceOf(account)) as BigNumber
        const userApprovedAlready = (await tokenContract.allowance(account, kickstarter.id)) as BigNumber
        isApprovedTemp = userApprovedAlready.gte(userBalance)
      }
      setIsApproved(isApprovedTemp)
      setIsLoading(false)
    }
    handleIsApproved()
  }, [kickstarter, tokenContract, account])

  return (
    <Modal title="Payment Process" bodyPadding="0" onDismiss={onDismiss}>
      <ContentWrapper>
        <Flex marginBottom="16px" style={{ columnGap: '8px' }}>
          <Banner image={kickstarter.imageUrl || ''} />
          <Flex flexDirection="column">
            <Name color="textSubtle" marginBottom="4px">
              {kickstarter.creator}
            </Name>
            <Title style={{ maxWidth: '320px' }}>{kickstarter.title}</Title>
          </Flex>
        </Flex>
        {account && (
          <>
            <Text fontWeight="bold" color="warning" marginBottom="8px">
              Payment Details
            </Text>
            <Flex alignItems="center" marginBottom="16px" style={{ columnGap: '8px' }}>
              <AccountIcon account={account} size={32} />
              <Flex flexDirection="column" marginRight="auto">
                <Text fontSize="12px" color="textDisabled">
                  {shortenAddress(account)}
                </Text>
              </Flex>
              {!accountBalance || !paymentTokenBalance ? (
                <Skeleton width={100} height={28} />
              ) : (
                <Text fontWeight="bold" color="primaryDark">
                  {`${kickstarter.paymentToken === NULL_ADDRESS ? accountBalance : paymentTokenBalance} ${
                    kickstarter.tokenSymbol
                  }`}
                </Text>
              )}
            </Flex>
          </>
        )}
        <DescriptionWrapper>
          <Text fontWeight="bold" small>
            Total Payment
          </Text>
          <Flex style={{ columnGap: '5px' }}>
            <ImgCurrency image={getTokenImageBySymbol(kickstarter.tokenSymbol)} />
            <Text small fontWeight="bold">
              {totalPayment}
            </Text>
          </Flex>
        </DescriptionWrapper>
        {!isApproved && (
          <Button onClick={approve} isLoading={isLoading} disabled={!account || !tokenContract || !library}>
            Approve
          </Button>
        )}
        <br />
        <Button startIcon={<WalletIcon color="text" />} isLoading={isLoading} disabled={!isApproved} onClick={pay}>
          Pay Now
        </Button>
      </ContentWrapper>
    </Modal>
  )
}

export default React.memo(PaymentModal)
