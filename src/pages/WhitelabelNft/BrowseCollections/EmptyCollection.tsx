import { ArrowForwardIcon, Button, Flex, Heading } from '@koda-finance/summitswap-uikit'
import React from 'react'
import { Tabs } from 'types/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'

function EmptyCollection() {
  const { setActiveTab } = useWhitelabelNftContext()

  const tabs = Object.values(Tabs)
  const createCollectionTabIndex = tabs.findIndex((tab) => tab === Tabs.CREATE_COLLECTION)

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
        No NFT Collections Available. <br />
        Click the button below to start to create a collection.
      </Heading>
      <Button
        variant="tertiary"
        endIcon={<ArrowForwardIcon />}
        style={{ fontFamily: 'Poppins' }}
        onClick={() => setActiveTab(createCollectionTabIndex)}
      >
        Create NFT Collection
      </Button>
    </Flex>
  )
}

export default React.memo(EmptyCollection)
