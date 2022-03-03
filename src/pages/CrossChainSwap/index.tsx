import React, { useEffect } from 'react'
import styled from 'styled-components'
import { rubicConfiguration } from './config'
import AppBody from '../AppBody'

const RubicWrapper = styled.div`
  overflow: hidden;

  iframe {
    height: 825px;
    width: min(600px, 100%);
    box-shadow: none !important;
  }
`

export default function CrossChainSwap() {
  useEffect(() => {
    rubicWidget.init(rubicConfiguration)
  }, [])

  return (
    <AppBody>
      <RubicWrapper id="rubic-widget-root" />
    </AppBody>
  )
}
