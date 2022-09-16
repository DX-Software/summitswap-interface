import { Flex, Heading } from "@koda-finance/summitswap-uikit";
import React from "react"

function EmptyKickstarterSection() {
  return (
    <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300} style={{ width: "100%" }}>
      <Heading size="lg" color="primaryDark" style={{ fontWeight: 400, lineHeight: "36px" }} marginBottom={38} textAlign="center">
        No Project Created Yet
      </Heading>
    </Flex>
  )
}

export default EmptyKickstarterSection;
