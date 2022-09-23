import styled from 'styled-components'
import { Box } from '@koda-finance/summitswap-uikit'

const ProgressBox = styled(Box)`
  & :first-child {
    height: 10px;
    background: ${({ theme }) => theme.colors.primaryDark};
    & :first-child {
      background: ${({ theme }) => theme.colors.linkColor};
    }
  }
`
export default ProgressBox
