import { Flex, Heading, Input, Select, SortIcon } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useKickstarterContext } from 'contexts/kickstarter'
import { OrderDirection } from 'hooks/useKickstarters'
import React from 'react'
import { isDesktop } from 'react-device-detect'
import ProjectCard from './ProjectCard'
import ProjectCardMobile from './ProjectCardMobile'
import ProjectDetails from './ProjectDetails'
import ProductLoadingSection from './shared/ProductLoadingSection'

function BrowseProject() {
  const {
    almostEndedKickstarters,
    kickstarters,
    browseProjectAddress,
    handleBrowseProjectChanged,
    handleKickstarterOrderDirectionChanged,
  } = useKickstarterContext()
  const sortOptions = [
    {
      label: 'Title Asc',
      value: OrderDirection.ASC,
    },
    {
      label: 'Title Desc',
      value: OrderDirection.DESC,
    },
  ]

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
              {almostEndedKickstarters && almostEndedKickstarters.map((kickstarter) => (
                <Grid item xs={12} sm={6} lg={4}>
                  {isDesktop ? (
                    <ProjectCard
                      title={kickstarter.title}
                      creator={kickstarter.creator}
                      projectGoals={kickstarter.projectGoals}
                      totalContribution={kickstarter.totalContribution}
                      endTimestamp={kickstarter.endTimestamp}
                      onClick={() => handleBrowseProjectChanged(kickstarter.id)}
                    />
                  ) : (
                    <ProjectCardMobile
                      title={kickstarter.title}
                      creator={kickstarter.creator}
                      projectGoals={kickstarter.projectGoals}
                      totalContribution={kickstarter.totalContribution}
                      endTimestamp={kickstarter.endTimestamp}
                      showStatus
                      onClick={() => handleBrowseProjectChanged(kickstarter.id)}
                    />
                  )}
                </Grid>
              ))}
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
          onValueChanged={(value) => handleKickstarterOrderDirectionChanged(value as OrderDirection)}
          options={sortOptions}
          minWidth="165px"
        />
      </Flex>
      <Grid container spacing={2}>
        {!kickstarters && (
          <ProductLoadingSection />
        )}
        {kickstarters && kickstarters.map((kickstarter) => (
          <Grid item xs={12} sm={6} lg={4}>
            {isDesktop ? (
              <ProjectCard
                title={kickstarter.title}
                creator={kickstarter.creator}
                projectGoals={kickstarter.projectGoals}
                totalContribution={kickstarter.totalContribution}
                endTimestamp={kickstarter.endTimestamp}
                onClick={() => handleBrowseProjectChanged(kickstarter.id)}
              />
            ) : (
              <ProjectCardMobile
                title={kickstarter.title}
                creator={kickstarter.creator}
                projectGoals={kickstarter.projectGoals}
                totalContribution={kickstarter.totalContribution}
                endTimestamp={kickstarter.endTimestamp}
                onClick={() => handleBrowseProjectChanged(kickstarter.id)}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Flex>
  )
}

export default BrowseProject;
