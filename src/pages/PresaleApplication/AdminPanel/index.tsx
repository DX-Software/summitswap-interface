import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Pagination } from '@mui/material'
import { useFactoryPresaleContract } from 'hooks/useContract'
import { RowFixed } from 'components/Row'
import { PRESALES_PER_PAGE_ADMIN_PANEL } from 'constants/presale'
import {
  Flex,
  Box,
  Text,
  NavTab,
  darkColors,
  Breadcrumbs,
  ArrowBackIcon,
  ChevronRightIcon,
} from '@koda-finance/summitswap-uikit'
import HeadingCotainer, { StyledText } from './HeadingContainer'
import { usePaginationStyles } from '../Presale/Shared'
import PresaleDetail from './PresaleDetails'
import PresaleSettings from './PresaleSettings'
import PresaleSummary from '../PresaleSummary'
import EditPresale from './EditPresale'

const ContentWrapper = styled(Box)`
  max-width: 90%;
  width: 950px;
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

export const Heading = styled(Text)`
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

const PaginationWrapper = styled.div`
  position: fixed;
  right: 1;
`
const TableCard = styled(Box)`
  background: ${({ theme }) => theme.colors.dropdownBackground};
  padding: 12px 18px;
  border-radius: 8px;
`

const AdminPanel = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [pagePendingPresales, setPagePendingPresales] = useState(1)
  const [pageApprovedPresales, setPageApprovedPresales] = useState(1)
  const [pendingPresales, setPendingPresales] = useState<string[]>([])
  const [approvedPresales, setApprovedPresales] = useState<string[]>([])
  const [selectedPresale, setSelectedPresale] = useState('')
  const [isEditMode, setEditMode] = useState(false)

  const paginationStyle = usePaginationStyles()
  const factoryContract = useFactoryPresaleContract()

  useEffect(() => {
    async function fetchPresales() {
      setPendingPresales(await factoryContract?.getPendingPresales())
      setApprovedPresales(await factoryContract?.getApprovedPresales())
    }
    if (factoryContract) {
      fetchPresales()
    }
  }, [factoryContract])

  const handleEditButtonHandler = (isEdit: boolean) => setEditMode(isEdit)
  const handleChangeTabIndex = (newIndex: number) => setTabIndex(newIndex)
  const changePendingPageHandler = (_: React.ChangeEvent<unknown>, value: number) => setPagePendingPresales(value)
  const changeApprovedPageHandler = (_: React.ChangeEvent<unknown>, value: number) => setPageApprovedPresales(value)
  const selectPresaleHandler = (presaleAddress: string) => setSelectedPresale(presaleAddress)

  const getSlicedAddress = useCallback((addresses: string[], pageNum: number) => {
    const startIndex = pageNum * PRESALES_PER_PAGE_ADMIN_PANEL - PRESALES_PER_PAGE_ADMIN_PANEL
    const endIndex =
      startIndex + PRESALES_PER_PAGE_ADMIN_PANEL > addresses.length
        ? addresses.length
        : startIndex + PRESALES_PER_PAGE_ADMIN_PANEL
    return addresses.slice(startIndex, endIndex)
  }, [])

  const sectionTexts = ['Waiting for Approval', 'Approved Presales']
  const chooseSection = () => {
    switch (tabIndex) {
      case 0:
        return (
          <>
            <TableCard marginTop="24px">
              <HeadingCotainer />
              <Divider bottomOnly />
              {getSlicedAddress(pendingPresales, pagePendingPresales).map((address) => (
                <Box key={address}>
                  <PresaleDetail selectPresaleHandler={selectPresaleHandler} presaleAddress={address} />
                </Box>
              ))}
            </TableCard>
          </>
        )
      case 1:
        return (
          <>
            <TableCard marginTop="24px">
              <HeadingCotainer />
              <Divider bottomOnly />
              {getSlicedAddress(approvedPresales, pageApprovedPresales).map((address) => (
                <Box key={address}>
                  <PresaleDetail selectPresaleHandler={selectPresaleHandler} presaleAddress={address} />
                </Box>
              ))}
            </TableCard>
          </>
        )
      case 2:
        return <PresaleSettings />
      default:
        return <></>
    }
  }

  return (
    <ContentWrapper overflow={isEditMode || selectedPresale ? 'visible' : 'scroll'}>
      <Box width={selectedPresale || '950px'}>
        {selectedPresale ? (
          <>
            <Breadcrumbs separator={<ChevronRightIcon color={darkColors.textDisabled} width="20px" />}>
              <StyledText style={{ cursor: 'pointer' }} onClick={() => setSelectedPresale('')} color="primaryDark">
                Admin Panel
              </StyledText>
              <StyledText style={{ cursor: 'pointer' }} onClick={() => setSelectedPresale('')} color="primaryDark">
                {sectionTexts[tabIndex]}
              </StyledText>
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
            {isEditMode ? (
              <EditPresale presaleAddress={selectedPresale} handleEditButtonHandler={handleEditButtonHandler} />
            ) : (
              <PresaleSummary presaleAddress={selectedPresale} handleEditButtonHandler={handleEditButtonHandler} />
            )}
          </>
        ) : (
          <>
            <NavTab activeIndex={tabIndex} onItemClick={handleChangeTabIndex}>
              <StyledText>
                {sectionTexts[0]} ({pendingPresales.length})
              </StyledText>
              <StyledText>{sectionTexts[1]}</StyledText>
              <StyledText>Presale Settings</StyledText>
            </NavTab>
            <Divider bottomOnly />
            {chooseSection()}
          </>
        )}
      </Box>
      {!selectedPresale && tabIndex !== 2 && (
        <Flex marginTop="24px" justifyContent="end">
          <PaginationWrapper>
            {tabIndex === 0 && (
              <Pagination
                sx={paginationStyle}
                variant="outlined"
                shape="rounded"
                count={Math.ceil(pendingPresales.length / PRESALES_PER_PAGE_ADMIN_PANEL)}
                page={pagePendingPresales}
                onChange={changePendingPageHandler}
              />
            )}
            {tabIndex === 1 && (
              <Pagination
                sx={paginationStyle}
                variant="outlined"
                shape="rounded"
                count={Math.ceil(approvedPresales.length / PRESALES_PER_PAGE_ADMIN_PANEL)}
                page={pageApprovedPresales}
                onChange={changeApprovedPageHandler}
              />
            )}
          </PaginationWrapper>
        </Flex>
      )}
    </ContentWrapper>
  )
}

export default AdminPanel
