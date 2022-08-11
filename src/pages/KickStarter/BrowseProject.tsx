import { Flex, Heading, Input, Select, SortIcon } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import React, { useState } from 'react'
import { isDesktop } from 'react-device-detect'
import BigNumber from 'bignumber.js'
import ProjectDetails from './ProjectDetails'
import ProjectCard from './ProjectCard'
import ProjectCardMobile from './ProjectCardMobile'

function BrowseProject() {
  const sortOptions = [
    {
      label: 'Default',
      value: 'default',
    },
    {
      label: 'Name',
      value: 'name',
    },
  ]
  const [selectedProject, setSelectedProject] = useState("")

  const toggleSelectedProject = () => {
    setSelectedProject("")
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
      <Heading size='xl' marginBottom="24px">Browse Project</Heading>
      <Heading size='lg' marginBottom="24px">End Soon Project</Heading>
      <Grid container spacing={2} marginBottom="60px">
        <Grid item xs={12} sm={6} lg={4}>
          {isDesktop ?
            <ProjectCard
              title=""
              creator=""
              projectGoals={new BigNumber(0)}
              totalContribution={new BigNumber(0)}
              endTimestamp={0}
              onClick={() => setSelectedProject("ID")}
            />
          : <ProjectCardMobile onClick={() => setSelectedProject("ID")} />}
        </Grid>
      </Grid>
      <Heading size='lg' marginBottom="24px">Browse All Projects</Heading>
      <Flex style={{ columnGap: "12px" }} marginBottom="24px">
        <Input
          type="search"
          placeholder="Search project by name or creator name"
        />
        <Select
          startIcon={<SortIcon color="text" />}
          options={sortOptions}
          minWidth="150px"
        />
      </Flex>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={4}>
          {isDesktop ?
            <ProjectCard
              title=""
              creator=""
              totalContribution={new BigNumber(0)}
              projectGoals={new BigNumber(0)}
              endTimestamp={0}
              onClick={() => setSelectedProject("ID")}
            />
          : <ProjectCardMobile onClick={() => setSelectedProject("ID")} />}
        </Grid>
      </Grid>
    </Flex>
  )
}

export default BrowseProject;
