import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import React from 'react'
import { NavItem, Tabs } from 'types/whitelabelNft'
import BrowseCollections from './BrowseCollections'
import { useWhitelabelNftContext, WhitelabelNftProvider } from './contexts/whitelabel'
import CreateCollection from './CreateCollection'

function WhitelabelNft() {
  const { activeTab, setActiveTab } = useWhitelabelNftContext()

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
        <ButtonMenu activeIndex={activeTab} onItemClick={(index) => setActiveTab(index)}>
          {navItems.map((item) => (
            <ButtonMenuItem key={item.code}>{item.label}</ButtonMenuItem>
          ))}
        </ButtonMenu>
      </Box>
      <div className="main-content">{navItems[activeTab].component}</div>
    </>
  )
}

function main() {
  return (
    <WhitelabelNftProvider>
      <WhitelabelNft />
    </WhitelabelNftProvider>
  )
}

export default React.memo(main)
