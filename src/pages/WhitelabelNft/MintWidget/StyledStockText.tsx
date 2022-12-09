import { lighten } from '@mui/material'
import React from 'react'
import { HelperText } from '../shared/Text'

function StyledStockText({ color, children }: { color: string; children: number }) {
  return (
    <HelperText color="default">
      Stock of{' '}
      <HelperText bold color={lighten(color, 0.4)} style={{ display: 'inline-block' }}>
        {children}
      </HelperText>{' '}
      NFT{children > 1 ? 's' : ''} available
    </HelperText>
  )
}

export default React.memo(StyledStockText)
