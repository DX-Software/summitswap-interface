import { Text } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'

export const HelperText = styled(Text)`
  color: ${({ theme, color }) => theme.colors[color || 'textSubtle']};
  font-size: ${({ fontSize }) => fontSize};
  font-family: 'Poppins';
`

HelperText.defaultProps = {
  color: 'textSubtle',
  fontSize: '14px',
}

export const DescriptionText = styled(Text)`
  margin-bottom: 16px;
  white-space: break-spaces;

  @media (max-width: 576px) {
    margin-bottom: 8px;
    font-size: 14px;
  }
`

type StockTextProps = {
  children: React.ReactNode
}

export function StockText({ children }: StockTextProps) {
  return (
    <HelperText>
      Stock of{' '}
      <HelperText bold color="linkColor" style={{ display: 'inline-block' }}>
        {children}
      </HelperText>{' '}
      NFT(s) available
    </HelperText>
  )
}
