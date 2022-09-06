import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { isAddress } from 'utils'
import { useWeb3React } from '@web3-react/core'
import { useLocation } from 'react-router-dom'
import { useFactoryPresaleContract } from 'hooks/useContract'
import {
  ArrowBackIcon,
  Breadcrumbs,
  ChevronRightIcon,
  Flex,
  Box,
  Button,
  Text,
  NavTab,
  AddIcon,
  darkColors,
} from '@koda-finance/summitswap-uikit'
import { RowFixed } from 'components/Row'
import { Heading } from '../AdminPanel'
import PresaleCards from '../PresaleCards'
import PresaleSummary from '../PresaleSummary'
import Presale from '../Presale'

const ContentWrapper = styled(Box)`
  max-width: 950px;
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

interface Props {
  setHomeButtonIndex: React.Dispatch<React.SetStateAction<number>>
}

const MyPresales = ({ setHomeButtonIndex }: Props) => {
  const { account } = useWeb3React()
  const [pendingPage, setPendingPage] = useState(1)
  const [approvedPage, setApprovedPage] = useState(1)
  const [tabIndex, setTabIndex] = useState(0)
  const [selectedPresale, setSelectedPresale] = useState('')
  const [accountPresales, setAccountPresales] = useState<string[]>([])
  const [pendingPresales, setPendingPresales] = useState<string[]>([])
  const [approvedPresales, setApprovedPresales] = useState<string[]>([])

  const factoryContract = useFactoryPresaleContract()
  const location = useLocation()

  useEffect(() => {
    const presaleAddressUrl = new URLSearchParams(location.search).get('address')
    if (
      isAddress(presaleAddressUrl || '') &&
      (pendingPresales.includes(presaleAddressUrl || '') || approvedPresales.includes(presaleAddressUrl || ''))
    ) {
      setSelectedPresale(presaleAddressUrl || '')
    } else {
      setSelectedPresale('')
    }
  }, [location, approvedPresales, pendingPresales])

  useEffect(() => {
    async function fetchPresales() {
      setAccountPresales(await factoryContract?.getAccountPresales(account))
      setPendingPresales(await factoryContract?.getPendingPresales())
      setApprovedPresales(await factoryContract?.getApprovedPresales())
    }
    if (factoryContract && account) fetchPresales()
  }, [factoryContract, account])

  const tabIndexHandler = (newIndex: number) => setTabIndex(newIndex)
  const viewPresaleHandler = (address: string) => setSelectedPresale(address)

  const accountPendingPresales = useMemo(() => {
    return accountPresales.filter((address) => pendingPresales.includes(address))
  }, [accountPresales, pendingPresales])

  const accountApprovedPresales = useMemo(() => {
    return accountPresales.filter((address) => approvedPresales.includes(address))
  }, [accountPresales, approvedPresales])
  const sectionTexts = ['Waiting for Approval', 'Approved']
  return (
    <ContentWrapper>
      {!selectedPresale && (
        <Flex justifyContent="end">
          <Button
            onClick={() => setHomeButtonIndex(0)}
            startIcon={<AddIcon color="currentColor" width="14px" />}
            scale="sm"
          >
            Create New Presale
          </Button>
        </Flex>
      )}
      <Box width="100%" maxWidth="950px">
        {selectedPresale ? (
          <>
            <Breadcrumbs separator={<ChevronRightIcon color={darkColors.textDisabled} width="20px" />}>
              <StyledText style={{ cursor: 'pointer' }} onClick={() => setSelectedPresale('')} color="primaryDark">
                My Presales
              </StyledText>
              <StyledText style={{ cursor: 'pointer' }} onClick={() => setSelectedPresale('')} color="primaryDark">
                {sectionTexts[tabIndex]}
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
                back to My Presale
              </Text>
            </RowFixed>
            {tabIndex === 0 ? (
              <PresaleSummary presaleAddress={selectedPresale} />
            ) : (
              <Presale presaleAddress={selectedPresale} />
            )}
          </>
        ) : (
          <>
            <Heading>My Presales</Heading>
            <NavTab activeIndex={tabIndex} onItemClick={tabIndexHandler}>
              <StyledText>{sectionTexts[0]}</StyledText>
              <StyledText>{sectionTexts[1]}</StyledText>
            </NavTab>
            <Divider />
            {tabIndex === 0 &&
              (accountPendingPresales.length ? (
                <PresaleCards
                  page={pendingPage}
                  setPage={setPendingPage}
                  viewPresaleHandler={viewPresaleHandler}
                  presaleAddresses={accountPendingPresales}
                />
              ) : (
                <Text marginTop="24px" color={darkColors.textDisabled}>
                  You don’t have any ongoing presale
                </Text>
              ))}

            {tabIndex === 1 &&
              (accountApprovedPresales.length ? (
                <PresaleCards
                  page={approvedPage}
                  setPage={setApprovedPage}
                  viewPresaleHandler={viewPresaleHandler}
                  presaleAddresses={accountApprovedPresales}
                />
              ) : (
                <Text marginTop="24px" color={darkColors.textDisabled}>
                  You don’t have any approved presale
                </Text>
              ))}
          </>
        )}
      </Box>
    </ContentWrapper>
  )
}

export default MyPresales
