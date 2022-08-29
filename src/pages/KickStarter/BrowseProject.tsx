import { ArrowBackIcon, ArrowForwardIcon, Flex, Heading, Input, SearchIcon, Select, SortIcon, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { Arrow, PageButtons } from 'components/InfoTables/shared'
import { PER_PAGE } from 'constants/kickstarter'
import { useKickstarterContext } from 'contexts/kickstarter'
import { OrderDirection } from 'hooks/useKickstarters'
import React, { useMemo } from 'react'
import { isDesktop } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import ProjectCard from './ProjectCard'
import ProjectCardMobile from './ProjectCardMobile'
import ProjectDetails from './ProjectDetails'
import ProductLoadingSection from './shared/ProductLoadingSection'

function BrowseProject() {
  const { t } = useTranslation()

  const {
    kickstarterFactory,
    almostEndedKickstarters,
    kickstarters,
    browseProjectAddress,
    browseProjectPage,
    isPaymentOnBrowseProjectPage,
    kickstarterOnBrowseProject,
    currentBackedAmountOnBrowseProjectPage,
    backingAmountOnBrowseProjectPage,
    handleBrowseProjectChanged,
    handleKickstarterOrderDirectionChanged,
    handleSearchKickstarterChanged,
    handleBrowseProjectPageChanged,
    handleIsPaymentOnBrowseProjectPage,
    handleBackingAmountOnBrowseProjectPageChanged,
  } = useKickstarterContext()

  const maxPage = useMemo(() => {
    const totalItems = kickstarterFactory?.totalKickstarter.toNumber() || 1;
    return Math.ceil(totalItems / PER_PAGE)
  }, [kickstarterFactory?.totalKickstarter])

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
        kickstarter={kickstarterOnBrowseProject}
        isPayment={isPaymentOnBrowseProjectPage}
        toggleIsPayment={() => handleIsPaymentOnBrowseProjectPage(!isPaymentOnBrowseProjectPage)}
        currentBackedAmount={currentBackedAmountOnBrowseProjectPage?.toString() || ""}
        backedAmount={backingAmountOnBrowseProjectPage}
        handleBackedAmountChanged={handleBackingAmountOnBrowseProjectPageChanged}
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
              <Grid item xs={12} sm={6} lg={4} key={kickstarter.id}>
                {isDesktop ? (
                  <ProjectCard
                    kickstarter={kickstarter}
                    onClick={() => handleBrowseProjectChanged(kickstarter.id)}
                  />
                ) : (
                  <ProjectCardMobile
                    kickstarter={kickstarter}
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
          placeholder="Search project by title or creator name"
          onChange={(e) => handleSearchKickstarterChanged(e.target.value)}
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
        {kickstarters && kickstarters.length === 0 && (
          <Grid item xs={12} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "48px" }}>
            <SearchIcon color="backgroundDisabled" width="120px" />
            <Text textAlign="center" color="textDisabled">
              Search Not Found
            </Text>
          </Grid>
        )}
        {kickstarters && kickstarters.map((kickstarter) => (
          <Grid item xs={12} sm={6} lg={4} key={kickstarter.id}>
            {isDesktop ? (
              <ProjectCard
                kickstarter={kickstarter}
                onClick={() => handleBrowseProjectChanged(kickstarter.id)}
              />
            ) : (
              <ProjectCardMobile
                kickstarter={kickstarter}
                onClick={() => handleBrowseProjectChanged(kickstarter.id)}
              />
            )}
          </Grid>
        ))}
      </Grid>
      {maxPage > 1 && (
        <>
          <br />
          <PageButtons>
            <Arrow
              onClick={() => {
                handleBrowseProjectPageChanged(browseProjectPage === 1 ? browseProjectPage : browseProjectPage - 1)
              }}
            >
              <ArrowBackIcon color={browseProjectPage === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>

            <Text>{t('Page {{ browseProjectPage }} of {{ maxPage }}', { browseProjectPage, maxPage })}</Text>
            <Arrow
              onClick={() => {
                handleBrowseProjectPageChanged(browseProjectPage === maxPage ? browseProjectPage : browseProjectPage + 1)
              }}
            >
              <ArrowForwardIcon color={browseProjectPage === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </PageButtons>
        </>
      )}
    </Flex>
  )
}

export default BrowseProject;
