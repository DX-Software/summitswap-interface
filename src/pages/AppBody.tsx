import React from 'react'
import styled from 'styled-components'
import { Card } from '@summitswap-uikit'

export const BodyWrapper = styled(Card)`
  position: relative;
  width: 85%;
  @media (min-width:500px) {
    width: 436px;
  }
  // height: 100%;
  z-index: 5;
  border-radius: unset;
  background: none;
  overflow: visible;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
