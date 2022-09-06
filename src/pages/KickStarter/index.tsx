import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import { KickstarterProvider, useKickstarterContext } from 'pages/KickStarter/contexts/kickstarter'
import React, { useEffect, useState } from 'react'
import BackedKickstarter from './BackedKickstarter'
import BrowseProject from './BrowseProject'
import AdminPanel from "./AdminPanel"
import MyProject from './MyProject'
import { NavItem, Tabs } from './types'

function KickStarter() {
  const { handleActiveNavItem } = useKickstarterContext()
  const [buttonIndex, setButtonIndex] = useState(0)

  const navItems: NavItem[] = [
    {
      label: 'My Project',
      code: Tabs.MY_PROJECT,
      component:
        <MyProject />,
    },
    {
      label: 'Browse Project',
      code: Tabs.BROWSE_PROJECT,
      component: <BrowseProject />,
    },
    {
      label: 'Backed Project',
      code: Tabs.BACKED_PROJECT,
      component: <BackedKickstarter goToBrowseTab={() => setButtonIndex(1)} />,
    },
    {
      label: 'Admin Panel',
      code: Tabs.ADMIN_PANEL,
      component: <AdminPanel />,
    },
  ]

  useEffect(() => {
    handleActiveNavItem(navItems[buttonIndex])
  }, [buttonIndex, handleActiveNavItem])

  return (
    <KickstarterProvider>
      <Box marginTop="30px">
        <ButtonMenu activeIndex={buttonIndex} onItemClick={(index) => setButtonIndex(index)}>
          {navItems.map((item) => (
            <ButtonMenuItem key={item.code}>{item.label}</ButtonMenuItem>
          ))}
        </ButtonMenu>
      </Box>
      <div className="main-content">
        {navItems[buttonIndex]?.component}
      </div>
    </KickstarterProvider>
  )
}

export default React.memo(KickStarter)
