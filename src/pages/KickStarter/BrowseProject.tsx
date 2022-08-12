import { Flex, Heading, Input, Select, SortIcon } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useKickstarterContext } from 'contexts/kickstarter'
import React, { useState } from 'react'
import { isDesktop } from 'react-device-detect'
import ProjectCard from './ProjectCard'
import ProjectCardMobile from './ProjectCardMobile'
import ProjectDetails from './ProjectDetails'
import ProductLoadingSection from './shared/ProductLoadingSection'

function BrowseProject() {
  const { almostEndedKickstarters, browseProjectAddress, handleBrowseProjectChanged } = useKickstarterContext()
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

  if (browseProjectAddress) {
    return (
      <ProjectDetails
        projectAddress={browseProjectAddress}
        onBack={() => handleBrowseProjectChanged(undefined)}
      />
    )
  }

  return (
    <Flex flexDirection="column">
      <Heading size='xl' marginBottom="24px">Browse Project</Heading>
      {!(almostEndedKickstarters && almostEndedKickstarters.length === 0) && (
        <>
          <Heading size='lg' marginBottom="24px">End Soon Project</Heading>
          <Grid container spacing={2} marginBottom={almostEndedKickstarters && almostEndedKickstarters.length === 0 ? "0px" : "60px"}>
            {!almostEndedKickstarters && (
              <ProductLoadingSection />
            )}

            <Grid item xs={12} sm={6} lg={4}>
              {almostEndedKickstarters && almostEndedKickstarters.map((kickstarter) => {
                if (isDesktop) {
                  return (
                    <ProjectCard
                      title={kickstarter.title}
                      creator={kickstarter.creator}
                      projectGoals={kickstarter.projectGoals}
                      totalContribution={kickstarter.totalContribution}
                      endTimestamp={kickstarter.endTimestamp}
                      onClick={() => handleBrowseProjectChanged(kickstarter.id)}
                    />
                  )
                }
                return (
                  <ProjectCardMobile onClick={() => setSelectedProject("ID")} />
                )
              })}
            </Grid>
          </Grid>
        </>
      )}
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
