import styled from 'styled-components'
import { Box, Text } from '@koda-finance/summitswap-uikit'

export const Divider = styled(Box)<{ infoDivider?: boolean }>`
  width: 100%;
  max-width: 950px;
  height: 0px;
  border-bottom: ${({ infoDivider }) => (infoDivider ? '8px' : '1px')} solid ${({ theme }) => theme.colors.inputColor};
`

export const StyledText = styled(Text)`
  word-wrap: break-word;
  word-break: break-word;
  font-size: ${({ fontSize }) => fontSize || '16px'};
  @media (max-width: 480px) {
    font-size: ${({ fontSize }) => `calc(${fontSize} - 2px)` || '14px'};
  }
`

export const DetailText = styled(Text)`
  min-width: fit-content;
  margin-right: 15px;
  font-size: 16px;
  @media (max-width: 480px) {
    font-size: 12px;
    font-size: ${({ fontSize }) => `calc(${fontSize} - 4px)` || '14px'};
  }
`
export const DetailTextValue = styled(Text)`
  word-wrap: break-word;
  word-break: break-word;
  text-align: right;
  font-size: 16px;
  @media (max-width: 480px) {
    font-size: 12px;
    font-size: ${({ fontSize }) => `calc(${fontSize} - 4px)` || '14px'};
  }
`