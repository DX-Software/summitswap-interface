import React from 'react'
import { Box, Button, Flex, Modal, TrashIcon } from '@koda-finance/summitswap-uikit'
import { StyledText } from './Shared'

const RemoveWhitelistModal = ({ title, selectedNumber, onDismiss, removeWhitelistHandler }) => {
  const isAll = title.includes('All')

  return (
    <Modal onDismiss={onDismiss} bodyPadding="0 30px" hideSeparator title={title}>
      <Box marginBottom="20px" maxWidth="500px">
        <StyledText>
          {isAll
            ? 'Are you sure you want to remove all of the whitelist added?'
            : 'Are you sure you want to remove selected whitelist added?'}
        </StyledText>
        <Flex marginTop="24px" justifyContent="end">
          <Button
            startIcon={<TrashIcon width="14px" color="currentColor" />}
            variant="danger"
            scale="sm"
            marginRight="8px"
            onClick={removeWhitelistHandler}
          >
            Remove {isAll ? 'All' : `(${selectedNumber})`}
          </Button>
          <Button onClick={onDismiss} variant="tertiary" scale="sm" marginRight="8px">
            Cancel
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}

export default RemoveWhitelistModal
