import { Box, Flex, Heading, Input, Select, SortIcon } from '@koda-finance/summitswap-uikit'
import { useKickstarterByEndTimeBetween, useKickstarterFactoryById, useKickstarters } from 'api/useKickstarterApi'
import { KICKSTARTER_FACTORY_ADDRESS, PER_PAGE } from 'constants/kickstarter'
import { add, getUnixTime } from 'date-fns'
import React, { useMemo, useState } from 'react'
import { OrderDirection, OrderKickstarterBy } from 'types/kickstarter'
import ProjectCards from '../shared/ProjectCards'
import EmptyKickstarterSection from './EmptyKickstarterSection'

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

function BackedProject() {
  const currentTimestamp = getUnixTime(new Date())
  const nextWeekTimestamp = getUnixTime(add(new Date(), { weeks: 1 }))

  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<OrderDirection>(OrderDirection.ASC)
  const [searchKickstarter, setSearchKickstarter] = useState<string>('')
  const [showKickstarterId, setShowKickstarterId] = useState<string>()

  const kickstarters = useKickstarters(currentPage, PER_PAGE, OrderKickstarterBy.TITLE, sortBy, searchKickstarter)
  const almostEndedKickstarters = useKickstarterByEndTimeBetween(currentTimestamp, nextWeekTimestamp)
  const kickstarterFactory = useKickstarterFactoryById(KICKSTARTER_FACTORY_ADDRESS)

  const maxPage = useMemo(() => {
    if (searchKickstarter) return 1

    const totalItems = kickstarterFactory?.data?.totalKickstarter?.toNumber() || 1
    return Math.ceil(totalItems / PER_PAGE)
  }, [kickstarterFactory?.data, searchKickstarter])

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="24px">
        Browse Project
      </Heading>
      {!!almostEndedKickstarters.data?.length && (
        <Box marginBottom="60px">
          <Heading size="lg" marginBottom="24px">
            End Soon Project
          </Heading>
          <ProjectCards
            kickstarters={almostEndedKickstarters}
            currentPage={1}
            maxPage={1}
            handlePageChanged={setCurrentPage}
            handleShowKickstarter={setShowKickstarterId}
            getEmptyKickstarterSection={() => <EmptyKickstarterSection />}
          />
        </Box>
      )}
      <Heading size="lg" marginBottom="24px">
        Browse All Projects
      </Heading>
      <Flex style={{ columnGap: '12px' }} marginBottom="24px">
        <Input
          type="search"
          placeholder="Search project by title or creator name"
          onChange={(e) => setSearchKickstarter(e.target.value)}
        />
        <Select
          startIcon={<SortIcon color="text" />}
          onValueChanged={(value) => setSortBy(value as OrderDirection)}
          options={sortOptions}
          minWidth="165px"
        />
      </Flex>
      <ProjectCards
        kickstarters={kickstarters}
        currentPage={currentPage}
        maxPage={maxPage}
        handlePageChanged={setCurrentPage}
        handleShowKickstarter={setShowKickstarterId}
        getEmptyKickstarterSection={() => <EmptyKickstarterSection />}
      />
    </Flex>
  )
}

export default React.memo(BackedProject)
