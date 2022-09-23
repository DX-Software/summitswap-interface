import styled from 'styled-components'
import { Box } from '@koda-finance/summitswap-uikit'

export const GridContainer = styled(Box)`
  display: grid;
  grid-column-gap: 24px;
  grid-template-columns: 109px auto;
  grid-template-areas: 'icon title' 'icon input';
  justify-content: start;
  align-items: start;
  @media (max-width: 480px) {
    grid-template-columns: 64px auto;
    grid-template-areas: 'icon title' 'input input';
    grid-column-gap: 12px;
  }
`

export const ItemIconCard = styled(Box)`
  width: 109px;
  height: 139px;
  background: ${({ theme }) => theme.colors.inputColor};
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-shrink: 0;
  grid-area: icon;
  @media (max-width: 480px) {
    width: 64px;
    height: 64px;
  }
`

export const IconBox = styled(Box)`
  width: 56px;
  @media (max-width: 480px) {
    width: 30px;
  }
`

export const GridItem1 = styled(Box)`
  grid-area: title;
`

export const GridItem2 = styled(Box)`
  grid-area: input;
`
