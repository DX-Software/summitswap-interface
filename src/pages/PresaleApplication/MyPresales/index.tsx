import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useFactoryPresaleContract } from 'hooks/useContract'
import { PRESALE_FACTORY_ADDRESS } from 'constants/presale'
import {
  ArrowBackIcon,
  Breadcrumbs,
  ChevronRightIcon,
  Flex,
  Box,
  Button,
  Text,
  TabPresale,
  AddIcon,
  darkColors,
} from '@koda-finance/summitswap-uikit'
import { RowFixed } from 'components/Row'
import { Heading } from '../AdminPanel'
import PresaleCard from '../PresaleCard'
import PresaleSummary from '../PresaleSummary'
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

interface Props {
  setHomeButtonIndex: React.Dispatch<React.SetStateAction<number>>
}

const MyPresales = ({ setHomeButtonIndex }: Props) => {
  const { account } = useWeb3React()

  const [tabIndex, setTabIndex] = useState(1)
  const [selectedPresale, setSelectedPresale] = useState('')
  const [accountPresales, setAccountPresales] = useState<string[]>([])
  const [pendingPresales, setPendingPresales] = useState<string[]>([])
  const [approvedPresales, setApprovedPresales] = useState<string[]>([])

  const factoryContract = useFactoryPresaleContract(PRESALE_FACTORY_ADDRESS)

  useEffect(() => {
    async function fetchPresales() {
      setAccountPresales(await factoryContract?.getAccountPresales(account))
      setPendingPresales(await factoryContract?.getPendingPresales())
      setApprovedPresales(await factoryContract?.getApprovedPresales())
    }
    if (factoryContract && account) fetchPresales()
  }, [factoryContract, account])

  const handleChangeTabIndex = (newIndex: number) => setTabIndex(newIndex)
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
            onClick={() => setHomeButtonIndex(1)}
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
            <TabPresale activeIndex={tabIndex} onItemClick={handleChangeTabIndex}>
              <StyledText>{sectionTexts[0]}</StyledText>
              <StyledText>{sectionTexts[1]}</StyledText>
            </TabPresale>
            <Divider />
            {tabIndex === 0 &&
              (accountPendingPresales.length ? (
                <ResonsiveFlex marginTop="16px">
                  {accountPendingPresales.map((address) => (
                    <PresaleCard viewPresaleHandler={viewPresaleHandler} presaleAddress={address} />
                  ))}
                </ResonsiveFlex>
              ) : (
                <Text marginTop="24px" color={darkColors.textDisabled}>
                  You don’t have any ongoing presale
                </Text>
              ))}

            {tabIndex === 1 &&
              (accountApprovedPresales.length ? (
                <ResonsiveFlex marginTop="16px" flexWrap="wrap">
                  {Array(2)
                    .fill(accountApprovedPresales[0])
                    .map((address) => (
                      <PresaleCard viewPresaleHandler={viewPresaleHandler} presaleAddress={address} />
                    ))}
                </ResonsiveFlex>
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
