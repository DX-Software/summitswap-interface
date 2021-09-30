import styled from 'styled-components'

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
