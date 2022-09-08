import { useKickstartersByApprovalStatuses } from 'api/useKickstarterApi'
import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { Kickstarter, KickstarterApprovalStatusId, OrderDirection, OrderKickstarterBy } from 'types/kickstarter'
import KickstarterTable from '../shared/KickstarterTable'
import ProjectDetails from './KickstarterDetails'

type Props = {
  handleShowKickstarter: (kickstarterId: string) => void
}

function WaitingForApproval({ handleShowKickstarter }: Props) {
  const [sortField, setSortField] = useState(OrderKickstarterBy.TITLE)
  const [sortDirection, setSortDirection] = useState(OrderDirection.ASC)
  const [page, setPage] = useState(1)

  const maxPage = 10

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
