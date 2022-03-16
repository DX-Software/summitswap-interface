import React from 'react'
import { useModal, Modal } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import QRCode from 'react-qr-code'

const Wrapper = styled.div`
  background: white;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function useReferralLinkQrModal(referralLink: string): [() => void, () => void] {
  const modalHandlers = useModal(
    <Modal title="Referral Link">
      <Wrapper>
        <QRCode value={referralLink} />
      </Wrapper>
    </Modal>
  )

  return modalHandlers
}
