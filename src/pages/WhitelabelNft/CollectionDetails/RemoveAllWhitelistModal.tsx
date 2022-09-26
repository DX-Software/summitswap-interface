import { Button, Flex, Heading, InjectedModalProps, Modal, Text, TrashIcon } from '@koda-finance/summitswap-uikit'
import React from 'react'

type RemoveWhitelistAllModalProps = InjectedModalProps & {
  onDelete: () => void
}

const RemoveAllWhitelistModal: React.FC<RemoveWhitelistAllModalProps> = ({ onDelete, onDismiss }) => {
  const handleDelete = () => {
    onDelete()
    if (onDismiss) onDismiss()
  }

  return (
    <Modal title="" onDismiss={onDismiss} hideSeparator>
      <Flex flexDirection="column" marginTop="-72px" marginBottom="16px">
        <Heading size="lg" color="failure" marginBottom="8px">
          Remove All Whitelist
        </Heading>
        <Text>Are you sure you want to remove all of the whitelist added?</Text>
      </Flex>
      <Flex justifyContent="flex-end" style={{ columnGap: '8px' }}>
        <Button scale="sm" variant="danger" onClick={handleDelete} startIcon={<TrashIcon width={16} color="default" />}>
          Remove All
        </Button>
        <Button scale="sm" variant="tertiary" onClick={onDismiss}>
          Cancel
        </Button>
      </Flex>
    </Modal>
  )
}

export default RemoveAllWhitelistModal
