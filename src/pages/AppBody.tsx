import React from 'react'
import styled from 'styled-components'
import { Card } from '@koda-finance/summitswap-uikit'

export const BodyWrapper = styled(Card)`
  position: relative;
  width: 85%;
  @media (min-width: 500px) {
    width: 436px;
  }
  // height: 100%;
  z-index: 5;
  border-radius: unset;
  background: none;
  overflow: visible;
`

interface AppBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, ...props }: AppBodyProps) {
  return <BodyWrapper {...props}>{children}</BodyWrapper>
}
