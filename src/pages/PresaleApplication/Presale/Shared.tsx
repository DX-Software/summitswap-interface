import { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import { Box, Text, darkColors } from '@koda-finance/summitswap-uikit'

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

export const usePaginationStyles = () => {
  const theme = useTheme()
  const paginationStyle = useMemo(
    () => ({
      '& .MuiPaginationItem-root': {
        color: theme.colors.sidebarActiveColor,
        background: theme.colors.inputColor,
      },
      '& .MuiPaginationItem-ellipsis': {
        background: 'none',
      },
      '& .Mui-selected': {
        color: theme.colors.sidebarColor,
        background: `${theme.colors.primary} !important`,
        fontWeight: '700',
      },
      '& .Mui-disabled': {
        background: darkColors.textDisabled,
        color: theme.colors.textSubtle,
        opacity: '1 !important',
      },
    }),
    [theme.colors]
  )
  return paginationStyle
}
