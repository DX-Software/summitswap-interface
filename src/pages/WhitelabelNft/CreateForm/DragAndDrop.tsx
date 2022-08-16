import React from 'react'
import { Input } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'

const DropBoxWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
`

const DropBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  color: white;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1.5em;
  border-width: 2px;
  border-style: dotted;
  border-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
`
const DropBoxInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`

type DragAndDropProps = {
  name: string
  multiple?: boolean
  accept: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  children: React.ReactNode
}

export default function DragAndDrop({ name, multiple, accept, handleChange, children }: DragAndDropProps) {
  return (
    <DropBoxWrapper>
      <DropBox>{children}</DropBox>
      <DropBoxInput type="file" name={name} multiple={multiple} accept={accept} onChange={handleChange} />
    </DropBoxWrapper>
  )
}
