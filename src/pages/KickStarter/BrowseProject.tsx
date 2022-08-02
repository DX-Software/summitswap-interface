import { Flex, Heading, Input, Select, SortIcon } from '@koda-finance/summitswap-uikit';
import { Grid } from '@mui/material';
import React, { useState } from 'react'
import BrowseProjectDetails from './BrowseProjectDetails';
import ProjectCard from './ProjectCard';

function BrowseProject() {
  const sortOptions = [
    {
      label: 'Sort by Default',
      value: 'default',
    },
    {
      label: 'Sort by Name',
      value: 'name',
    },
  ]
  const [selectedProject, setSelectedProject] = useState("")

  const toggleSelectedProject = () => {
    setSelectedProject("")
  }

  if (selectedProject !== "") {
    return <BrowseProjectDetails toggleSelectedProject={toggleSelectedProject} />
  }

  return (
    <Flex flexDirection="column">
      <Heading size='xl' marginBottom="24px">Browse Project</Heading>
      <Heading size='lg' marginBottom="24px">End Soon Project</Heading>
      <Grid container spacing={2} marginBottom="60px">
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard onClick={() => setSelectedProject("ID")} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard onClick={() => setSelectedProject("ID")} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard onClick={() => setSelectedProject("ID")} />
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
          minWidth="230px"
        />
      </Flex>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard onClick={() => setSelectedProject("ID")} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard onClick={() => setSelectedProject("ID")} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard onClick={() => setSelectedProject("ID")} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard onClick={() => setSelectedProject("ID")} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard onClick={() => setSelectedProject("ID")} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ProjectCard onClick={() => setSelectedProject("ID")} />
        </Grid>
      </Grid>
    </Flex>
  )
}

export default BrowseProject;
