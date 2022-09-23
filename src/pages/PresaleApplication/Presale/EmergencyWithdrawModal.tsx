import React from 'react'
import { Box, Button, Flex, Modal } from '@koda-finance/summitswap-uikit'
import { StyledText } from './Shared'

const EmergencyWithdrawModal = ({ onDismiss, withdrawHandler, fee }) => {
  return (
    <Modal onDismiss={onDismiss} bodyPadding="0 30px" hideSeparator title="Withdraw Contribution">
      <Box marginBottom="20px" maxWidth="500px">
        <StyledText>Are you sure you want to withdraw your contributions to this presale?</StyledText>
        <StyledText fontSize="12px" marginTop="8px" color="failure">
          NB : You will be charged {fee} for withdrawing your contribution!
        </StyledText>
      </Box>
      <Flex marginBottom="20px" justifyContent="end">
        <Button onClick={withdrawHandler} marginRight="8px" variant="danger">
          Withdraw Contribution
        </Button>
        <Button onClick={onDismiss} variant="tertiary">
          Cancel
        </Button>
      </Flex>
    </Modal>
  )
}

export default EmergencyWithdrawModal
