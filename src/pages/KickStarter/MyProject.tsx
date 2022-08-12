import { AddIcon, Button, Flex, Heading, Text, useWalletModal, WalletIcon } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useKickstarterContext } from 'contexts/kickstarter'
import React, { useState } from 'react'
import CreateProject from './CreateProject'
import ProjectCard from './ProjectCard'
import ProjectDetails from './ProjectDetails'
import ConnectWalletSection from './shared/ConnectWalletSection'
import { Project } from './types'

type Props = {
  isCreate: boolean
  toggleCreate: () => void
  currentCreationStep: number
  setCurrentCreationStep: (step: number) => void
  projectCreation: Project
  handleOnProjectCreationChanged: (newUpdate: { [key: string]: number }) => void
}

function MyProject({
  isCreate,
  toggleCreate,
  currentCreationStep,
  setCurrentCreationStep,
  projectCreation,
  handleOnProjectCreationChanged,
}: Props) {
  const { account, onPresentConnectModal } = useKickstarterContext()
  const [projects, setProjects] = useState<Project[]>([
    {
      title: "Lorem Ipsum",
      creator: "Lorem Ipsum",
      description: "Lorem Ipsum",
      goals: 0,
      minimumBacking: 0,
    }
  ])
  const [selectedProject, setSelectedProject] = useState("")

  const toggleSelectedProject = () => {
    setSelectedProject("")
  }

  if (!account) {
    return <ConnectWalletSection />
  }

  if (isCreate) {
    return (
      <CreateProject
        toggleCreate={toggleCreate}
        currentCreationStep={currentCreationStep}
        setCurrentCreationStep={setCurrentCreationStep}
        projectCreation={projectCreation}
        handleOnProjectCreationChanged={handleOnProjectCreationChanged}
      />
    )
  }

  if (projects.length === 0) {
    return (
      <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300}>
        <Heading size="lg" color="primaryDark" style={{ fontWeight: 400 }} marginBottom={38} textAlign="center">
          You don’t have any ongoing project
        </Heading>
        <Button startIcon={<AddIcon color="text" />} style={{ fontFamily: 'Poppins' }} onClick={toggleCreate}>
          Create New Project
        </Button>
      </Flex>
    )
  }

  if (selectedProject !== "") {
    return (
      <ProjectDetails
        projectAddress='0x3b8113CC62B490e4a7f35Aec9135d4581a8f7564'
        onBack={toggleSelectedProject}
      />
    )
  }

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between" marginBottom="24px">
        <Heading size="xl">My Projects</Heading>
        <Button scale="sm" startIcon={<AddIcon width="12px" color="text" />} style={{ fontFamily: 'Poppins' }} onClick={toggleCreate}>
          Create New Project
        </Button>
      </Flex>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard
            title=""
            creator=""
            projectGoals={new BigNumber(0)}
            totalContribution={new BigNumber(0)}
            endTimestamp={0}
            onClick={() => setSelectedProject("ID")}
          />
        </Grid>
      </Grid>
    </Flex>
  )
}

export default React.memo(MyProject)
