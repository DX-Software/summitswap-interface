/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useMemo } from 'react'
import { Pagination } from '@mui/material'
import { formatUnits } from 'ethers/lib/utils'
import { Box, Button, Flex, useModal } from '@koda-finance/summitswap-uikit'
import { usePresaleContract } from 'hooks/useContract'
import { ADDRESS_PER_PAGE, HEADERS_CONTRIBUTORS } from 'constants/presale'
import { PresaleInfo } from '../types'
import { StyledText, usePaginationStyles } from './Shared'
import { AddressBox, WhitelistRadio, PlaceHolderParticipants } from './WhitelistSection'
import ViewAddressesModal from './ViewAddressesModal'

interface Props {
  presaleAddress: string
  currency: string
  presaleInfo: PresaleInfo | undefined
  paymentTokenDecimals: number | undefined
}

const ContributorsSection = ({ presaleAddress, currency, presaleInfo, paymentTokenDecimals }: Props) => {
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([])
  const [contributorsPage, setContributorsPage] = useState(1)
  const [contributors, setContributors] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<
    {
      currency: string
      wallet: string
      amount: string
      number: number
    }[]
  >()

  const presaleContract = usePresaleContract(presaleAddress)

  useEffect(() => {
    async function fetchContributors() {
      setContributors(await presaleContract?.getContributors())
    }
    if (presaleContract) fetchContributors()
  }, [presaleInfo, presaleContract])

  const paginationStyles = usePaginationStyles()

  const selectAddressHandler = (address: string) => {
    if (selectedAddresses.includes(address)) {
      setSelectedAddresses((prevAddresses) => prevAddresses.filter((add) => add !== address))
    } else {
      setSelectedAddresses((prevAddresses) => [...prevAddresses, address])
    }
  }
  const contributorsData = useMemo(async () => {
    if (contributors && presaleContract) {
      return Promise.all(
        contributors.map(async (contributor) => {
          return {
            currency,
            wallet: contributor,
            amount: formatUnits(await presaleContract.bought(contributor), paymentTokenDecimals),
          }
        })
      )
    }
    return []
  }, [contributors, presaleContract, currency, paymentTokenDecimals])

  const closeContributorsModalHandler = () => {
    closeContributorsModal()
  }

  useEffect(() => {
    async function filterData() {
      const allData = await contributorsData
      setFilteredData(
        allData
          .filter((data) => selectedAddresses.includes(data.wallet))
          .map((data, index) => ({ ...data, number: index + 1 }))
      )
    }
    filterData()
  }, [contributorsData, selectedAddresses])

  const [openContributorsModal, closeContributorsModal] = useModal(
    <ViewAddressesModal
      title="Presale Whitelist"
      headers={HEADERS_CONTRIBUTORS}
      data={filteredData}
      onDismiss={closeContributorsModalHandler}
      isContributorsModal
    />
  )

  const startIndex = contributorsPage * ADDRESS_PER_PAGE - ADDRESS_PER_PAGE
  const endIndex =
    startIndex + ADDRESS_PER_PAGE > contributors.length ? contributors.length : startIndex + ADDRESS_PER_PAGE
  const slicedAddresses = contributors.slice(startIndex, endIndex)

  return (
    <Box>
      <Flex marginTop="16px" justifyContent="space-between">
        <Flex>
          <PlaceHolderParticipants />
          <StyledText fontWeight={700} color="primaryDark">
            Contributors ({contributors.length})
          </StyledText>
        </Flex>
        {selectedAddresses.length ? (
          <StyledText
            marginLeft="6px"
            fontSize="14px"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedAddresses([])}
          >
            Cancel Selection
          </StyledText>
        ) : (
          <StyledText
            marginLeft="6px"
            fontSize="14px"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedAddresses([...contributors])}
          >
            Select All
          </StyledText>
        )}
      </Flex>
      <Box marginTop="8px">
        {slicedAddresses.map((address) => (
          <AddressBox key={address} justifyContent="space-between">
            <Flex alignContent="center" alignItems="center">
              <WhitelistRadio
                checked={selectedAddresses.includes(address)}
                onClick={() => selectAddressHandler(address)}
              />
              <StyledText fontSize="14px" marginLeft="16px" color="textSubtle">
                {address}
              </StyledText>
            </Flex>
          </AddressBox>
        ))}
        {selectedAddresses.length > 0 && (
          <Flex marginTop="8px" justifyContent="end">
            <Button onClick={openContributorsModal} variant="tertiary" scale="sm" marginRight="8px">
              View Selected {`(${selectedAddresses.length})`}
            </Button>
          </Flex>
        )}
        <Box height="16px" />
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

export default ContributorsSection
