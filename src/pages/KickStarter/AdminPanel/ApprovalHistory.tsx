import { useKickstarterFactoryById, useKickstartersByApprovalStatuses } from 'api/useKickstarterApi'
import { KICKSTARTER_FACTORY_ADDRESS, PER_PAGE } from 'constants/kickstarter'
import React, { useMemo, useState } from 'react'
import { KickstarterApprovalStatusId, OrderDirection, OrderKickstarterBy } from 'types/kickstarter'
import KickstarterTable from '../shared/KickstarterTable'

type Props = {
  handleShowKickstarter: (kickstarterId: string) => void
}

function ApprovalHistory({ handleShowKickstarter }: Props) {
  const [sortField, setSortField] = useState(OrderKickstarterBy.TITLE)
  const [sortDirection, setSortDirection] = useState(OrderDirection.ASC)
  const [page, setPage] = useState(1)

  const kickstarterFactory = useKickstarterFactoryById(KICKSTARTER_FACTORY_ADDRESS)

  const maxPage = useMemo(() => {
    const totalApproved = kickstarterFactory.data?.totalApprovedKickstarter?.toNumber() || 1
    const totalRejected = kickstarterFactory.data?.totalRejectedKickstarter?.toNumber() || 1
    const totalItems = totalApproved + totalRejected
    return Math.ceil(totalItems / PER_PAGE)
  }, [kickstarterFactory.data])

  const kickstarters = useKickstartersByApprovalStatuses(
    [KickstarterApprovalStatusId.APPROVED, KickstarterApprovalStatusId.REJECTED],
    page
  )
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

export default ApprovalHistory
