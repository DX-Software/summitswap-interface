import React, { useMemo } from 'react'
import { Pagination as PaginationMui } from '@mui/material'
import { useTheme } from 'styled-components'
import { darkColors } from '@koda-finance/summitswap-uikit'

type Props = {
  maxPage: number
  page: number
  onPageChange: React.Dispatch<React.SetStateAction<number>>
}

function Pagination({ maxPage, page, onPageChange }: Props) {
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

  return (
    <PaginationMui
      variant="outlined"
      shape="rounded"
      sx={paginationStyle}
      count={maxPage}
      page={page}
      onChange={(_, value: number) => onPageChange(value)}
    />
  )
}

export default React.memo(Pagination)
