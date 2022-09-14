import { InjectedModalProps, Modal } from '@koda-finance/summitswap-uikit'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getConcealImageUrl } from 'utils/whitelabelNft'

const StyledImage = styled.img`
  max-width: 350px;
`

interface ConcealModalProps extends InjectedModalProps {
  title: string
  src?: File
}

const ConcealModal: React.FC<ConcealModalProps> = ({ title, src, onDismiss }) => {
  const previewImage = useMemo(() => {
    if (src) {
      return URL.createObjectURL(src)
    }
    return getConcealImageUrl()
  }, [src])

  return (
    <Modal title={title} onDismiss={onDismiss}>
      <StyledImage src={previewImage} alt="Conceal NFT" />
    </Modal>
  )
}

export default React.memo(ConcealModal)
