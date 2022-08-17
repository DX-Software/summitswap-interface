import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Text,
  SearchIcon,
  FilterIcon,
  Flex,
  ArrowDropDownIcon,
  ArrowDropUpIcon,
} from '@koda-finance/summitswap-uikit'
import { RowBetween } from 'components/Row'

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: 192px 18px 63px 18px 100px 18px 100px 18px 100px 18px 100px 18px 100px auto;
`

const HeadingDivider = styled.div`
  height: 24px;
  width: 0px;
  border: 1px solid ${({ theme }) => theme.colors.inputColor};
  margin: 8px 0;
  box-sizing: border-box;
  align-self: center;
`

const UpDownArrows = () => (
  <Flex justifyContent="center" flexDirection="column">
    <ArrowDropUpIcon color="linkColor" style={{ top: '7px', position: 'relative' }} />
    <ArrowDropDownIcon color="linkColor" style={{ bottom: '7px', position: 'relative' }} />
  </Flex>
)

const HeadingCotainer = () => {
  return (
    <Grid marginTop="24px">
      <RowBetween>
        <Text color="textSubtle">Name</Text>
        <SearchIcon color="linkColor" width="18px" />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <Text color="textSubtle">Coin</Text>
        <FilterIcon color="linkColor" width="16px" />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <Text color="textSubtle">Rate</Text>
        <UpDownArrows />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <Text color="textSubtle">SC/HC</Text>
        <UpDownArrows />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <Text color="textSubtle">Refund</Text>
        <FilterIcon color="linkColor" width="16px" />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <Text color="textSubtle">Start date</Text>
        <UpDownArrows />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <Text color="textSubtle">End date</Text>
        <UpDownArrows />
      </RowBetween>
    </Grid>
  )
}

export default HeadingCotainer
