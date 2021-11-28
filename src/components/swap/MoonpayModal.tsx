import React from 'react'
import { InjectedModalProps, Modal } from '@summitswap-uikit'

interface CustomModalProps extends InjectedModalProps {
  title: string
}

const MoonpayModal: React.FC<CustomModalProps> = ({ title, onDismiss }) => (
  <Modal title={title} onDismiss={onDismiss}>
    <iframe
      allow="accelerometer; autoplay; camera; gyroscope; payment"
      frameBorder="0"
      height="500px"
      src="https://buy-staging.moonpay.io?apiKey=pk_test_8Bcd681qwwNHY7tgDwZbiYWlA89EEl&currencyCode=eth&colorCode=%232ba55d"
      width="400px"
      title="moonpay"
      style={{borderRadius: "20px"}}
    >
      <p>Your browser does not support iframes.</p>
    </iframe>
  </Modal>
)

export default MoonpayModal;
