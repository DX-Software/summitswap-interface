import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled, { useTheme } from 'styled-components'
import { Pagination } from '@mui/material'
import { useFactoryPresaleContract } from 'hooks/useContract'
import { RowFixed } from 'components/Row'
import { PRESALE_FACTORY_ADDRESS, PRESALES_PER_PAGE_ADMIN_PANEL } from 'constants/presale'
import {
  Flex,
  Box,
  Text,
  TabPresale,
  darkColors,
  Breadcrumbs,
  ArrowBackIcon,
  ChevronRightIcon,
} from '@koda-finance/summitswap-uikit'
import HeadingCotainer, { StyledText } from './HeadingContainer'
import PresaleDetail from './PresaleDetails'
import PresaleSettings from './PresaleSettings'
import PresaleSummary from './PresaleSummary'

const ContentWrapper = styled(Box)`
  max-width: 90%;
  margin: 0 auto;
  margin-top: 24px;
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
  const [selectedPresale, setSelectedPresale] = useState('')

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
  const selectPresaleHandler = (presaleAddress: string) => setSelectedPresale(presaleAddress)

  const sectionTexts = ['Waiting for Approval', 'Approval History']
  const chooseSection = useCallback((slicedPresaleAddresses: string[], index: number) => {
    switch (index) {
      case 0:
        return (
          <>
            <HeadingCotainer />
            <Divider bottomOnly />
            {slicedPresaleAddresses.map((address) => (
              <Box key={address}>
                <PresaleDetail selectPresaleHandler={selectPresaleHandler} presaleAddress={address} />
                <Divider />
              </Box>
            ))}
          </>
        )
      case 2:
        return <PresaleSettings />
      default:
        return <></>
    }
  }, [])

  const startIndex = page * PRESALES_PER_PAGE_ADMIN_PANEL - PRESALES_PER_PAGE_ADMIN_PANEL
  const endIndex =
    startIndex + PRESALES_PER_PAGE_ADMIN_PANEL > pendingPresales.length
      ? pendingPresales.length
      : startIndex + PRESALES_PER_PAGE_ADMIN_PANEL
  const slicedPresaleAddresses = pendingPresales.slice(startIndex, endIndex)

  return (
    <ContentWrapper overflow={tabIndex === 2 && !selectedPresale ? 'visible' : 'scroll'}>
      <Box width={selectedPresale || '950px'}>
        {selectedPresale ? (
          <>
            <Breadcrumbs separator={<ChevronRightIcon color={darkColors.textDisabled} width="20px" />}>
              <StyledText color="primaryDark">Admin Panel</StyledText>
              <StyledText color="primaryDark">{sectionTexts[tabIndex]}</StyledText>
              <StyledText bold>Presale Details</StyledText>
            </Breadcrumbs>
            <Box marginBottom="8px" />
            <Divider bottomOnly />
          </>
        ) : (
          <Heading>Admin Panel</Heading>
        )}
        {selectedPresale ? (
          <>
            <RowFixed marginY="24px">
              <ArrowBackIcon color="linkColor" />
              <Text
                color="linkColor"
                marginLeft="8px"
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => selectPresaleHandler('')}
              >
                Back To Admin Panel
              </Text>
            </RowFixed>
            <PresaleSummary presaleAddress={selectedPresale} />
          </>
        ) : (
          <>
            <TabPresale activeIndex={tabIndex} onItemClick={handleChangeTabIndex}>
              <StyledText>
                {sectionTexts[0]} ({pendingPresales.length})
              </StyledText>
              <StyledText>{sectionTexts[1]}</StyledText>
              <StyledText>Presale Settings</StyledText>
            </TabPresale>
            <Divider bottomOnly />
            {chooseSection(slicedPresaleAddresses, tabIndex)}
          </>
        )}
      </Box>
      {!selectedPresale && tabIndex !== 2 && (
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
      )}
    </ContentWrapper>
  )
}

export default AdminPanel
