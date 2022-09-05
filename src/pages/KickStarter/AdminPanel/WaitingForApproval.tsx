import { ArrowBackIcon, ArrowForwardIcon, Text } from '@koda-finance/summitswap-uikit'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from 'components/InfoTables/shared'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { OrderKickstarterBy } from 'types/kickstarter'

/**
 *  Columns on different layouts
 *  6 = | # | Name | Price | Price Change | Volume 24H | TVL |
 *  5 = | # | Name | Price |              | Volume 24H | TVL |
 *  4 = | # | Name | Price |              | Volume 24H |     |
 *  2 = |   | Name |       |              | Volume 24H |     |
 *  On smallest screen Name is reduced to just symbol
 */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 2fr repeat(5, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 2fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 2fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
      display: none;
    }
  }
`

const LinkWrapper = styled.div`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const DataRow = ({
  data,
}: {
  data: {
    title: string
    projectGoals: string
    minBacking: string
    dueDate: string
    projectStatus: string
  }
}) => {
  return (
    <LinkWrapper>
      <ResponsiveGrid>
        <Text fontWeight={400}>{data.title}</Text>
        <Text fontWeight={400}>{data.projectGoals}</Text>
        <Text fontWeight={400}>{data.minBacking}</Text>
        <Text fontWeight={400}>{data.dueDate}</Text>
        <Text fontWeight={400}>{data.projectStatus}</Text>
        <Text fontWeight={400}>View</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

function WaitingForApproval() {
  const { t } = useTranslation()

  const [sortField, setSortField] = useState(OrderKickstarterBy.TITLE)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const [page, setPage] = useState(1)

  const maxPage = 10

  const handleSort = useCallback(
    (newField: OrderKickstarterBy) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField]
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField]
  )

  const kickstarters = [
    {
      id: 'a1',
      title: 'Makenna Kickstarter',
      projectGoals: '1000 BNB',
      minBacking: '0.1 BNB',
      dueDate: '2022.08.04',
      projectStatus: 'ABC',
    },
    {
      id: 'b1',
      title: 'Makenna Kickstarter',
      projectGoals: '1000 BNB',
      minBacking: '0.1 BNB',
      dueDate: '2022.08.04',
      projectStatus: 'ABC',
    },
    {
      id: 'c1',
      title: 'Makenna Kickstarter',
      projectGoals: '1000 BNB',
      minBacking: '0.1 BNB',
      dueDate: '2022.08.04',
      projectStatus: 'ABC',
    },
  ]

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <ClickableColumnHeader
          color="white"
          fontSize="12px"
          bold
          onClick={() => handleSort(OrderKickstarterBy.TITLE)}
          textTransform="uppercase"
        >
          Project Name {arrow(OrderKickstarterBy.TITLE)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="white"
          fontSize="12px"
          bold
          onClick={() => handleSort(OrderKickstarterBy.PROJECT_GOALS)}
          textTransform="uppercase"
        >
          Project Goals {arrow(OrderKickstarterBy.PROJECT_GOALS)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="white"
          fontSize="12px"
          bold
          onClick={() => handleSort(OrderKickstarterBy.MIN_CONTRIBUTION)}
          textTransform="uppercase"
        >
          Min. Backing {arrow(OrderKickstarterBy.MIN_CONTRIBUTION)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="white"
          fontSize="12px"
          bold
          onClick={() => handleSort(OrderKickstarterBy.END_TIMESTAMP)}
          textTransform="uppercase"
        >
          Due Date {arrow(OrderKickstarterBy.END_TIMESTAMP)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="white"
          fontSize="12px"
          bold
          onClick={() => handleSort(OrderKickstarterBy.STATUS)}
          textTransform="uppercase"
        >
          Project Status {arrow(OrderKickstarterBy.STATUS)}
        </ClickableColumnHeader>
        <div />
      </ResponsiveGrid>
      <Break />
      {kickstarters.map((data) => {
        if (data) {
          return (
            <React.Fragment key={data.id}>
              <DataRow data={data} />
              <Break />
            </React.Fragment>
          )
        }
        return null
      })}
      <PageButtons>
        <Arrow
          onClick={() => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
        </Arrow>
        <Text>{t('Page {{ page }} of {{ maxPage }}', { page, maxPage })}</Text>
        <Arrow
          onClick={() => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
        </Arrow>
      </PageButtons>
    </TableWrapper>
  )
}

export default WaitingForApproval
