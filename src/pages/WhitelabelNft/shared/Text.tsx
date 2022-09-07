import { lightColors, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'

export function Title({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize="40px" fontFamily="Poppins" bold mb="8px">
      {children}
    </Text>
  )
}

export function SubTitle({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <Text fontSize="24px" fontFamily="Poppins" bold mb="8px" color={color}>
      {children}
    </Text>
  )
}

export const HelperText = styled(Text)`
  color: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize};
  font-family: 'Poppins';
`

HelperText.defaultProps = {
  color: lightColors.textSubtle,
  fontSize: '14px',
}
