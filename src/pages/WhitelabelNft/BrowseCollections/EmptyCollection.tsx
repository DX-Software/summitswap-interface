import { ArrowForwardIcon, Button, Flex, Heading } from '@koda-finance/summitswap-uikit'
import React from 'react'
import { Tabs } from 'types/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'

function EmptyCollection() {
  const { activeTab, setActiveTab } = useWhitelabelNftContext()

  const tabs = Object.values(Tabs)
  const browseCollectionTabIndex = tabs.findIndex((tab) => tab === Tabs.BROWSE_COLLECTION)
  const mintedNftTabIndex = tabs.findIndex((tab) => tab === Tabs.MINTED_NFTS)

  return (
    <Flex
      mb={3}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={300}
      style={{ width: '100%' }}
    >
      <Heading
        size="lg"
        color="primaryDark"
        style={{ fontWeight: 400, lineHeight: '36px' }}
        marginBottom={38}
        textAlign="center"
      >
        No NFT Collections Available.
        {activeTab === mintedNftTabIndex && (
          <>
            <br />
            Click the button below to browse collections.
          </>
        )}
      </Heading>
      {activeTab === mintedNftTabIndex && (
        <Button
          variant="tertiary"
          endIcon={<ArrowForwardIcon />}
          style={{ fontFamily: 'Poppins' }}
          onClick={() => setActiveTab(browseCollectionTabIndex)}
        >
          Browse NFT Collection
        </Button>
      )}
    </Flex>
  )
}

export default React.memo(EmptyCollection)
