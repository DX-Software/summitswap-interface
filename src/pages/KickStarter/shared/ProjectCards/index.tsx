import { ArrowBackIcon, ArrowForwardIcon, Flex, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { Arrow, PageButtons } from 'components/InfoTables/shared'
import { isMobile } from 'react-device-detect'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { UseQueryResult } from 'react-query'
import { Kickstarter } from 'types/kickstarter'
import KickstartersLoadingSection from '../KickstartersLoadingSection'
import ProjectCard from './ProjectCard'
import ProjectCardMobile from './ProjectCardMobile'

type Props = {
  kickstarters: UseQueryResult<Kickstarter[]>
  currentPage: number
  maxPage: number
  mobileMode?: boolean
  showMobileStatus?: boolean
  handlePageChanged: (value: number) => void
  handleShowKickstarter: (kickstarterId: string) => void
  getEmptyKickstarterSection: () => JSX.Element
}

function ProjectCards({
  kickstarters,
  currentPage,
  maxPage,
  mobileMode,
  showMobileStatus,
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
            {isMobile && mobileMode ? (
              <ProjectCardMobile
                kickstarter={kickstarter}
                onClick={() => handleShowKickstarter(kickstarter.id)}
                showStatus={!!showMobileStatus}
              />
            ) : (
              <ProjectCard
                kickstarter={kickstarter}
                onClick={() => handleShowKickstarter(kickstarter.id)}
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
