import React from 'react'
import styled from 'styled-components'
import { Box, Text } from '@koda-finance/summitswap-uikit'

export const Grid = styled(Box)`
  display: grid;
  grid-template-columns: 150px repeat(4, 110px) 110px 100px 100px auto;
  @media (max-width: 852px) {
    margin-top: 16px;
  }
`
export const StyledText = styled(Text)`
  word-wrap: break-word;
  // word-break: break-word;
  align-self: center;
  font-size: 16px;
  @media (max-width: 852px) {
    font-size: 14px;
  }
`

const HeadingCotainer = () => {
  return (
    <Grid marginBottom="8px">
      <StyledText fontWeight={700} color="sidebarColor">
        Name
      </StyledText>

      <StyledText fontWeight={700} color="sidebarColor">
        Currency
      </StyledText>

      <StyledText fontWeight={700} color="sidebarColor">
        Rate
      </StyledText>

      <StyledText fontWeight={700} color="sidebarColor">
        SC/HC
      </StyledText>

      <StyledText fontWeight={700} color="sidebarColor">
        Refund
      </StyledText>

      <StyledText fontWeight={700} color="sidebarColor">
        Start date
      </StyledText>

      <StyledText fontWeight={700} color="sidebarColor">
        Status
      </StyledText>
    </Grid>
  )
}

export default HeadingCotainer
