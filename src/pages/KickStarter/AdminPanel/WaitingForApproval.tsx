import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { Kickstarter, OrderDirection, OrderKickstarterBy } from 'types/kickstarter'
import KickstarterTable from '../shared/KickstarterTable'
import ProjectDetails from './ProjectDetails'

type Props = {
  handleShowKickstarter: (kickstarterId: string) => void
}

function WaitingForApproval({ handleShowKickstarter }: Props) {
  const [sortField, setSortField] = useState(OrderKickstarterBy.TITLE)
  const [sortDirection, setSortDirection] = useState(OrderDirection.ASC)
  const [page, setPage] = useState(1)

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
