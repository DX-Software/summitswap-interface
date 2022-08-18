import { ArrowForwardIcon, Button, Flex, Heading } from "@koda-finance/summitswap-uikit";
import React from "react"

type Props = {
  toggleCreate: () => void
}

function EmptyMyKickstarterSection({ toggleCreate }: Props) {
  return (
    <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300} style={{ width: "100%" }}>
      <Heading size="lg" color="primaryDark" style={{ fontWeight: 400, lineHeight: "36px" }} marginBottom={38} textAlign="center">
        You don&apos;t have any projects. <br />Click the button below to create one.
      </Heading>
      <Button
        variant="tertiary"
        endIcon={<ArrowForwardIcon />}
        style={{ fontFamily: 'Poppins' }}
        onClick={toggleCreate}
      >
        Create Project
      </Button>
    </Flex>
  )
}

export default EmptyMyKickstarterSection;
