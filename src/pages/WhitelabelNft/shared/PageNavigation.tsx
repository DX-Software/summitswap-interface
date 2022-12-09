import { ArrowBackIcon, ArrowForwardIcon, Button, darkColors, Flex } from '@koda-finance/summitswap-uikit'
import { useMediaQuery } from '@mui/material'
import React, { useMemo } from 'react'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.inputColor} !important;
  color: ${({ theme }) => theme.colors.sidebarActiveColor};
  box-shadow: none;

  :disabled {
    background: ${darkColors.textDisabled} !important;
    color: ${({ theme }) => theme.colors.textSubtle};
    opacity: 1;
  }
`

type Props = {
  maxPage: number
  page: number
  hasNextPage: boolean | undefined
  handlePrevPage: React.Dispatch<React.SetStateAction<number>>
  handleNextPage: React.Dispatch<React.SetStateAction<number>>
}

function PageNavigation({ maxPage, page, hasNextPage, handlePrevPage, handleNextPage }: Props) {
  const isMobileView = useMediaQuery('(max-width: 576px)')

  const isPrevDisable = useMemo(() => page === 0, [page])
  const isNextDisable = useMemo(() => {
    return hasNextPage === false && page === maxPage - 1
  }, [hasNextPage, maxPage, page])

  return (
    <Flex style={{ columnGap: '8px' }}>
      <StyledButton
        scale={isMobileView ? 'xs' : 'sm'}
        disabled={isPrevDisable}
        onClick={handlePrevPage}
        startIcon={<ArrowBackIcon color={isPrevDisable ? 'textSubtle' : 'sidebarActiveColor'} />}
      >
        Previous
      </StyledButton>
      <StyledButton
        scale={isMobileView ? 'xs' : 'sm'}
        disabled={isNextDisable}
        onClick={handleNextPage}
        endIcon={<ArrowForwardIcon color={isNextDisable ? 'textSubtle' : 'sidebarActiveColor'} />}
      >
        Next
      </StyledButton>
    </Flex>
  )
}
export default React.memo(PageNavigation)
