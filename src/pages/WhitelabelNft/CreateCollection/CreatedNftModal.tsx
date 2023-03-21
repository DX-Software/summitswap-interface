import { Box, CheckmarkCircleIcon, Flex, Heading, InjectedModalProps, Modal, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled(Box)`
  max-width: 420px;
`

const CheckIcon = styled(CheckmarkCircleIcon)`
  width: 120px;

  @media (max-width: 576px) {
    width: 72px;
  }
`

const StyledText = styled(Text)`
  font-size: 16px;
  max-width: 340px;
  text-align: center;
  display: inline-block;

  @media (max-width: 576px) {
    font-size: 14px;
  }
`

const CreatedNftModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  return (
    <Wrapper>
      <Modal title="" onDismiss={onDismiss} hideSeparator>
        <Flex flexDirection="column" alignItems="center" marginTop="-64px">
          <Heading color="primary" size="lg" marginBottom="16px">Create Success</Heading>
          <CheckIcon />
          <StyledText marginY="16px">You have successfully created NFT Collection</StyledText>
        </Flex>
      </Modal>
    </Wrapper>
  )
}

export default React.memo(CreatedNftModal)
