/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Pagination } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useFactoryPresaleContract, usePresaleContracts } from 'hooks/useContract'
import { PRESALE_FACTORY_ADDRESS, PRESALES_PER_PAGE_ADMIN_PANEL } from 'constants/presale'
import {
  ArrowBackIcon,
  Breadcrumbs,
  ChevronRightIcon,
  Flex,
  Box,
  Text,
  TabPresale,
  SearchIcon,
  FilterIcon,
  ButtonMenu,
  ButtonMenuItem,
  darkColors,
  Select,
  Input,
} from '@koda-finance/summitswap-uikit'
import { RowFixed } from 'components/Row'
import { fetchPresaleInfo, checkSalePhase } from 'utils/presale'
import { isAddress } from 'utils'
import { usePaginationStyles } from '../Presale/Shared'
import { PresalePhases } from '../types'
import { Heading } from '../AdminPanel'
import PresaleCard from '../PresaleCard'
import Presale from '../Presale'

const ContentWrapper = styled(Box)`
  max-width: 950px;
  width: 100%;
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

const Divider = styled.div`
  width: 100%;
  height: 0px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputColor};
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`

const StyledText = styled(Text)`
  align-self: center;
  font-size: 16px;
  @media (max-width: 852px) {
    font-size: 14px;
  }
`

const ResonsiveFlex = styled(Flex)`
  justify-content: space-between;
  @media (max-width: 680px) {
    justify-content: center;
  }
`

const ALL_PRESALE_OPTION = {
  value: 'All Presales',
  label: 'Default (All)',
}

const PUBLIC_ONLY_OPTION = {
  value: 'Public',
  label: 'Public Only',
}

const WHITELIST_ONLY = {
  value: 'Whitelist',
  label: 'Whitelist Only',
}

const SelectWrapper = styled(Box)`
  width: 100%;
  max-width: 226px;
  margin-left: 16px;
  @media (max-width: 600px) {
    max-width: 150px;
    margin-left: 8px;
  }
  @media (max-width: 400px) {
    max-width: 35%;
    > div {
      > select {
        font-size: 10px;
        padding: 0 35px;
      }
      & :first-child {
        width: 10px;
      }
      > svg {
        width: 15px;
      }
    }
  }
`
const SearchInput = styled(Input)`
  background-color: ${({ theme }) => theme.colors.sidebarBackground} !important;
  margin-left: 8px;
  &:focus:not(:disabled) {
    box-shadow: 0 0;
  }
`
const LaunchPad = () => {
  const { account } = useWeb3React()

  const [buttonIndex, setButtonIndex] = useState(0)
  const [tabIndex, setTabIndex] = useState(0)
  const [selectedPresale, setSelectedPresale] = useState('')
  const [approvedPresales, setApprovedPresales] = useState<string[]>([])
  const [showAddresses, setShowAddresses] = useState<string[]>([])
  const [filteredAddresses, setFilteredAddresses] = useState<string[]>([])
  const [filter, setFilter] = useState(ALL_PRESALE_OPTION.value)
  const [browsePage, setBrowsePage] = useState(1)
  const [contributionPage, setContributionPage] = useState(1)

  const factoryContract = useFactoryPresaleContract(PRESALE_FACTORY_ADDRESS)
  const presaleContracts = usePresaleContracts(approvedPresales)
  const paginationStyles = usePaginationStyles()

  useEffect(() => {
    async function fetchPresales() {
      setApprovedPresales(await factoryContract?.getApprovedPresales())
    }
    if (factoryContract) fetchPresales()
  }, [factoryContract])

  useEffect(() => {
    if (!account) {
      setButtonIndex(0)
    }
  }, [account])

  const handleChangeTabIndex = (newIndex: number) => setTabIndex(newIndex)
  const viewPresaleHandler = (address: string) => setSelectedPresale(address)

  const sortLivePresales = useMemo(async () => {
    if (presaleContracts.length) {
      const comparableArray = await Promise.all(
        presaleContracts.map(async (contract) => {
          return {
            presaleInfo: await fetchPresaleInfo(contract),
            contributors: await contract?.getContributors(),
            presaleAddress: contract?.address,
          }
        })
      )
      return comparableArray
        .filter(
          (info) =>
            checkSalePhase(info.presaleInfo) === PresalePhases.PresalePhase &&
            (filter === ALL_PRESALE_OPTION.value
              ? true
              : filter === WHITELIST_ONLY.value
              ? info.presaleInfo.isWhitelistEnabled
              : !info.presaleInfo.isWhitelistEnabled) &&
            (buttonIndex === 1 ? info.presaleInfo.owner === account || info.contributors.includes(account) : true)
        )
        .sort((a, b) => a.presaleInfo.endPresaleTime.toNumber() - b.presaleInfo.endPresaleTime.toNumber())
        .map((obj) => obj.presaleAddress)
    }
    return []
  }, [presaleContracts, filter, buttonIndex, account])

  const sortUpComingPresales = useMemo(async () => {
    if (presaleContracts.length) {
      const comparableArray = await Promise.all(
        presaleContracts.map(async (contract) => {
          return {
            presaleInfo: await fetchPresaleInfo(contract),
            contributors: await contract?.getContributors(),
            presaleAddress: contract?.address,
          }
        })
      )
      return comparableArray
        .filter(
          (info) =>
            checkSalePhase(info.presaleInfo) === PresalePhases.PresaleNotStarted &&
            (filter === ALL_PRESALE_OPTION.value
              ? true
              : filter === WHITELIST_ONLY.value
              ? info.presaleInfo.isWhitelistEnabled
              : !info.presaleInfo.isWhitelistEnabled) &&
            (buttonIndex === 1 ? info.presaleInfo.owner === account || info.contributors.includes(account) : true)
        )
        .sort((a, b) => a.presaleInfo.startPresaleTime.toNumber() - b.presaleInfo.startPresaleTime.toNumber())
        .map((obj) => obj.presaleAddress)
    }
    return []
  }, [presaleContracts, filter, buttonIndex, account])

  const sortFinishedPresales = useMemo(async () => {
    if (presaleContracts.length) {
      const comparableArray = await Promise.all(
        presaleContracts.map(async (contract) => {
          return {
            presaleInfo: await fetchPresaleInfo(contract),
            contributors: await contract?.getContributors(),
            finaliseTime: (await contract?.startDateClaim()).toNumber(),
            presaleAddress: contract?.address,
          }
        })
      )
      return comparableArray
        .filter(
          (info) =>
            !(
              checkSalePhase(info.presaleInfo) === PresalePhases.PresaleNotStarted ||
              checkSalePhase(info.presaleInfo) === PresalePhases.PresalePhase
            ) &&
            (filter === ALL_PRESALE_OPTION.value
              ? true
              : filter === WHITELIST_ONLY.value
              ? info.presaleInfo.isWhitelistEnabled
              : !info.presaleInfo.isWhitelistEnabled) &&
            (buttonIndex === 1 ? info.presaleInfo.owner === account || info.contributors.includes(account) : true)
        )
        .sort((a, b) => {
          if (a.finaliseTime !== 0) {
            if (b.finaliseTime !== 0) {
              return a.finaliseTime - b.finaliseTime
            }
            return a.finaliseTime - b.presaleInfo.endPresaleTime.toNumber()
          }
          return a.presaleInfo.endPresaleTime.toNumber() - b.presaleInfo.endPresaleTime.toNumber()
        })
        .map((obj) => obj.presaleAddress)
    }
    return []
  }, [presaleContracts, filter, buttonIndex, account])

  useEffect(() => {
    async function sortAddresses() {
      const live = await sortLivePresales
      const upComing = await sortUpComingPresales
      const finished = await sortFinishedPresales
      if (tabIndex === 0) {
        setShowAddresses(live.concat(upComing, finished) as string[])
      } else if (tabIndex === 1) {
        setShowAddresses(live as string[])
      } else if (tabIndex === 2) {
        setShowAddresses(upComing as string[])
      } else if (tabIndex === 3) {
        setShowAddresses(finished as string[])
      }
    }
    sortAddresses()
  }, [sortLivePresales, sortUpComingPresales, sortFinishedPresales, tabIndex])

  const presaleSearchChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value
    if (!factoryContract) return

    const searchingAddress = isAddress(search.trim())

    if (searchingAddress) {
      const filterPresaleAddresses = showAddresses.filter((address) => address === searchingAddress)
      if (filterPresaleAddresses.length) {
        setFilteredAddresses(filterPresaleAddresses)
      } else {
        const isValidAddresses = await factoryContract.getTokenPresales(searchingAddress)
        setFilteredAddresses(isValidAddresses.filter((address: string) => showAddresses.includes(address)))
      }
    } else {
      setFilteredAddresses([])
    }
  }

  const startIndex =
    (buttonIndex === 0 ? browsePage : contributionPage) * PRESALES_PER_PAGE_ADMIN_PANEL - PRESALES_PER_PAGE_ADMIN_PANEL
  const endIndex =
    startIndex + PRESALES_PER_PAGE_ADMIN_PANEL > showAddresses.length
      ? showAddresses.length
      : startIndex + PRESALES_PER_PAGE_ADMIN_PANEL
  const slicedAddresses = showAddresses.slice(startIndex, endIndex)

  const headingTexts = ['Browse Presale', 'My Contribution']
  return (
    <>
      <Box marginTop="24px">
        {account && (
          <ButtonMenu activeIndex={buttonIndex} onItemClick={(index) => setButtonIndex(index)}>
            {headingTexts.map((heading) => (
              <ButtonMenuItem key={heading}>{heading}</ButtonMenuItem>
            ))}
          </ButtonMenu>
        )}
      </Box>
      <ContentWrapper>
        <Box width="100%" maxWidth="950px">
          {selectedPresale ? (
            <>
              <Breadcrumbs separator={<ChevronRightIcon color={darkColors.textDisabled} width="20px" />}>
                <StyledText style={{ cursor: 'pointer' }} onClick={() => setSelectedPresale('')} color="primaryDark">
                  Launchpad
                </StyledText>
                <StyledText style={{ cursor: 'pointer' }} onClick={() => setSelectedPresale('')} color="primaryDark">
                  {headingTexts[buttonIndex]}
                </StyledText>
                <StyledText bold>Presale Details</StyledText>
              </Breadcrumbs>
              <Box marginBottom="8px" />
              <Divider />
              <RowFixed marginY="24px">
                <ArrowBackIcon color="linkColor" />
                <Text
                  color="linkColor"
                  marginLeft="8px"
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setSelectedPresale('')}
                >
                  back to Launchpad
                </Text>
              </RowFixed>
              <Presale presaleAddress={selectedPresale} />
            </>
          ) : (
            <>
              <Heading>{headingTexts[buttonIndex]}</Heading>
              <TabPresale activeIndex={tabIndex} onItemClick={handleChangeTabIndex}>
                <StyledText>All Presales</StyledText>
                <StyledText>Live Now</StyledText>
                <StyledText>Coming Soon</StyledText>
                <StyledText>Finished</StyledText>
              </TabPresale>
              <Divider />

              <Flex justifyContent="space-between" marginTop="16px">
                <Box maxWidth="700px" width="75%">
                  <label htmlFor="search-presale">
                    <Flex
                      borderRadius="16px"
                      paddingLeft="10px"
                      background="#000F18"
                      alignContent="center"
                      justifyContent="flex-start"
                    >
                      <SearchIcon width="25px" color="textSubtle" />
                      <SearchInput
                        onChange={presaleSearchChangeHandler}
                        id="search-presale"
                        placeholder="Search by presale address or token address"
                      />
                    </Flex>
                  </label>
                </Box>
                <SelectWrapper>
                  <Select
                    width="226px"
                    startIcon={<FilterIcon width="15px" color="info" />}
                    options={[ALL_PRESALE_OPTION, PUBLIC_ONLY_OPTION, WHITELIST_ONLY]}
                    onChange={(e: any) => setFilter(e.target.value)}
                  />
                </SelectWrapper>
              </Flex>
              <ResonsiveFlex marginTop="16px" flexWrap="wrap">
                {(filteredAddresses.length ? filteredAddresses : slicedAddresses).map((address) => (
                  <PresaleCard key={address} viewPresaleHandler={viewPresaleHandler} presaleAddress={address} />
                ))}
              </ResonsiveFlex>
            </>
          )}
        </Box>
        {!selectedPresale && (
          <ResonsiveFlex>
            <Box />
            {buttonIndex === 0 && (
              <Pagination
                variant="outlined"
                shape="rounded"
                sx={paginationStyles}
                count={filteredAddresses.length ? 1 : Math.ceil(showAddresses.length / PRESALES_PER_PAGE_ADMIN_PANEL)}
                page={browsePage}
                onChange={(_, value: number) => setBrowsePage(value)}
              />
            )}
            {buttonIndex === 1 && (
              <Pagination
                variant="outlined"
                shape="rounded"
                sx={paginationStyles}
                count={filteredAddresses.length ? 1 : Math.ceil(showAddresses.length / PRESALES_PER_PAGE_ADMIN_PANEL)}
                page={contributionPage}
                onChange={(_, value: number) => setContributionPage(value)}
              />
            )}
          </ResonsiveFlex>
        )}
      </ContentWrapper>
    </>
  )
}

export default LaunchPad
