import React, { useCallback, useState } from 'react'
import { HelpCircle as Question } from 'react-feather'
import styled from 'styled-components'
import Tooltip from '../Tooltip'

interface IP {
  isGray: boolean
}
const QuestionWrapper = styled.div<IP>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.sidebarColor};
  >svg {
    width:20px;height: 20px;
  }
  :hover,
  :focus {
    opacity: 0.7;
  }
`

export default function QuestionHelper({ text, isGray = false }: { text: string; isGray?: boolean }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close} isGray={isGray}>
          <Question size={16} />
        </QuestionWrapper>
      </Tooltip>
    </span>
  )
}
