import { ArrowBackIcon, Breadcrumbs, Flex, Text } from "@koda-finance/summitswap-uikit"
import React from "react"

type Props = {
  previousPage: string
  kickstarterId: string
  handleKickstarterId: (value: string) => void
}

function ProjectDetails({ previousPage, kickstarterId, handleKickstarterId }: Props) {
  return (
    <Flex flexDirection="column">
      <Flex borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={() => handleKickstarterId("")}>
            {previousPage}
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            Project Details
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={() => handleKickstarterId("")}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: "underline" }}>back to Admin Panel</Text>
      </Flex>
    </Flex>
  )
}

export default ProjectDetails
