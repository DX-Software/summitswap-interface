import styled from 'styled-components'
import { Input, Box } from '@koda-finance/summitswap-uikit'

export const StyledInputWrapper = styled(Box)<{ forDate?: boolean }>`
  width: 'max-content';
  @media (max-width: 550px) {
    width: ${({ forDate }) => (forDate ? '100%' : '')};
    margin-right: ${({ forDate }) => (forDate ? '0' : '')};
  }
  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
  }
`

const StyledInput = styled(Input)<{ forTime?: boolean; forDate?: boolean }>`
  padding: 10px 16px;
  gap: 10px;
  width: ${({ forTime }) => (forTime ? '150px' : '400px')};
  width: ${({ forDate }) => (forDate ? '355px' : '')};
  height: 44px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
  border-radius: 16px;
  font-size: 16px;
  margin: 4px 0;
  ::-webkit-calendar-picker-indicator {
    filter: invert(47%) sepia(87%) saturate(382%) hue-rotate(92deg) brightness(96%) contrast(85%);
    &:hover {
      cursor: pointer;
    }
  }
  @media (max-width: 620px) {
    width: ${({ forTime }) => (forTime ? '150px' : '300px')};
  }
  @media (max-width: 750px) {
    width: ${({ forDate }) => (forDate ? '180px' : '')};
  }
  @media (max-width: 550px) {
    width: ${({ forTime, forDate }) => (forTime || forDate ? '100%' : '')};
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`
export default StyledInput
