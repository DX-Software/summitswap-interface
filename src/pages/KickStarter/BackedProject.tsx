import { ArrowBackIcon, ArrowForwardIcon, Flex, Heading, Skeleton, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { Arrow, PageButtons } from 'components/InfoTables/shared'
import { PER_PAGE } from 'constants/kickstarter'
import { useKickstarterContext } from 'contexts/kickstarter'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ProjectCard from './ProjectCard'
import ProjectDetails from './ProjectDetails'
import ConnectWalletSection from './shared/ConnectWalletSection'
import EmptyKickstarterSection from './shared/EmptyKickstarterSection'
import ProductLoadingSection from './shared/ProductLoadingSection'

type Props = {
  goToBrowseTab: () => void
}

function BackedProject({ goToBrowseTab }: Props) {
  const { t } = useTranslation()

  const {
    account,
    kickstarterAccount,
    backedProjects,
    backedProjectAddress,
    backedProjectPage,
    handleBackedProjectChanged,
    handleBackedProjectPageChanged,
  } = useKickstarterContext()

  const maxPage = useMemo(() => {
    const totalItems = kickstarterAccount?.totalBackedKickstarter.toNumber() || 1;
    return Math.ceil(totalItems / PER_PAGE)
  }, [kickstarterAccount?.totalBackedKickstarter])

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
        {!backedProjects && (
          <ProductLoadingSection />
        )}
        {backedProjects && backedProjects.length === 0 && (
          <EmptyKickstarterSection goToBrowseTab={goToBrowseTab} />
        )}
        {backedProjects && backedProjects.map((backedProject) => (
          <Grid item xs={12} sm={6} lg={4} key={backedProject.id}>
            <ProjectCard
              kickstarter={backedProject.kickstarter}
              onClick={() => handleBackedProjectChanged(backedProject.kickstarter.id)}
            />
          </Grid>
        ))}
      </Grid>
      {maxPage > 1 && (
        <>
          <br />
          <PageButtons>
            <Arrow
              onClick={() => {
                handleBackedProjectPageChanged(backedProjectPage === 1 ? backedProjectPage : backedProjectPage - 1)
              }}
            >
              <ArrowBackIcon color={backedProjectPage === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>

            <Text>{t('Page {{ backedProjectPage }} of {{ maxPage }}', { backedProjectPage, maxPage })}</Text>
            <Arrow
              onClick={() => {
                handleBackedProjectPageChanged(backedProjectPage === maxPage ? backedProjectPage : backedProjectPage + 1)
              }}
            >
              <ArrowForwardIcon color={backedProjectPage === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </PageButtons>
        </>
      )}
    </Flex>
  )
}

export default BackedProject;
