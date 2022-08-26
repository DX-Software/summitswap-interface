import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import { WhitelabelNftProvider } from 'contexts/whitelabelNft'
import React, { useState } from 'react'
import CreateWhitelabelNftForm from './CreateWhitelabelNftForm'
import MyWhitelabelNft from './MyWhitelabelNft'
import { NavItem, Tabs } from './types'

function WhitelabelNft() {
  const [buttonIndex, setButtonIndex] = useState(0)

  const navItems: NavItem[] = [
    {
      label: 'My Whitelabel NFT',
      code: Tabs.MY_WHITELABEL_NFT,
      component: <MyWhitelabelNft />,
    },
    {
      label: 'My Whitelabel NFT',
      code: Tabs.MY_WHITELABEL_NFT,
      component: <CreateWhitelabelNftForm />,
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
      <div className="main-content">
        {navItems[buttonIndex]?.component}
        {/* <CreateWhitelabelNftForm /> */}
      </div>
    </WhitelabelNftProvider>
  )
}

export default React.memo(WhitelabelNft)
