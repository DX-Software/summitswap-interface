import { Button, Flex, Heading, useWalletModal, WalletIcon } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useKickstarterContext } from 'contexts/kickstarter'
import React, { useState, useCallback } from 'react'
import login from 'utils/login'
import { TranslateString } from 'utils/translateTextHelpers'
import ProjectCard from './ProjectCard'
import ProjectDetails from './ProjectDetails'

function BackedProject() {
  const { account, onPresentConnectModal } = useKickstarterContext()

  const [selectedProject, setSelectedProject] = useState("")

  const toggleSelectedProject = () => {
    setSelectedProject("")
  }

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

  if (selectedProject !== "") {
    return <ProjectDetails toggleSelectedProject={toggleSelectedProject} />
  }

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="24px">Backed Projects</Heading>
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

export default BackedProject;
