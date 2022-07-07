/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import { Option } from 'react-dropdown'
import { useWeb3React } from '@web3-react/core'
import { Pagination } from '@mui/material'
import styled from 'styled-components'
import { AddressZero } from '@ethersproject/constants'
import { Text, Box, SearchIcon, Button, Flex, Input } from '@koda-finance/summitswap-uikit'
import { useFactoryPresaleContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import DropdownWrapper from '../../components/DropdownWrapper'
import CustomLightSpinner from '../../components/CustomLightSpinner'
import { NO_FILTER, FILTER_OWNER, PRESALE_CARDS_PER_PAGE, PRESALE_FACTORY_ADDRESS } from '../../constants/presale'
import PresaleCard from './PresaleCard'

interface Props {
  setButtonIndex: React.Dispatch<React.SetStateAction<number>>
}

const style = {
  '& .MuiPaginationItem-root ': {
    color: '#ffff',
  },
  '& ul > li > button:is(.Mui-selected)': {
    backgroundColor: '#000F18',
  },
}

const SearchInput = styled(Input)`
  border-radius: 10px;
  height: 60px;
  &:focus:not(:disabled) {
    box-shadow: 0 0;
  }
`
const StyledDropdownWrapper = styled(DropdownWrapper)`
  border-radius: 10px;
  width: 20%;
  max-width: 200px;
  min-width: 70px;
  & .Dropdown-arrow {
    margin-top: 10px !important;
  }
  & .Dropdown-control {
    padding-left: 26px;
    height: 60px;
    padding-top: 21px;
  }
`

const PresalesList = ({ setButtonIndex }: Props) => {
  const { account } = useWeb3React()

  const [presaleAddresses, setPresaleAddresses] = useState<string[]>([])
  const [filteredAddresses, setFilteredAddresses] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState(NO_FILTER)
  const [page, setPage] = useState(1)

  const presaleFactoryContract = useFactoryPresaleContract(PRESALE_FACTORY_ADDRESS)

  useEffect(() => {
    async function fetchPresaleAddresses() {
      setPresaleAddresses(await presaleFactoryContract?.getPresaleAddresses())
      setIsLoading(false)
    }
    if (presaleFactoryContract) {
      fetchPresaleAddresses()
    }
  }, [presaleFactoryContract])

  useEffect(() => {
    async function fetchPresales() {
      setIsLoading(true)
      setPresaleAddresses(
        selectedOption.value === NO_FILTER.value
          ? await presaleFactoryContract?.getPresaleAddresses()
          : await presaleFactoryContract?.getAccountPresales(account)
      )
      setIsLoading(false)
    }
    if (presaleFactoryContract && account) {
      fetchPresales()
    }
  }, [presaleFactoryContract, account, selectedOption])

  const paginationChangeHandler = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const presaleSearchChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value
    if (!presaleFactoryContract) return

    const searchingAddress = isAddress(search.trim())

    if (searchingAddress) {
      const filterPresaleAddresses = presaleAddresses.filter((address) => address === searchingAddress)
      if (filterPresaleAddresses.length) {
        setFilteredAddresses(filterPresaleAddresses)
      } else {
        const isValidAddress = await presaleFactoryContract.tokenPresales(searchingAddress)
        setFilteredAddresses(isValidAddress !== AddressZero ? [isValidAddress] : [])
      }
    } else {
      setFilteredAddresses([])
    }
  }

  const startIndex = page * PRESALE_CARDS_PER_PAGE - PRESALE_CARDS_PER_PAGE
  const endIndex =
    startIndex + PRESALE_CARDS_PER_PAGE > presaleAddresses.length
      ? presaleAddresses.length
      : startIndex + PRESALE_CARDS_PER_PAGE
  const slicedAddresses = presaleAddresses.slice(startIndex, endIndex)

  return (
    <>
      <Flex width="100%" marginTop="30px" justifyContent="space-evenly">
        <Box maxWidth="700px" width="75%">
          <label htmlFor="search-presale">
            <Flex
              borderRadius="10px"
              paddingLeft="10px"
              background="#000F18"
              alignContent="center"
              justifyContent="flex-start"
            >
              <SearchIcon width="40px" color="#fff" />
              <SearchInput
                onChange={presaleSearchChangeHandler}
                id="search-presale"
                placeholder="Enter Presale or Token Address"
              />
            </Flex>
          </label>
        </Box>
        {account && (
          <StyledDropdownWrapper
            value={selectedOption}
            options={[NO_FILTER, FILTER_OWNER]}
            onChange={(option: Option) => {
              if (option.value !== selectedOption.value) setSelectedOption(option)
            }}
          />
        )}
      </Flex>
      {isLoading ? (
        <Box marginTop="30px">
          <CustomLightSpinner src="/images/blue-loader.svg" size="100px" />
        </Box>
      ) : presaleAddresses.length ? (
        <>
          <Flex justifyContent="space-around" flexWrap="wrap" width="90%">
            {(filteredAddresses.length ? filteredAddresses : slicedAddresses).map((address) => (
              <PresaleCard presaleAddress={address} />
            ))}
          </Flex>
          <Box marginTop="30px">
            <Pagination
              size="large"
              sx={style}
              count={filteredAddresses.length ? 1 : Math.ceil(presaleAddresses.length / PRESALE_CARDS_PER_PAGE)}
              page={page}
              onChange={paginationChangeHandler}
            />
          </Box>
        </>
      ) : (
        <Flex flexDirection="column">
          <Text fontSize="24px" fontWeight={700} marginTop="30px">
            Presales does not exists.
          </Text>
          <Button marginY="30px" onClick={() => setButtonIndex(0)}>
            Create Presale
          </Button>
        </Flex>
      )}
    </>
  )
}

export default PresalesList
