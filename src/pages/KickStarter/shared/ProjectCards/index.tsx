import { ArrowBackIcon, ArrowForwardIcon, Flex, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { Arrow, PageButtons } from 'components/InfoTables/shared'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { UseQueryResult } from 'react-query'
import { Kickstarter, OrderDirection, OrderKickstarterBy } from 'types/kickstarter'
import KickstartersLoadingSection from '../KickstartersLoadingSection'
import ProjectCard from './ProjectCard'

type Props = {
  kickstarters: UseQueryResult<Kickstarter[]>
  currentPage: number
  maxPage: number
  handlePageChanged: (value: number) => void
  handleShowKickstarter: (kickstarterId: string) => void
  getEmptyKickstarterSection: () => JSX.Element
}

function ProjectCards({
  kickstarters,
  currentPage,
  maxPage,
  handlePageChanged,
  handleShowKickstarter,
  getEmptyKickstarterSection,
}: Props) {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <Grid container spacing={2}>
        {kickstarters.isFetching ? (
          <KickstartersLoadingSection />
        ): kickstarters.isFetched && kickstarters.data?.length === 0 ? (
          getEmptyKickstarterSection()
        ): kickstarters.data?.map((kickstarter) => (
          <Grid item xs={12} sm={6} lg={4} key={kickstarter.id}>
            <ProjectCard
              kickstarter={kickstarter}
              onClick={() => handleShowKickstarter(kickstarter.id)}
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
                handlePageChanged(currentPage === 1 ? currentPage : currentPage - 1)
              }}
            >
              <ArrowBackIcon color={currentPage === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>

            <Text>{t('Page {{ currentPage }} of {{ maxPage }}', { currentPage, maxPage })}</Text>
            <Arrow
              onClick={() => {
                handlePageChanged(currentPage === maxPage ? currentPage : currentPage + 1)
              }}
            >
              <ArrowForwardIcon color={currentPage === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </PageButtons>
        </>
      )}
    </Flex>
  )
}

export default ProjectCards
