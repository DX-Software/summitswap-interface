import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { IconButton, Text, Flex, useModal } from '@summitswap-uikit'
import settings from 'img/settings.svg'
import history from 'img/history.svg'
import SettingsModal from './SettingsModal'
import RecentTransactionsModal from './RecentTransactionsModal'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

const StyledPageHeader = styled.div`
  padding-top: 16px;
  >div {
    >button {
      width: auto;
      >img {
        width: 25px; height: 25px;
      }
    }
    >button+button {
      margin-left: 15px;
    }
  }
`

const Details = styled.div`
  flex: 1;
`

const Icon = styled.img`
  width: 32px;
  height: 32px;
`

const Header = styled.p`
  font-family: Oswald, sans-serif;
  font-size: 24px;
  color: #131413;
`

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  const [onPresentSettings] = useModal(<SettingsModal />)
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal />)

  return (
    <StyledPageHeader>
      <Flex alignItems="center">
        <Details />
        <IconButton variant="text" onClick={onPresentSettings} title="Settings">
          <Icon src={settings} alt="" />
        </IconButton>
        <IconButton variant="text" onClick={onPresentRecentTransactions} title="Recent transactions">
          <Icon src={history} alt="" />
        </IconButton>
      </Flex>
      {children && <Text mt="16px">{children}</Text>}
    </StyledPageHeader>
  )
}

export default PageHeader
