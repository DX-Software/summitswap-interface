import React from 'react'
import Modal from '../Modal'
import { useActiveWeb3React } from '../../hooks'
import LoadingContent from './LoadingContent'

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  title: string
  subtitle: string | undefined
  description: string | undefined
}

const TransactionConfirmationModal = ({
  isOpen,
  onDismiss,
  title,
  subtitle = undefined,
  description = undefined,
}: ConfirmationModalProps) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <LoadingContent
        onDismiss={onDismiss} title={title} subtitle={subtitle} description={description}
      />
    </Modal>
  )
}

export default TransactionConfirmationModal
