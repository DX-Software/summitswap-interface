import { Flex, Heading, NavTab, Text } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useState } from 'react'
import ConnectWalletSection from '../shared/ConnectWalletSection'
import { AdminTabs, NavItem } from '../types'
import ApprovalHistory from './ApprovalHistory'
import ProjectSettings from './ProjectSettings'
import WaitingForApproval from './WaitingForApproval'
import KickstarterDetails from './KickstarterDetails'
import { Divider } from '../shared'

function AdminPanel() {
  const { account } = useWeb3React()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [kickstarterId, setKickstarterId] = useState<string>("")

  const navItems: NavItem[] = [
    {
      label: 'Waiting for Approval',
      code: AdminTabs.WAITING_FOR_APPROVAL,
      component: <WaitingForApproval handleShowKickstarter={setKickstarterId} />,
    },
    {
      label: 'Approval History',
      code: AdminTabs.APPROVAL_HISTORY,
      component: <ApprovalHistory handleShowKickstarter={setKickstarterId} />,
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

  if (kickstarterId) {
    return (
      <KickstarterDetails
        previousPage={navItems[activeTabIndex].label}
        kickstarterId={kickstarterId}
        handleKickstarterId={setKickstarterId}
      />
    )
  }

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="24px">
        Admin Panel
      </Heading>
      <NavTab mb="32px" activeIndex={activeTabIndex} onItemClick={setActiveTabIndex}>
        {navItems.map((navItem) => (
          <Text key={navItem.code}>{navItem.label}</Text>
        ))}
      </NavTab>
      <Divider style={{ marginTop: "0px" }} />
      <br />
      {navItems[activeTabIndex]?.component}
    </Flex>
  )
}

export default AdminPanel
