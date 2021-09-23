import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

export const FadedSpan = styled(RowFixed)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
`

export const PaddedColumn = styled(AutoColumn)`
  padding: 30px 40px 12px 40px;
  padding-bottom: 12px;
`

export const MenuItem = styled.div<{ disabled: any; selected: any; }>`
  padding: 7px 0;
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.menuItemBackground};
  :hover {
    opacity: .8;
  }
  >div {
    opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
  }
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 10px 20px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 30px;
  color: ${({ theme }) => theme.colors.inputColor};
  // border-style: solid;
  // border: 1px solid ${({ theme }) => theme.colors.tertiary};
  background: ${({ theme }) => theme.colors.menuItemBackground};
  -webkit-appearance: none;

  font-size: 16px;
  font-weight: 400;

  ::placeholder {
    color: rgba(255, 255, 255, .4);
    font-size: 16px;
    font-weight: 400;
  }
  transition: border 100ms;
  :focus {
    // border: 1px solid ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
`

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.tertiary};
`
