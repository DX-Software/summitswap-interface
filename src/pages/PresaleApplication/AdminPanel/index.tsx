import React, { useEffect, useState, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import { Pagination } from '@mui/material'
import { useFactoryPresaleContract } from 'hooks/useContract'
import { PRESALE_FACTORY_ADDRESS, PRESALES_PER_PAGE_ADMIN_PANEL } from 'constants/presale'
import { Flex, Box, Text, TabPresale, darkColors } from '@koda-finance/summitswap-uikit'
import HeadingCotainer, { StyledText } from './HeadingContainer'
import PresaleDetail from './PresaleDetails'

const ContentWrapper = styled(Box)`
  max-width: 90%;
  margin: 0 auto;
  margin-top: 24px;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 1250px) {
    max-width: 95%;
  }
`

const Divider = styled.div<{ bottomOnly?: boolean }>`
  width: 100%;
  height: 0px;
  ${({ bottomOnly }) => (bottomOnly ? 'border-bottom' : 'border')}: 1px solid ${({ theme }) => theme.colors.inputColor};
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`

const Heading = styled(Text)`
  font-weight: 700;
  font-size: 40px;
  line-height: 44px;
  margin-bottom: 16px;
  @media (max-width: 852px) {
    font-size: 32px;
    line-height: 35px;
    margin-bottom: 8px;
  }
`

const AdminPanel = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [pendingPresales, setPendingPresales] = useState<string[]>([])

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

  const factoryContract = useFactoryPresaleContract(PRESALE_FACTORY_ADDRESS)

  useEffect(() => {
    async function fetchPendingPresale() {
      setPendingPresales(await factoryContract?.getPendingPresales())
    }
    if (factoryContract) {
      fetchPendingPresale()
    }
  }, [factoryContract])

  const handleChangeTabIndex = (newIndex: number) => setTabIndex(newIndex)
  const changePageHandler = (_: React.ChangeEvent<unknown>, value: number) => setPage(value)

  const startIndex = page * PRESALES_PER_PAGE_ADMIN_PANEL - PRESALES_PER_PAGE_ADMIN_PANEL
  const endIndex =
    startIndex + PRESALES_PER_PAGE_ADMIN_PANEL > pendingPresales.length
      ? pendingPresales.length
      : startIndex + PRESALES_PER_PAGE_ADMIN_PANEL
  const slicedPresaleAddresses = pendingPresales.slice(startIndex, endIndex)

  return (
    <ContentWrapper>
      <Box width="950px">
        <Heading>Admin Panel</Heading>
        <TabPresale activeIndex={tabIndex} onItemClick={handleChangeTabIndex}>
          <StyledText>Waiting for Approval ({pendingPresales.length})</StyledText>
          <StyledText>Approval History</StyledText>
          <StyledText>Presale Settings</StyledText>
        </TabPresale>
        <Divider bottomOnly />
        <HeadingCotainer />
        <Divider bottomOnly />
        {slicedPresaleAddresses.map((address) => (
          <Box key={address}>
            <PresaleDetail presaleAddress={address} />
            <Divider />
          </Box>
        ))}
      </Box>
      <Flex marginTop="24px" justifyContent="end">
        <Pagination
          sx={paginationStyle}
          variant="outlined"
          shape="rounded"
          count={Math.ceil(pendingPresales.length / PRESALES_PER_PAGE_ADMIN_PANEL)}
          page={page}
          onChange={changePageHandler}
        />
      </Flex>
    </ContentWrapper>
  )
}

export default AdminPanel
