import React from 'react'
import { InjectedModalProps, Modal } from '@summitswap/uikit'

interface CustomModalProps extends InjectedModalProps {
  title: string
}

const MoonpayModal: React.FC<CustomModalProps> = ({ title, onDismiss }) => (
  <Modal title={title} onDismiss={onDismiss} bodyPadding='10px'>
    <iframe
      allow="accelerometer; autoplay; camera; gyroscope; payment"
      frameBorder="0"
      height="600px"
      src="https://buy.moonpay.io?apiKey=pk_live_iPAKlFahWageWmf0LL4MjAWONzg55u&currencyCode=bnb_bsc&colorCode=%232ba55d"
      title="moonpay"
      style={{ borderRadius: "20px"}}
    >
      <p>Your browser does not support iframes.</p>
    </iframe>
  </Modal>
)

export default MoonpayModal;
