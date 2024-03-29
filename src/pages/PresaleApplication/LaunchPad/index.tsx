/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useFactoryPresaleContract, usePresaleContracts } from 'hooks/useContract'
import { ALL_PRESALE_OPTION, WHITELIST_ONLY, PUBLIC_ONLY_OPTION } from 'constants/presale'
import {
  ArrowBackIcon,
  Breadcrumbs,
  ChevronRightIcon,
  Flex,
  Box,
  Text,
  NavTab,
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
import { PresalePhases } from '../types'
import { Heading } from '../AdminPanel'
import PresaleCards from '../PresaleCards'
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

  const factoryContract = useFactoryPresaleContract()
  const presaleContracts = usePresaleContracts(approvedPresales)

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

  const tabIndexHandler = (newIndex: number) => setTabIndex(newIndex)
  const viewPresaleHandler = (address: string) => setSelectedPresale(address)
  const menuButtonHandler = (index: number) => {
    setButtonIndex((prevIndex) => {
      if (index !== prevIndex) setSelectedPresale('')
      return index
    })
  }

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
        .filter((info) => {
          if (!(checkSalePhase(info.presaleInfo) === PresalePhases.PresalePhase)) {
            return false
          }
          if (buttonIndex === 1 && !(info.presaleInfo.owner === account || info.contributors.includes(account))) {
            return false
          }
          if (filter === ALL_PRESALE_OPTION.value) return true
          if (filter === WHITELIST_ONLY.value && info.presaleInfo.isWhitelistEnabled) return true
          if (filter === PUBLIC_ONLY_OPTION.value && !info.presaleInfo.isWhitelistEnabled) return true
          return false
        })
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
        .filter((info) => {
          if (!(checkSalePhase(info.presaleInfo) === PresalePhases.PresaleNotStarted)) {
            return false
          }
          if (buttonIndex === 1 && !(info.presaleInfo.owner === account || info.contributors.includes(account))) {
            return false
          }
          if (filter === ALL_PRESALE_OPTION.value) return true
          if (filter === WHITELIST_ONLY.value && info.presaleInfo.isWhitelistEnabled) return true
          if (filter === PUBLIC_ONLY_OPTION.value && !info.presaleInfo.isWhitelistEnabled) return true
          return false
        })
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
        .filter((info) => {
          if (
            checkSalePhase(info.presaleInfo) === PresalePhases.PresaleNotStarted ||
            checkSalePhase(info.presaleInfo) === PresalePhases.PresalePhase
          ) {
            return false
          }
          if (buttonIndex === 1 && !(info.presaleInfo.owner === account || info.contributors.includes(account))) {
            return false
          }
          if (filter === ALL_PRESALE_OPTION.value) return true
          if (filter === WHITELIST_ONLY.value && info.presaleInfo.isWhitelistEnabled) return true
          if (filter === PUBLIC_ONLY_OPTION.value && !info.presaleInfo.isWhitelistEnabled) return true
          return false
        })
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

  const headingTexts = ['Browse Presale', 'My Contribution']
  return (
    <>
      <Box marginTop="24px">
        {account && (
          <ButtonMenu activeIndex={buttonIndex} onItemClick={menuButtonHandler}>
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
              <NavTab activeIndex={tabIndex} onItemClick={tabIndexHandler}>
                <StyledText>All Presales</StyledText>
                <StyledText>Live Now</StyledText>
                <StyledText>Coming Soon</StyledText>
                <StyledText>Finished</StyledText>
              </NavTab>
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
                    onValueChanged={(value: any) => setFilter(value)}
                  />
                </SelectWrapper>
              </Flex>
              {buttonIndex === 0 && (
                <PresaleCards
                  page={browsePage}
                  setPage={setBrowsePage}
                  viewPresaleHandler={viewPresaleHandler}
                  presaleAddresses={showAddresses}
                  filteredAddresses={filteredAddresses}
                />
              )}
              {buttonIndex === 1 && (
                <PresaleCards
                  page={contributionPage}
                  setPage={setContributionPage}
                  viewPresaleHandler={viewPresaleHandler}
                  presaleAddresses={showAddresses}
                  filteredAddresses={filteredAddresses}
                />
              )}
            </>
          )}
        </Box>
      </ContentWrapper>
    </>
  )
}

export default LaunchPad
