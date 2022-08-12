import { ArrowForwardIcon, Button, Flex, Heading } from "@koda-finance/summitswap-uikit";
import React from "react"

type Props = {
  goToBrowseTab: () => void
}

function EmptyKickstarterSection({ goToBrowseTab }: Props) {
  return (
    <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300} style={{ width: "100%" }}>
      <Heading size="lg" color="primaryDark" style={{ fontWeight: 400, lineHeight: "36px" }} marginBottom={38} textAlign="center">
        You don&apos;t have any backed projects. <br />Click the button below to start to contribute.
      </Heading>
      <Button
        variant="tertiary"
        endIcon={<ArrowForwardIcon />}
        style={{ fontFamily: 'Poppins' }}
        onClick={goToBrowseTab}
      >
        Browse Kickstarters
      </Button>
    </Flex>
  )
}

export default EmptyKickstarterSection;
