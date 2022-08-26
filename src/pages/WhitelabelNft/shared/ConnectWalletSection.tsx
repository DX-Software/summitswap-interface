import { Button, Flex, Heading } from '@koda-finance/summitswap-uikit'
import { useWhitelabelNftContext } from 'contexts/whitelabelNft'
import React from 'react'

function ConnectWalletSection() {
  const { onPresentConnectModal } = useWhitelabelNftContext()
  return (
    <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300}>
      <Heading size="lg" color="primaryDark" style={{ fontWeight: 400 }} marginBottom={38} textAlign="center">
        Please connect your wallet to view your projects
      </Heading>
      <Button variant="tertiary" startIcon={<></>} style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
        Connect Your Wallet
      </Button>
    </Flex>
  )
}

export default React.memo(ConnectWalletSection)
