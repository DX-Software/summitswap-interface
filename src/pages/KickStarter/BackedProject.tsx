import { Flex, Heading, Skeleton } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useKickstarterContext } from 'contexts/kickstarter'
import React from 'react'
import ProjectCard from './ProjectCard'
import ProjectDetails from './ProjectDetails'
import ConnectWalletSection from './shared/ConnectWalletSection'
import EmptyKickstarterSection from './shared/EmptyKickstarterSection'

type Props = {
  goToBrowseTab: () => void
}

function BackedProject({ goToBrowseTab }: Props) {
  const { account, backedProjects, backedProjectAddress, handleBackedProjectChanged } = useKickstarterContext()

  if (!account) {
    return <ConnectWalletSection />
  }

  if (backedProjectAddress) {
    return (
      <ProjectDetails
        projectAddress={backedProjectAddress}
        onBack={() => handleBackedProjectChanged(undefined)}
      />
    )
  }

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="24px">Backed Projects</Heading>
      <Grid container spacing={2}>
        {backedProjects === undefined && (
          <>
            <Grid item xs={12} sm={6} lg={4}>
              <Skeleton height={310} />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Skeleton height={310} />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Skeleton height={310} />
            </Grid>
          </>
        )}
        {backedProjects && backedProjects.length === 0 && (
          <EmptyKickstarterSection goToBrowseTab={goToBrowseTab} />
        )}
        {backedProjects && backedProjects.map((backedProject) => (
          <Grid item xs={12} sm={6} lg={4} key={backedProject.id}>
            <ProjectCard
              title={backedProject.kickstarter.title}
              creator={backedProject.kickstarter.creator}
              projectGoals={backedProject.kickstarter.projectGoals}
              totalContribution={backedProject.kickstarter.totalContribution}
              endTimestamp={backedProject.kickstarter.endTimestamp}
              onClick={() => handleBackedProjectChanged(backedProject.kickstarter.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Flex>
  )
}

export default BackedProject;
