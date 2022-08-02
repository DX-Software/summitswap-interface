import { Breadcrumbs, Flex, Text } from "@koda-finance/summitswap-uikit"
import React from "react"

type Props = {
  toggleSelectedProject: () => void
}

function ProjectPayment({ toggleSelectedProject }: Props) {
  return (
    <Flex>
      <Flex flex={1}>
        <Flex flex={1} borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
          <Breadcrumbs>
            <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={toggleSelectedProject}>
              My Project
            </Text>
            <Text color="borderColor" style={{ fontWeight: 700 }}>
              Project Details
            </Text>
          </Breadcrumbs>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ProjectPayment
