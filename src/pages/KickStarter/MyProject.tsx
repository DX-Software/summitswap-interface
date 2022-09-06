import { AddIcon, ArrowBackIcon, ArrowForwardIcon, Button, Flex, Heading, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { Arrow, PageButtons } from 'components/InfoTables/shared'
import { PER_PAGE } from 'constants/kickstarter'
import { useKickstarterContext } from 'pages/KickStarter/contexts/kickstarter'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import CreateProject from './CreateProject'
import ProjectCard from './ProjectCard'
import ProjectDetails from './ProjectDetails'
import ConnectWalletSection from './shared/ConnectWalletSection'
import EmptyMyKickstarterSection from './shared/EmptyMyKickstarterSection'
import { Project } from './types'

function MyProject() {
  const { t } = useTranslation()

  const {
    account,
    kickstarterAccount,

    myKickstarters,
    myProjectAddress,
    myProjectPage,

    isPaymentOnMyProjectPage,
    isCreate,

    kickstarterOnMyProject,
    currentBackedAmountOnMyProjectPage,
    backingAmountOnMyProjectPage,
    contributorsOnMyProject,

    toggleIsCreate,

    handleMyProjectChanged,
    handleMyProjectPageChanged,
    handleIsPaymentOnMyProjectPage,
    handleBackingAmountOnMyProjectPageChanged,
  } = useKickstarterContext()

  const maxPage = useMemo(() => {
    const totalItems = kickstarterAccount?.totalKickstarter.toNumber() || 1;
    return Math.ceil(totalItems / PER_PAGE)
  }, [kickstarterAccount?.totalKickstarter])

  if (!account) {
    return <ConnectWalletSection />
  }

  if (isCreate) {
    return <CreateProject />
  }

  if (!myKickstarters || myKickstarters.length === 0) {
    return <EmptyMyKickstarterSection />
  }

  if (myProjectAddress) {
    return (
      <ProjectDetails
        kickstarter={kickstarterOnMyProject}
        isPayment={isPaymentOnMyProjectPage}
        toggleIsPayment={() => handleIsPaymentOnMyProjectPage(!isPaymentOnMyProjectPage)}
        currentBackedAmount={currentBackedAmountOnMyProjectPage?.toString() || ""}
        backedAmount={backingAmountOnMyProjectPage}
        handleBackedAmountChanged={handleBackingAmountOnMyProjectPageChanged}
        contributors={contributorsOnMyProject}
        onBack={() => handleMyProjectChanged(undefined)}
      />
    )
  }

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between" marginBottom="24px">
        <Heading size="xl">My Projects</Heading>
        <Button scale="sm" startIcon={<AddIcon width="12px" color="text" />} style={{ fontFamily: 'Poppins' }} onClick={toggleIsCreate}>
          Create New Project
        </Button>
      </Flex>
      <Grid container spacing={2}>
        {myKickstarters && myKickstarters.map((kickstarter) => (
          <Grid item xs={12} sm={6} lg={4}>
            <ProjectCard
              kickstarter={kickstarter}
              onClick={() => handleMyProjectChanged(kickstarter.id)}
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
                handleMyProjectPageChanged(myProjectPage === 1 ? myProjectPage : myProjectPage - 1)
              }}
            >
              <ArrowBackIcon color={myProjectPage === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>

            <Text>{t('Page {{ myProjectPage }} of {{ maxPage }}', { myProjectPage, maxPage })}</Text>
            <Arrow
              onClick={() => {
                handleMyProjectPageChanged(myProjectPage === maxPage ? myProjectPage : myProjectPage + 1)
              }}
            >
              <ArrowForwardIcon color={myProjectPage === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </PageButtons>
        </>
      )}
    </Flex>
  )
}

export default React.memo(MyProject)
