import {
  ArrowBackIcon,
  Flex,
  Text,
  Breadcrumbs,
  Heading,
} from '@koda-finance/summitswap-uikit'
import { useKickstarterContext } from 'contexts/kickstarter'
import React from 'react'
import styled from 'styled-components'
import CreationStep01 from './CreationStep01'
import CreationStep02 from './CreationStep02'
import CreationStep03 from './CreationStep03'

const Divider = styled.div`
  height: 1px;
  background-color: #444444;
`

function CreateProject() {
  const { toggleIsCreate, currentCreationStep } = useKickstarterContext()

  return (
    <Flex flexDirection="column">
      <Flex borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={toggleIsCreate}>
            My Project
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            Create New Project
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={toggleIsCreate}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: "underline" }}>back to My Projects</Text>
      </Flex>
      <Text color="textSubtle" marginBottom="4px">
        Step 0{currentCreationStep} of 03 - Project Details
      </Text>
      <Heading size="xl" marginBottom="8px">
        Create New Project
      </Heading>
      <Divider style={{ marginBottom: '24px' }} />
      {currentCreationStep === 1 && <CreationStep01 />}
      {currentCreationStep === 2 && <CreationStep02 />}
      {currentCreationStep === 3 && <CreationStep03 />}
    </Flex>
  )
}

export default CreateProject
