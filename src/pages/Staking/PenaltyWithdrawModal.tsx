import React, { useState, useEffect } from 'react'
import { Text, Checkbox, Button } from '@koda-finance/summitswap-uikit'
import Modal from '@mui/material/Modal'
import { BigNumber, utils } from 'ethers'
import styled from 'styled-components'
import { STATUSES } from 'constants/staking'
import { Deposit } from './types'
import { KODA } from '../../constants'

type SettingsModalProps = {
  open: boolean
  handleClose?: () => void
  onConfirm?: () => void
  deposit?: Deposit
  status?: BigNumber
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
  width: 800px;
  max-width: 95%;
  background-color: #000f18;
  padding: 30px;
  border-radius: 20px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
`

export default function PenaltyWithdrawModal({ open, handleClose, onConfirm, deposit, status }: SettingsModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)

  useEffect(() => {
    if (deposit?.penalty) {
      setIsConfirmed(false)
    } else if (deposit?.bonus) {
      setIsConfirmed(true)
    }
  }, [deposit, open])

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        <ModalContainer />

        <ModalBox>
          <Text fontSize="25px">WARNING</Text>

          {!!deposit?.penalty && (
            <>
              <Text color="red" fontSize="20px">
                DO NOT PROCEED UNLESS YOU UNDERSTAND THE FOLLOWING
              </Text>
              <br />
              <p>
                By removing your stake there is a penalty of{' '}
                <span style={{ color: 'red' }}>{deposit.penalty / 100}%</span> of staked KODA which is{' '}
                <span style={{ color: 'red' }}>
                  {utils.formatUnits(deposit.amount.mul(deposit.penalty).div(10000), KODA.decimals)}{' '}
                </span>
                <b>KODA</b>
              </p>
            </>
          )}

          {!!deposit?.bonus && status && STATUSES[+status] && (
            <>
              <br />
              <p>Note: *Bonus is for {STATUSES[+status]} members and itsn&apos;t withdrawable</p>
            </>
          )}

          <br />
          <br />

          <ButtonContainer>
            <div>
              {!!deposit?.penalty && !deposit?.bonus && (
                <p>
                  <Checkbox
                    id="agree"
                    scale="sm"
                    checked={isConfirmed}
                    onChange={(o) => setIsConfirmed(o.target.checked)}
                    style={{ border: '1px solid #452a7a' }}
                  />
                  &nbsp; I&#8216;m aware of the consequences
                </p>
              )}
            </div>

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
