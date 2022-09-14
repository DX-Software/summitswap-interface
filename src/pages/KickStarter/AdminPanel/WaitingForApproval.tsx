import { useKickstarterFactoryById, useKickstartersByApprovalStatuses } from 'api/useKickstarterApi'
import { KICKSTARTER_FACTORY_ADDRESS, PER_PAGE } from 'constants/kickstarter'
import React, { useMemo, useState } from 'react'
import { KickstarterApprovalStatusId, OrderDirection, OrderKickstarterBy } from 'types/kickstarter'
import KickstarterTable from '../shared/KickstarterTable'

type Props = {
  handleShowKickstarter: (kickstarterId: string) => void
}

function WaitingForApproval({ handleShowKickstarter }: Props) {
  const [sortField, setSortField] = useState(OrderKickstarterBy.TITLE)
  const [sortDirection, setSortDirection] = useState(OrderDirection.ASC)
  const [page, setPage] = useState(1)

  const kickstarterFactory = useKickstarterFactoryById(KICKSTARTER_FACTORY_ADDRESS)

  const maxPage = useMemo(() => {
    const totalItems = kickstarterFactory.data?.totalWaitingForApprovalKickstarter?.toNumber() || 1
    return Math.ceil(totalItems / PER_PAGE)
  }, [kickstarterFactory.data])

  const kickstarters = useKickstartersByApprovalStatuses([KickstarterApprovalStatusId.WAITING_FOR_APPROVAL], page)

  return (
    <KickstarterTable
      kickstarters={kickstarters}
      currentPage={page}
      maxPage={maxPage}
      sortField={sortField}
      sortDirection={sortDirection}
      handlePageChanged={setPage}
      handleSortFieldChanged={setSortField}
      handleSortDirectionChanged={setSortDirection}
      handleShowKickstarter={handleShowKickstarter}
    />
  )
}

export default WaitingForApproval
