import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { Kickstarter, OrderDirection, OrderKickstarterBy } from 'types/kickstarter'
import ProjectDetails from './ProjectDetails'
import KickstarterTable from '../shared/KickstarterTable'

function ApprovalHistory() {
  const [sortField, setSortField] = useState(OrderKickstarterBy.TITLE)
  const [sortDirection, setSortDirection] = useState(OrderDirection.ASC)
  const [page, setPage] = useState(1)
  const [showKickstarterId, setShowKickstarterId] = useState<string>()

  const maxPage = 10

  const kickstarters: Kickstarter[] = [
    {
      id: 'a1',
      title: 'Makenna Kickstarter',
      projectGoals: new BigNumber(10),
      minContribution: new BigNumber(1),
      endTimestamp: new BigNumber(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7),
    },
    {
      id: 'b1',
      title: 'Makenna Kickstarter',
      projectGoals: new BigNumber(10),
      minContribution: new BigNumber(1),
      endTimestamp: new BigNumber(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7),
    },
  ]

  if (showKickstarterId) {
    return (
      <ProjectDetails
        kickstarterId={showKickstarterId}
      />
    )
  }

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
      handleShowKickstarter={setShowKickstarterId}
    />
  )
}

export default ApprovalHistory
