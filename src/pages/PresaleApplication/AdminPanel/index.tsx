import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useFactoryPresaleContract } from 'hooks/useContract'
import { PRESALE_FACTORY_ADDRESS } from 'constants/presale'
import { Box, Text, TabPresale } from '@koda-finance/summitswap-uikit'
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
  const [pendingPresales, setPendingPresales] = useState<string[]>([])

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
        {pendingPresales.map((address) => (
          <>
            <PresaleDetail presaleAddress={address} />
            <Divider />
          </>
        ))}
      </Box>
    </ContentWrapper>
  )
}

export default AdminPanel
