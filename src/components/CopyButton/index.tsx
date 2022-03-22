import React, { useState } from 'react'
import { CopyIcon, SvgProps } from '@koda-finance/summitswap-uikit'
import  copyText  from 'utils/copyText'
import styled from 'styled-components'

const Tooltip = styled.div<{
  isTooltipDisplayed: boolean
  tooltipTop: number
  tooltipRight?: number
  tooltipFontSize?: number
}>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline' : 'none')};
  position: absolute;
  padding: 8px;
  top: ${({ tooltipTop }) => `${tooltipTop}px`};
  right: ${({ tooltipRight }) => (tooltipRight ? `${tooltipRight}px` : 0)};
  text-align: center;
  font-size: ${({ tooltipFontSize }) => `${tooltipFontSize}px` ?? '100%'};
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  width: max-content;
`

interface CopyButtonProps extends SvgProps {
  text: string 
  tooltipMessage: string
  tooltipTop: number
  tooltipRight?: number
  tooltipFontSize?: number
  buttonColor?: string
}

export  default function CopyButton ({
  text,
  tooltipMessage,
  width,
  tooltipTop,
  tooltipRight,
  tooltipFontSize,
  // buttonColor = 'primary',
  ...props
} :CopyButtonProps){
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  const displayTooltip = () => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }
  return (
    <>
      <CopyIcon
        style={{ cursor: 'pointer' }}
        color='primary'
        width={width}
        onClick={() => copyText(text, displayTooltip)}
        {...props}
      />
      <Tooltip
        isTooltipDisplayed={isTooltipDisplayed}
        tooltipTop={tooltipTop}
        tooltipRight={tooltipRight}
        tooltipFontSize={tooltipFontSize}
      >
        {tooltipMessage}
      </Tooltip>
    </>
  )
}
