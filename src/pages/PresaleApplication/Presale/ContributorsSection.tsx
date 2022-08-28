/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Pagination } from '@mui/material'
import { Box, Flex } from '@koda-finance/summitswap-uikit'
import { usePresaleContract } from 'hooks/useContract'
import { ADDRESS_PER_PAGE } from 'constants/presale'
import { PresaleInfo } from '../types'
import { StyledText, usePaginationStyles } from './Shared'

interface Props {
  presaleAddress: string
  presaleInfo: PresaleInfo | undefined
}

const PlaceHolderParticipants = styled.div`
  width: 4px;
  height: 24px;
  background: ${({ theme }) => theme.colors.primaryDark};
  margin-right: 8px;
`

const AddressBox = styled(Flex)`
  align-items: center;
  padding: 8px 8px 8px 12px;
  height: 45px;
  background: ${({ theme }) => theme.colors.inputColor};
  margin-bottom: 8px;
`

const WhitelistSection = ({ presaleAddress, presaleInfo }: Props) => {
  const [contributorsPage, setContributorsPage] = useState(1)
  const [contributors, setContributors] = useState<string[]>([])

  const presaleContract = usePresaleContract(presaleAddress)

  useEffect(() => {
    async function fetchContributors() {
      setContributors(await presaleContract?.getContributors())
    }
    if (presaleContract) fetchContributors()
  }, [presaleInfo, presaleContract])

  const paginationStyles = usePaginationStyles()

  const startIndex = contributorsPage * ADDRESS_PER_PAGE - ADDRESS_PER_PAGE
  const endIndex =
    startIndex + ADDRESS_PER_PAGE > contributors.length ? contributors.length : startIndex + ADDRESS_PER_PAGE
  const slicedAddresses = contributors.slice(startIndex, endIndex)

  return (
    <Box>
      <Flex marginTop="16px">
        <PlaceHolderParticipants />
        <StyledText fontWeight={700} color="primaryDark">
          Contributors ({contributors.length})
        </StyledText>
      </Flex>

      <Box marginTop="8px">
        {slicedAddresses.map((address) => (
          <AddressBox key={address} justifyContent="space-between">
            <StyledText fontSize="14px" marginLeft="16px" color="textSubtle">
              {address}
            </StyledText>
          </AddressBox>
        ))}
        <Box height="24px" />
        {contributors.length > 0 && (
          <Pagination
            variant="outlined"
            shape="rounded"
            sx={paginationStyles}
            count={Math.ceil(contributors.length / ADDRESS_PER_PAGE)}
            page={contributorsPage}
            onChange={(_, value: number) => setContributorsPage(value)}
          />
        )}
      </Box>
    </Box>
  )
}

export default WhitelistSection
