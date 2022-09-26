import {
  Box,
  Button,
  Flex,
  Heading,
  InjectedModalProps,
  lightColors,
  Modal,
  Text,
  TrashIcon,
} from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'
import { HelperText } from '../shared/Text'

const ListWrapper = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  max-width: 500px;
  max-height: 300px;
  padding-right: 32px;
  padding-bottom: 16px;
`

const StyledAddress = styled(Text)`
  color: ${({ theme }) => theme.colors.primaryDark};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 576px) {
    font-size: 14px;
  }
`

type SelectedWhitelistModalProps = InjectedModalProps & {
  selectedAddress: string[]
  onDelete: () => void
}

const SelectedWhitelistModal: React.FC<SelectedWhitelistModalProps> = ({ selectedAddress, onDelete, onDismiss }) => {
  const handleDelete = () => {
    onDelete()
    if (onDismiss) onDismiss()
  }

  return (
    <Modal title="" onDismiss={onDismiss} hideSeparator>
      <Flex flexDirection="column" marginTop="-72px" marginBottom="16px">
        <Heading size="lg" marginBottom="8px">
          Selected Whitelist
        </Heading>
      </Flex>
      <ListWrapper>
        {selectedAddress.map((address) => (
          <StyledAddress>{address}</StyledAddress>
        ))}
      </ListWrapper>
      <Box borderBottom={`1px solid ${lightColors.inputColor}`} />
      <HelperText marginY="8px">
        Total of{' '}
        <HelperText color="success" fontWeight={700} style={{ display: 'inline-block' }}>
          {selectedAddress.length}
        </HelperText>{' '}
        selected
      </HelperText>
      <Box borderBottom={`1px solid ${lightColors.inputColor}`} marginBottom="16px" />
      <Button variant="danger" width="100%" onClick={handleDelete} startIcon={<TrashIcon width={16} color="default" />}>
        Remove ({selectedAddress.length})
      </Button>
    </Modal>
  )
}

export default SelectedWhitelistModal
