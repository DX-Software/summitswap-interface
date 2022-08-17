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

export const Grid = styled(Box)`
  display: grid;
  grid-template-columns: 192px 18px 63px 18px 100px 18px 100px 18px 100px 18px 100px 18px 100px auto;
  margin-top: 24px;
  @media (max-width: 852px) {
    margin-top: 16px;
  }
`
export const StyledText = styled(Text)`
  align-self: center;
  font-size: 16px;
  @media (max-width: 852px) {
    font-size: 14px;
  }
`

export const HeadingDivider = styled.div`
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
    <Grid>
      <RowBetween>
        <StyledText color="textSubtle">Name</StyledText>
        <SearchIcon color="linkColor" width="18px" />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <StyledText color="textSubtle">Coin</StyledText>
        <FilterIcon color="linkColor" width="16px" />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <StyledText color="textSubtle">Rate</StyledText>
        <UpDownArrows />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <StyledText color="textSubtle">SC/HC</StyledText>
        <UpDownArrows />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <StyledText color="textSubtle">Refund</StyledText>
        <FilterIcon color="linkColor" width="16px" />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <StyledText color="textSubtle">Start date</StyledText>
        <UpDownArrows />
      </RowBetween>
      <Flex justifyContent="center">
        <HeadingDivider />
      </Flex>
      <RowBetween>
        <StyledText color="textSubtle">End date</StyledText>
        <UpDownArrows />
      </RowBetween>
    </Grid>
  )
}

export default HeadingCotainer
