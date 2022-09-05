import { Flex, Heading, NavTab, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useState } from 'react'
import ConnectWalletSection from '../shared/ConnectWalletSection'
import { AdminTabs, NavItem } from '../types'
import ApprovalHistory from './ApprovalHistory'
import ProjectSettings from './ProjectSettings'
import WaitingForApproval from './WaitingForApproval'

function AdminPanel() {
  const { account } = useWeb3React()
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const navItems: NavItem[] = [
    {
      label: 'Waiting for Approval',
      code: AdminTabs.WAITING_FOR_APPROVAL,
      component: <WaitingForApproval />,
    },
    {
      label: 'Approval History',
      code: AdminTabs.APPROVAL_HISTORY,
      component: <ApprovalHistory />,
    },
    {
      label: 'Project Settings',
      code: AdminTabs.PROJECT_SETTINGS,
      component: <ProjectSettings />,
    },
  ]

  if (!account) {
    return <ConnectWalletSection />
  }

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="24px">
        Admin Panel
      </Heading>
      <NavTab mb="32px" style={{ background: 'red' }} activeIndex={activeTabIndex} onItemClick={setActiveTabIndex}>
        {navItems.map((navItem) => (
          <Text key={navItem.code}>{navItem.label}</Text>
        ))}
      </NavTab>
      <br />
      {navItems[activeTabIndex]?.component}
    </Flex>
  )
}

export default AdminPanel
