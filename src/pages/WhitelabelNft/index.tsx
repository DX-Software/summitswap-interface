import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import { WhitelabelNftProvider } from 'contexts/whitelabelNft'
import React, { useState } from 'react'
import BrowseCollection from './BrowseCollection'
import { NavItem, Tabs } from './types'

function WhitelabelNft() {
  const [buttonIndex, setButtonIndex] = useState(0)

  const navItems: NavItem[] = [
    {
      label: 'Browse Collections',
      code: Tabs.BROWSE_COLLECTION,
      component: <BrowseCollection />,
    },
  ]

  return (
    <WhitelabelNftProvider>
      <Box marginTop="30px">
        <ButtonMenu activeIndex={buttonIndex} onItemClick={(index) => setButtonIndex(index)}>
          {navItems.map((item) => (
            <ButtonMenuItem key={item.code}>{item.label}</ButtonMenuItem>
          ))}
        </ButtonMenu>
      </Box>
      <div className="main-content">{navItems[buttonIndex].component}</div>
    </WhitelabelNftProvider>
  )
}

export default React.memo(WhitelabelNft)
