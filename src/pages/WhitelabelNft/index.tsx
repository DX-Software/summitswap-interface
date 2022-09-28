import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import React, { useMemo } from 'react'
import { NavItem, Tabs } from 'types/whitelabelNft'
import BrowseCollections from './BrowseCollections'
import { useWhitelabelNftContext, WhitelabelNftProvider } from './contexts/whitelabel'
import CreateCollection from './CreateCollection'
import MintedNfts from './MintedNfts'
import MyNftCollection from './MyNftCollection'

function WhitelabelNft() {
  const { activeTab, setActiveTab, setWhitelabelNtId } = useWhitelabelNftContext()

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: 'Browse Collections',
        code: Tabs.BROWSE_COLLECTION,
        component: <BrowseCollections />,
      },
      {
        label: 'Minted NFTs',
        code: Tabs.MINTED_NFTS,
        component: <MintedNfts />,
      },
      {
        label: 'My NFT Collections',
        code: Tabs.MY_NFT_COLLECTION,
        component: <MyNftCollection />,
      },
      {
        label: 'Create NFT Collection',
        code: Tabs.CREATE_COLLECTION,
        component: <CreateCollection />,
      },
    ],
    []
  )

  const handleSetActiveTab = (index: number) => {
    setActiveTab(index)
    setWhitelabelNtId('')
  }

  return (
    <Box width="100%">
      <Box marginTop="30px">
        <ButtonMenu activeIndex={activeTab} onItemClick={handleSetActiveTab}>
          {navItems.map((item) => (
            <ButtonMenuItem key={item.code}>{item.label}</ButtonMenuItem>
          ))}
        </ButtonMenu>
      </Box>
      <div className="main-content">{navItems[activeTab].component}</div>
    </Box>
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
