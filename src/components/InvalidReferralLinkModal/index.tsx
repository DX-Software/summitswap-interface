import React from 'react'
import { useLocation } from 'react-router-dom'
import Modal from '../Modal'
import InvalidReferralLinkContent from './InvalidReferralLinkContent'

interface InvalidReferralLinkModalProps {
  isOpen: boolean
}

const InvalidReferralLinkModal = ({
  isOpen,
}: InvalidReferralLinkModalProps) => {
  const location = useLocation()
  const onDismiss = () => {
    const outputParam = new URLSearchParams(location.search).get('output')
    window.location.href = `/#/swap?output=${outputParam}`
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <InvalidReferralLinkContent onDismiss={onDismiss} />
    </Modal>
  )
}

export default InvalidReferralLinkModal