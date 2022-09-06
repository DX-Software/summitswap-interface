import { ArrowForwardIcon, Button, Flex, Heading } from "@koda-finance/summitswap-uikit";
import { useKickstarterContext } from "pages/KickStarter/contexts/kickstarter";
import React from "react"

function EmptyMyKickstarterSection() {
  const { toggleIsCreate } = useKickstarterContext()

  return (
    <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300} style={{ width: "100%" }}>
      <Heading size="lg" color="primaryDark" style={{ fontWeight: 400, lineHeight: "36px" }} marginBottom={38} textAlign="center">
        You don&apos;t have any projects. <br />Click the button below to create one.
      </Heading>
      <Button
        variant="tertiary"
        endIcon={<ArrowForwardIcon />}
        style={{ fontFamily: 'Poppins' }}
        onClick={toggleIsCreate}
      >
        Create Project
      </Button>
    </Flex>
  )
}

export default EmptyMyKickstarterSection;
