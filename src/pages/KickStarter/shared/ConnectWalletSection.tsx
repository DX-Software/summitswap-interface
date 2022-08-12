import React from "react"
import { Button, Flex, Heading, WalletIcon } from "@koda-finance/summitswap-uikit"
import { useKickstarterContext } from "contexts/kickstarter"

function ConnectWalletSection() {
  const { onPresentConnectModal } = useKickstarterContext()
  return (
    <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300}>
      <Heading size="lg" color="primaryDark" style={{ fontWeight: 400 }} marginBottom={38} textAlign="center">
        Please connect your wallet to view your projects
      </Heading>
      <Button
        variant="tertiary"
        startIcon={<WalletIcon />}
        style={{ fontFamily: 'Poppins' }}
        onClick={onPresentConnectModal}
      >
        Connect Your Wallet
      </Button>
    </Flex>
  )
}

export default ConnectWalletSection
