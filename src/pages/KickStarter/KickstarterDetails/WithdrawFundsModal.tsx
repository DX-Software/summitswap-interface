import { Button, Flex, InjectedModalProps, Modal, Text, Box } from '@koda-finance/summitswap-uikit'
import React, { useMemo } from 'react'
import { Kickstarter } from 'types/kickstarter'

interface Props extends InjectedModalProps {
  kickstarter?: Kickstarter
  handleWithdrawFunds: () => Promise<void>
  attemptingTxn: boolean
}

function WithdrawFundsModal({ kickstarter, attemptingTxn, handleWithdrawFunds, onDismiss }: Props) {
  const withdrawalFee = useMemo(() => {
    if (kickstarter) {
      return kickstarter.percentageFeeAmount
        ?.times(kickstarter.totalContribution || 0)
        .div(10000)
        .plus(kickstarter.fixFeeAmount || 0)
    }
    return 0
  }, [kickstarter])

  return (
    <Modal onDismiss={onDismiss} bodyPadding="0 30px" hideSeparator title="Withdraw Funds">
      <Box marginBottom="32px" marginRight="50px">
        <Text>Are you sure you want to withdraw your Funds?</Text>
        <Text fontSize="12px" marginTop="4px" color="failure">
          NB: You will be charged {withdrawalFee?.toString()} {kickstarter?.tokenSymbol} for withdrawing your funds!
        </Text>
      </Box>
      <Flex marginBottom="20px" justifyContent="end">
        <Button isLoading={attemptingTxn} onClick={handleWithdrawFunds} marginRight="8px">
          Withdraw Funds
        </Button>
        <Button onClick={onDismiss} variant="tertiary">
          Cancel
        </Button>
      </Flex>
    </Modal>
  )
}

export default WithdrawFundsModal
