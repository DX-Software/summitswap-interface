/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import styled from 'styled-components'
import { Pagination } from '@mui/material'
import { PRESALE_CARDS_PER_PAGE } from 'constants/presale'
import { Flex } from '@koda-finance/summitswap-uikit'
import { usePaginationStyles } from './Presale/Shared'
import PresaleCard from './PresaleCard'

const ResonsiveFlex = styled(Flex)`
  justify-content: space-evenly;
  @media (max-width: 680px) {
    justify-content: center;
  }
`

const PaginationWrapper = styled.div`
  position: fixed;
  right: 1;
`

interface Props {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  presaleAddresses: string[]
  filteredAddresses?: string[]
  viewPresaleHandler: (address: string) => void
}

const PresaleCards = ({ page, setPage, presaleAddresses, filteredAddresses, viewPresaleHandler }: Props) => {
  const paginationStyles = usePaginationStyles()

  const startIndex = page * PRESALE_CARDS_PER_PAGE - PRESALE_CARDS_PER_PAGE
  const endIndex =
    startIndex + PRESALE_CARDS_PER_PAGE > presaleAddresses.length
      ? presaleAddresses.length
      : startIndex + PRESALE_CARDS_PER_PAGE
  const slicedAddresses = presaleAddresses.slice(startIndex, endIndex)

  return (
    <>
      <ResonsiveFlex marginTop="16px" flexWrap="wrap">
        {(filteredAddresses?.length ? filteredAddresses : slicedAddresses).map((address) => (
          <PresaleCard key={address} viewPresaleHandler={viewPresaleHandler} presaleAddress={address} />
        ))}
      </ResonsiveFlex>

      <ResonsiveFlex>
        <PaginationWrapper>
          <Pagination
            variant="outlined"
            shape="rounded"
            sx={paginationStyles}
            count={filteredAddresses?.length ? 1 : Math.ceil(presaleAddresses.length / PRESALE_CARDS_PER_PAGE)}
            page={page}
            onChange={(_, value: number) => setPage(value)}
          />
        </PaginationWrapper>
      </ResonsiveFlex>
    </>
  )
}

export default PresaleCards
