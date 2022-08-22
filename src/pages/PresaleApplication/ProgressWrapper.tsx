import styled from 'styled-components'
import { Box } from '@koda-finance/summitswap-uikit'

const ProgressWrapper = styled(Box)`
  & :first-child {
    height: 6px;
    background: ${({ theme }) => theme.colors.inputColor};
    box-shadow: none;
    & :first-child {
      background: ${({ theme }) => theme.colors.linkColor};
      height: 6px;
    }
    & :nth-child(2) {
      background: ${({ theme }) => theme.colors.primaryDark};
      height: 6px;
    }
  }
`
export default ProgressWrapper
