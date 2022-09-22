import React from 'react'
import { Box, Button, Flex, Modal } from '@koda-finance/summitswap-uikit'
import { StyledText } from './Shared'

const FinalizePresaleModal = ({ onDismiss, presaleCancelHandler }) => {
  return (
    <Modal onDismiss={onDismiss} bodyPadding="0 30px" hideSeparator title="Cancel Presale">
      <Box marginBottom="20px" maxWidth="500px">
        <StyledText>Are you sure you want to cancel your presale?</StyledText>
      </Box>
      <Flex marginBottom="20px" justifyContent="end">
        <Button onClick={presaleCancelHandler} marginRight="8px" variant="danger">
          Cancel Presale
        </Button>
        <Button onClick={onDismiss} variant="tertiary">
          Cancel
        </Button>
      </Flex>
    </Modal>
  )
}

export default FinalizePresaleModal
