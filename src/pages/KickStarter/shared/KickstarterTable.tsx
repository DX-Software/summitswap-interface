import { ArrowBackIcon, ArrowForwardIcon, Skeleton, Text } from '@koda-finance/summitswap-uikit'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from 'components/InfoTables/shared'
import { PER_PAGE } from 'constants/kickstarter'
import { format } from 'date-fns'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { UseQueryResult } from 'react-query'
import styled from 'styled-components'
import { Kickstarter, OrderKickstarterBy, OrderDirection } from 'types/kickstarter'
import { getKickstarterApprovalStatusLabel } from 'utils/kickstarter'
import { StatusText } from '.'

type Props = {
  kickstarters: UseQueryResult<Kickstarter[]>
  currentPage: number
  maxPage: number
  sortField: OrderKickstarterBy
  sortDirection: OrderDirection
  handlePageChanged: (value: number) => void
  handleSortFieldChanged: (value: OrderKickstarterBy) => void
  handleSortDirectionChanged: (value: OrderDirection) => void
  handleShowKickstarter: (kickstarterId: string) => void
}

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 2fr repeat(5, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 2fr repeat(4, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 2fr repeat(3, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    > *:nth-child(2) {
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

const DataRowLoading = () => {
  const skeletons = Array.from(Array(PER_PAGE).keys())
  return (
    <>
      {skeletons.map((skeleton) => (
        <ResponsiveGrid key={`skeleton-${skeleton}`}>
          <Skeleton height={24} />
          <Skeleton height={24} />
          <Skeleton height={24} />
          <Skeleton height={24} />
          <Skeleton height={24} />
          <Skeleton height={24} />
        </ResponsiveGrid>
      ))}
      <br />
    </>
  )
}

const DataRow: React.FC<{ kickstarter: Kickstarter; handleShowKickstarter: (kickstarterId: string) => void }> = ({
  kickstarter,
  handleShowKickstarter,
}) => {
  return (
    <LinkWrapper onClick={() => handleShowKickstarter(kickstarter.id)}>
      <ResponsiveGrid>
        <Text fontWeight={400}>{kickstarter.title}</Text>
        <Text fontWeight={400}>
          {kickstarter.projectGoals?.toString()} {kickstarter.tokenSymbol?.toString()}
        </Text>
        <Text fontWeight={400}>
          {kickstarter.minContribution?.toString()} {kickstarter.tokenSymbol?.toString()}
        </Text>
        <Text fontWeight={400}>
          {format(new Date((kickstarter?.endTimestamp?.toNumber() || 0) * 1000), 'yyyy.MM.dd HH:mm O')}
        </Text>
        <StatusText approvalStatus={kickstarter.approvalStatus} fontWeight={400}>
          {getKickstarterApprovalStatusLabel(kickstarter.approvalStatus)}
        </StatusText>
        <Text fontWeight={400} color="primary">
          View
        </Text>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

function KickstarterTable({
  kickstarters,
  currentPage,
  maxPage,
  sortField,
  sortDirection,
  handlePageChanged,
  handleSortFieldChanged,
  handleSortDirectionChanged,
  handleShowKickstarter,
}: Props) {
  const { t } = useTranslation()

  const handleSort = useCallback(
    (newField: OrderKickstarterBy) => {
      handleSortFieldChanged(newField)
      if (sortField !== newField) {
        handleSortDirectionChanged(OrderDirection.ASC)
      } else if (sortDirection === OrderDirection.ASC) {
        handleSortDirectionChanged(OrderDirection.DESC)
      } else {
        handleSortDirectionChanged(OrderDirection.ASC)
      }
    },
    [sortDirection, sortField, handleSortFieldChanged, handleSortDirectionChanged]
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = sortDirection === OrderDirection.DESC ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField]
  )

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
      {kickstarters.isFetching && <DataRowLoading />}
      {!kickstarters.isFetching &&
        kickstarters.data &&
        kickstarters.data.map((kickstarter) => {
          return (
            <React.Fragment key={kickstarter.id}>
              <DataRow kickstarter={kickstarter} handleShowKickstarter={handleShowKickstarter} />
              <Break />
            </React.Fragment>
          )
        })}
      {!kickstarters.isFetching && kickstarters.data && kickstarters.data.length === 0 && (
        <Text textAlign="center" marginBottom="16px">
          No Data Found
        </Text>
      )}
      {maxPage > 1 && (
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
      )}
    </TableWrapper>
  )
}

export default KickstarterTable
