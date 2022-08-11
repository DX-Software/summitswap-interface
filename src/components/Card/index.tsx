import styled from 'styled-components'
import { Box } from '@koda-finance/summitswap-uikit'

const Card = styled.div<any>`
  width: 100%;
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  min-height: 120px;
`
export default Card

export const LightCard = styled(Card)`
  // border: 1px solid ${({ theme }) => theme.colors.menuItemBackground};
  background-color: ${({ theme }) => theme.colors.menuItemBackground};
`

export const GreyCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.menuItemBackground};
  background-color: ${({ theme }) => theme.colors.menuItemBackground};
`

export const IconCard = styled(Box)`
  width: 109px;
  height: 139px;
  background: ${({ theme }) => theme.colors.inputColor};
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`
