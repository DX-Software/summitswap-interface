import React from 'react'
import { Text, Button, useModal, Modal } from '@koda-finance/summitswap-uikit'

type ClaimingFeeProps = {
  symbol: string
  onConfirm?: () => void
}

export const Fees = {
  BNB: 10,
  BUSD: 15,
} as Record<string, number>

export function useClaimingFeeModal({ symbol, onConfirm }: ClaimingFeeProps): [() => void, () => void] {
  const modalHandlers = useModal(
    <Modal title="Claiming Fee">
      <Text>
        You are claiming in {symbol}! Claiming fee is {Fees[symbol]}%.
      </Text>
      <Text marginBottom="30px" textAlign="center">
        Claim in KAPEX to avoid paying for fees.
      </Text>
      <Button scale="md" onClick={onConfirm} style={{ fontWeight: 800, fontSize: 18 }}>
        CONFIRM
      </Button>
    </Modal>
  )

  return modalHandlers
}
