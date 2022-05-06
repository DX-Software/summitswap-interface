import React, { useState } from 'react'
import { Text, Checkbox, Button } from '@koda-finance/summitswap-uikit'
import Modal from '@mui/material/Modal'
import { utils } from 'ethers'
import styled from 'styled-components'
import { Deposit } from './types'
import { KODA } from '../../constants'

type SettingsModalProps = {
  open: boolean
  handleClose?: () => void
  onConfirm?: () => void
  deposit?: Deposit
}

const ModalContainer = styled.div`
  position: absolute;
  inset: 0 0 0 0;
  background-color: #452a7a99;
  pointer-events: none;
`

const ModalBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400;
  background-color: #000f18;
  padding: 30px;
  border-radius: 20px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
`

export default function PenaltyWithdrawModal({ open, handleClose, onConfirm, deposit }: SettingsModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        <ModalContainer />

        <ModalBox>
          <Text fontSize="25px">WARNING</Text>
          <Text color="red" fontSize="20px">
            DO NOT PROCEED UNLESS YOU UNDERSTAND THE FOLLOWING
          </Text>

          <br />

          {deposit && (
            <p>
              By removing your stake there is a penalty of{' '}
              <span style={{ color: 'red' }}>{deposit.penalty / 100}%</span> of staked KODA which is{' '}
              <span style={{ color: 'red' }}>
                {utils.formatUnits(deposit.amount.mul(deposit.penalty).div(10000), KODA.decimals)}{' '}
              </span>
              <b>KODA</b>
            </p>
          )}

          <br />
          <br />

          <ButtonContainer>
            <p>
              <Checkbox
                id="agree"
                scale="sm"
                checked={isConfirmed}
                onChange={(o) => setIsConfirmed(o.target.checked)}
                style={{ border: '1px solid #452a7a' }}
              />
              &nbsp; I&#8216;m aware of the consequnces
            </p>

            <ButtonsWrapper>
              <Button disabled={!isConfirmed} onClick={onConfirm}>
                CONFIRM
              </Button>
              <Button onClick={handleClose}>CANCEL</Button>
            </ButtonsWrapper>
          </ButtonContainer>
        </ModalBox>
      </>
    </Modal>
  )
}
