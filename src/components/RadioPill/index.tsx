import { Button, ButtonProps } from '@koda-finance/summitswap-uikit'
import React from 'react'

type Props = ButtonProps & {
  onClick?: () => void
  checked?: boolean
  children: React.ReactNode
}

function RadioPill({ onClick, checked, children, variant, ...props }: Props) {
  return (
    <Button scale="sm" variant={!checked ? 'secondary' : variant} {...props} onClick={onClick}>
      {children}
    </Button>
  )
}

export default React.memo(RadioPill)

RadioPill.defaultProps = {
  checked: false,
}
