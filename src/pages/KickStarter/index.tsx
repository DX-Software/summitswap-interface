import { Box, ButtonMenu, ButtonMenuItem, useWalletModal } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useState } from 'react'
import login from 'utils/login'
import BackedProject from './BackedProject'
import BrowseProject from './BrowseProject'
import MyProject from './MyProject'

type navItem = {
  label: string
  code: 'my_project' | 'browse_project' | 'backed_project'
  component: React.ReactNode
}

function KickStarter() {
  const navItems: navItem[] = [
    {
      label: 'My Project',
      code: 'my_project',
      component: <MyProject />,
    },
    {
      label: 'Browse Project',
      code: 'browse_project',
      component: <BrowseProject />,
    },
    {
      label: 'Backed Project',
      code: 'backed_project',
      component: <BackedProject />,
    },
  ]
  const [buttonIndex, setButtonIndex] = useState(0)

  return (
    <>
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
    </>
  )
}

export default React.memo(KickStarter)
