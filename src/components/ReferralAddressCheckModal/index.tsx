import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, Flex, Text } from '@koda-finance/summitswap-uikit'
import { AlertTriangle } from 'react-feather'
import Modal from '../Modal'
import { AutoRow} from '../Row'
import { AutoColumn } from '../Column'

const WarningContainer = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 1rem;
  background: rgba(242, 150, 2, 0.05);
  border-radius: 20px;
  overflow: auto;
`

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: ${({ theme }) => theme.colors.failure};`

export default function ReferralAddressCheckModal({
    isOpen,
    onConfirm,
  }: {
    isOpen: boolean
    onConfirm: () => void
  }) {
   
  
    const handleDismiss = useCallback(() => null, [])
    return (
      <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
        <WarningContainer className="warning-container">
          <AutoColumn gap="lg">
            <Flex justifyContent="center">
            <AutoRow gap="6px">
              <StyledWarningIcon />
              <Text color="failure">Wrong Referral Link </Text>
            </AutoRow>
              <Button
              disabled={!isOpen}
                variant="danger"
                style={{ width: '140px' }}
                onClick={() => {
                  
                  onConfirm()
                }}
              >
                OK
              </Button>
            </Flex>
        
        
          </AutoColumn>
        </WarningContainer>
      </Modal>
    )
  }