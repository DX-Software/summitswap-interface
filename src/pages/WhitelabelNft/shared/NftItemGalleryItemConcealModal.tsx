import { Box, Flex, Heading, InjectedModalProps, Modal, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'

function NftItemGalleryItemConcealModal({ onDismiss }: InjectedModalProps) {
  return (
    <Modal title="" onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        marginTop="-72px"
        marginBottom="16px"
        alignItems="center"
        width="100%"
        maxWidth="400px"
      >
        <Heading size="lg" color="primary" marginBottom="16px">
          Stay Tuned!
        </Heading>

        <Box marginBottom="16px">
          <img src="/images/whitelabel-nfts/koda-head.png" alt="Koda head" />
        </Box>

        <Text textAlign="center">NFT detail will be available once collections has been revealed. Stay tuned!</Text>
      </Flex>
    </Modal>
  )
}

export default React.memo(NftItemGalleryItemConcealModal)
