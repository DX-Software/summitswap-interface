import {
  ArrowBackIcon,
  Flex,
  Text,
  Breadcrumbs,
  Heading,
} from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'
import CreationStep01 from './CreationStep01'
import CreationStep02 from './CreationStep02'
import CreationStep03 from './CreationStep03'
import { Project } from './types'

type Props = {
  toggleCreate: () => void
  currentCreationStep: number
  setCurrentCreationStep: (step: number) => void
  projectCreation: Project
  handleOnProjectCreationChanged: (newUpdate: { [key: string]: number }) => void
}

const Divider = styled.div`
  height: 1px;
  background-color: #444444;
`

function CreateProject({
  toggleCreate,
  currentCreationStep,
  projectCreation,
  setCurrentCreationStep,
  handleOnProjectCreationChanged,
}: Props) {

  return (
    <Flex flexDirection="column">
      <Flex borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={toggleCreate}>
            My Project
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            Create New Project
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={toggleCreate}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor">back to My Projects</Text>
      </Flex>
      <Text color="textSubtle" marginBottom="4px">
        Step 0{currentCreationStep} of 03 - Project Details
      </Text>
      <Heading size="xl" marginBottom="8px">
        Create New Project
      </Heading>
      <Divider style={{ marginBottom: '24px' }} />
      {currentCreationStep === 1 && (
        <CreationStep01
          setCurrentCreationStep={setCurrentCreationStep}
          projectCreation={projectCreation}
          handleOnProjectCreationChanged={handleOnProjectCreationChanged}
        />
      )}
      {currentCreationStep === 2 && (
        <CreationStep02
          setCurrentCreationStep={setCurrentCreationStep}
          projectCreation={projectCreation}
          handleOnProjectCreationChanged={handleOnProjectCreationChanged}
        />
      )}
      {currentCreationStep === 3 && (
        <CreationStep03
          setCurrentCreationStep={setCurrentCreationStep}
          projectCreation={projectCreation}
        />
      )}
    </Flex>
  )
}

export default CreateProject
