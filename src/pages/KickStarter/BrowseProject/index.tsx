import { Box, Flex, Heading, Input, Select, SortIcon } from '@koda-finance/summitswap-uikit'
import {
  useKickstarterByEndTimeBetween,
  useKickstarterFactoryById,
  useKickstartersByApprovalStatuses,
} from 'api/useKickstarterApi'
import { KICKSTARTER_FACTORY_ADDRESS, PER_PAGE } from 'constants/kickstarter'
import { add, getUnixTime } from 'date-fns'
import useDebounce from 'hooks/useDebounce'
import useParsedQueryString from 'hooks/useParsedQueryString'
import React, { useEffect, useMemo, useState } from 'react'
import { KickstarterApprovalStatusId, OrderDirection, OrderKickstarterBy } from 'types/kickstarter'
import { isAddress } from 'utils'
import KickstarterDetails from '../KickstarterDetails'
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

const currentTimestamp = getUnixTime(new Date())
const nextWeekTimestamp = getUnixTime(add(new Date(), { weeks: 1 }))

function BrowseProject() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<OrderDirection>(OrderDirection.ASC)
  const [searchKickstarter, setSearchKickstarter] = useState<string>('')
  const [showKickstarterId, setShowKickstarterId] = useState<string>()

  const debouncedSearchTerm = useDebounce(searchKickstarter, 600)

  const parsedQs = useParsedQueryString()
  const kickstarters = useKickstartersByApprovalStatuses(
    [KickstarterApprovalStatusId.APPROVED],
    currentPage,
    PER_PAGE,
    OrderKickstarterBy.TITLE,
    sortBy,
    debouncedSearchTerm
  )
  const almostEndedKickstarters = useKickstarterByEndTimeBetween(
    [KickstarterApprovalStatusId.APPROVED],
    currentTimestamp,
    nextWeekTimestamp
  )
  const kickstarterFactory = useKickstarterFactoryById(KICKSTARTER_FACTORY_ADDRESS)

  const maxPage = useMemo(() => {
    if (searchKickstarter) return 1

    const totalItems = kickstarterFactory?.data?.totalKickstarter?.toNumber() || 1
    return Math.ceil(totalItems / PER_PAGE)
  }, [kickstarterFactory?.data, searchKickstarter])

  useEffect(() => {
    if (!parsedQs.kickstarter || !isAddress(parsedQs.kickstarter.toString())) return
    setShowKickstarterId(parsedQs.kickstarter.toString())
  }, [parsedQs])

  if (showKickstarterId) {
    return (
      <KickstarterDetails
        previousPage="Browse Project"
        kickstarterId={showKickstarterId}
        handleKickstarterId={setShowKickstarterId}
      />
    )
  }

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
            mobileMode
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
        mobileMode
        showMobileStatus
      />
    </Flex>
  )
}

export default React.memo(BrowseProject)
