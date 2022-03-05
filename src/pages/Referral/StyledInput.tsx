import styled from 'styled-components'

const StyledInput = styled.input`
  color: ${({ theme }) => theme.colors.invertedContrast};
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
  width: 100%;
`

export default StyledInput