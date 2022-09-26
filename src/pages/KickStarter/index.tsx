import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useKickstarterFactoryContract } from 'hooks/useContract'
import useParsedQueryString from 'hooks/useParsedQueryString'
import React, { useEffect, useMemo, useState } from 'react'
import AdminPanel from './AdminPanel'
import BackedKickstarter from './BackedKickstarter'
import BrowseProject from './BrowseProject'
import { KickstarterProvider } from './contexts/kickstarter'
import MyProject from './MyProject'
import { NavItem, Tabs } from './types'

function KickStarter() {
  const parsedQs = useParsedQueryString()
  const { account } = useWeb3React()
  const factoryContract = useKickstarterFactoryContract()
  const [isFactoryAdmin, setIsFactoryAdmin] = useState(false)
  const [buttonIndex, setButtonIndex] = useState(0)

  const generalTabs: NavItem[] = useMemo(
    () => [
      {
        label: 'My Projects',
        code: Tabs.MY_PROJECT,
        component: <MyProject />,
      },
      {
        label: 'Browse Projects',
        code: Tabs.BROWSE_PROJECT,
        component: <BrowseProject />,
      },
      {
        label: 'Backed Projects',
        code: Tabs.BACKED_PROJECT,
        component: <BackedKickstarter goToBrowseTab={() => setButtonIndex(1)} />,
      },
    ],
    []
  )

  const navItems: NavItem[] = useMemo(
    () =>
      !isFactoryAdmin
        ? generalTabs
        : [
            ...generalTabs,
            {
              label: 'Admin Panel',
              code: Tabs.ADMIN_PANEL,
              component: <AdminPanel />,
            },
          ],
    [generalTabs, isFactoryAdmin]
  )

  useEffect(() => {
    if (!parsedQs.kickstarter) return
    const browseTabIndex = generalTabs.findIndex((generalTab) => generalTab.code === Tabs.BROWSE_PROJECT)
    setButtonIndex(browseTabIndex)
  }, [parsedQs, generalTabs])

  useEffect(() => {
    async function fetchIsAdmin() {
      if (!account || !factoryContract) {
        setIsFactoryAdmin(false)
        return
      }
      const [owner, isAdmin] = await Promise.all([
        factoryContract.owner(),
        factoryContract.isAdmin(account)
      ])

      const isFactoryAdminTemp = account.toLowerCase() === owner.toLowerCase() || isAdmin
      setIsFactoryAdmin(isFactoryAdminTemp)
    }
    fetchIsAdmin()
  }, [factoryContract, account, navItems])

  return (
    <KickstarterProvider>
      <Box marginTop="30px">
        <ButtonMenu activeIndex={buttonIndex} onItemClick={(index) => setButtonIndex(index)}>
          {navItems.map((item) => (
            <ButtonMenuItem key={item.code}>{item.label}</ButtonMenuItem>
          ))}
        </ButtonMenu>
      </Box>
      <div className="main-content">{navItems[buttonIndex]?.component}</div>
    </KickstarterProvider>
  )
}

export default React.memo(KickStarter)
