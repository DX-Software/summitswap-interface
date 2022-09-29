import { Box, Tag, TagProps } from '@koda-finance/summitswap-uikit'
import React from 'react'

type Props = TagProps & {
  onClick?: () => void
  checked?: boolean
  children: React.ReactNode
}

function RadioPill({ onClick, checked, children, ...props }: Props) {
  return (
    <Box display="inline-block" onClick={onClick} style={{ cursor: 'pointer' }}>
      <Tag bold {...props} outline={!checked}>
        {children}
      </Tag>
    </Box>
  )
}

export default React.memo(RadioPill)

RadioPill.defaultProps = {
  checked: false,
}
