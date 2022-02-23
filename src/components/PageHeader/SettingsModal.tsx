import React from 'react'
import { Button, Modal, Flex } from '@summitswap/uikit'
import SlippageToleranceSetting from './SlippageToleranceSetting'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'

type SettingsModalProps = {
  onDismiss?: () => void
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const SettingsModal = ({ onDismiss = defaultOnDismiss }: SettingsModalProps) => {
  return (
    <Modal title="Settings" onDismiss={onDismiss}>
      <SlippageToleranceSetting />
      <TransactionDeadlineSetting />
      <Flex justifyContent='flex-end'>
        <Button scale='md' onClick={() => onDismiss()} style={{ fontWeight: 800, fontSize: 18 }}>CONFIRM</Button>
      </Flex>
    </Modal>
  )
}

export default SettingsModal
