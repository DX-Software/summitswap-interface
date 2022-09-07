import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import React, { useState } from 'react'
import BrowseCollections from './BrowseCollections'
import CreateCollection from './CreateCollection'
import { NavItem, Tabs } from './types'

function WhitelabelNft() {
  const [buttonIndex, setButtonIndex] = useState(0)

  const navItems: NavItem[] = [
    {
      label: 'Browse Collections',
      code: Tabs.BROWSE_COLLECTION,
      component: <BrowseCollections />,
    },
    {
      label: 'Create NFT Collection',
      code: Tabs.CREATE_COLLECTION,
      component: <CreateCollection />,
    },
  ]

  return (
    <>
      <Box marginTop="30px">
        <ButtonMenu activeIndex={buttonIndex} onItemClick={(index) => setButtonIndex(index)}>
          {navItems.map((item) => (
            <ButtonMenuItem key={item.code}>{item.label}</ButtonMenuItem>
          ))}
        </ButtonMenu>
      </Box>
      <div className="main-content">{navItems[buttonIndex].component}</div>
    </>
  )
}

export default React.memo(WhitelabelNft)
