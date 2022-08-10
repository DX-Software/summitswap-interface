import { Button, Flex, Heading, WalletIcon } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useKickstarterContext } from 'contexts/kickstarter'
import React from 'react'
import { TranslateString } from 'utils/translateTextHelpers'
import ProjectCard from './ProjectCard'
import ProjectDetails from './ProjectDetails'

function BackedProject() {
  const { account, onPresentConnectModal, backedProjects, backedProjectAddress, handleBackedProjectChanged } = useKickstarterContext()

  console.log("backedProjects", backedProjects)

  if (!account) {
    return (
      <Flex mb={3} flexDirection="column" alignItems="center" justifyContent="center" height={300}>
        <Heading size='lg' color="primaryDark" style={{ fontWeight: 400 }} marginBottom={38} textAlign="center">
          Please connect your wallet to view your projects
        </Heading>
        <Button variant='tertiary' startIcon={<WalletIcon />} style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
          Connect Your Wallet
        </Button>
      </Flex>
    )
  }

  if (backedProjectAddress) {
    return <ProjectDetails onBack={() => handleBackedProjectChanged(undefined)} />
  }

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="24px">Backed Projects</Heading>
      <Grid container spacing={2}>
        {backedProjects.map((backedProject) => (
          <Grid item xs={12} sm={6} lg={4} key={backedProject.id}>
            <ProjectCard
              title={backedProject.kickstarter.title}
              creator={backedProject.kickstarter.creator}
              projectGoals={backedProject.kickstarter.projectGoals}
              totalContribution={backedProject.kickstarter.totalContribution}
              onClick={() => handleBackedProjectChanged(backedProject.kickstarter.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Flex>
  )
}

export default BackedProject;
