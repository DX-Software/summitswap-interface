import React from 'react'
import { Modal } from '@koda-finance/summitswap-uikit'

export default function MoonPayModal({ title, onDismiss, text }: { title: string; onDismiss?: any; text: string }) {
  return (
    <Modal title={title} onDismiss={onDismiss} bodyPadding="30px">
      <p>{text}</p>
    </Modal>
  )
}
