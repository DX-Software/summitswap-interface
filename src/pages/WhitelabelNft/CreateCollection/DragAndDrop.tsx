import { Box, Input, lightColors, SvgProps, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'

const DropBoxWrapper = styled.div`
  position: relative;
  width: 225px;
  height: 200px;
`

const DropBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  color: white;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1.5em;
  border: 3px dashed ${({ color, theme }) => color || theme.colors.primary};
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
  icon?: React.ReactNode
  name: string
  color?: string
  multiple?: boolean
  accept: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  children: React.ReactNode
}

export default function DragAndDrop({ icon, name, color, multiple, accept, handleChange, children }: DragAndDropProps) {
  return (
    <DropBoxWrapper>
      <DropBox color={color}>
        <Box>{icon}</Box>
        <Text color={color}>{children}</Text>
      </DropBox>
      <DropBoxInput type="file" name={name} multiple={multiple} accept={accept} onChange={handleChange} />
    </DropBoxWrapper>
  )
}

DragAndDrop.defaultProps = {
  color: lightColors.primary,
}
