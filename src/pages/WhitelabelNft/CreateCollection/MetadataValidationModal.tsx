import { CloseIcon, Flex, InjectedModalProps, Modal, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'

const ErrorWrapper = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  overflow: auto;
  max-width: 500px;
  height: 260px;
  padding-right: 32px;
  padding-bottom: 16px;
`

const ErrorCard = styled(Flex)`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.failure};
  border-radius: 4px;
  align-items: center;
`

const CloseCircleIcon = styled(CloseIcon)`
  background-color: ${({ theme }) => theme.colors.default};
  border-radius: 50%;
  margin-right: 8px;
  padding: 2px;
`

interface Props extends InjectedModalProps {
  title: string
  errors?: string[]
}

const MetadataValidationModal: React.FC<Props> = ({ title, errors, onDismiss }) => {
  return (
    <Modal title={title} onDismiss={onDismiss}>
      <ErrorWrapper>
        {errors?.map((error) => (
          <ErrorCard>
            <CloseCircleIcon color='failure' width={16} />
            <Text fontSize="14px">{error}</Text>
          </ErrorCard>
        ))}
      </ErrorWrapper>
    </Modal>
  )
}

export default React.memo(MetadataValidationModal)
