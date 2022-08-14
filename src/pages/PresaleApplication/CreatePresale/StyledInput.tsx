import styled from 'styled-components'
import { Input, Box } from '@koda-finance/summitswap-uikit'

export const StyledInputWrapper = styled(Box)`
  width: 'max-content';
  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
  }
`

const StyledInput = styled(Input)<{ forTime?: boolean }>`
  padding: 10px 16px;
  gap: 10px;
  width: ${({ forTime }) => (forTime ? '150px' : '400px')};
  height: 44px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
  border-radius: 16px;
  font-size: 16px;
  margin: 4px 0;
  ::-webkit-calendar-picker-indicator {
    filter: invert(52%) sepia(100%) saturate(1272%) hue-rotate(125deg) brightness(100%) contrast(104%);
    &:hover {
      cursor: pointer;
    }
  }
  @media (max-width: 620px) {
    width: ${({ forTime }) => (forTime ? '150px' : '300px')};
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`
export default StyledInput
