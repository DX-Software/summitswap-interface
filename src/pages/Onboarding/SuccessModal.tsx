import React from 'react'
import { Modal } from '@koda-finance/summitswap-uikit'

export default function MoonPayModal({ title, onDismiss }: { title: string; onDismiss?: any }) {
  return (
    <Modal title={title} onDismiss={onDismiss} bodyPadding="30px">
      <p>Successfully submitted application</p>
    </Modal>
  )
}
