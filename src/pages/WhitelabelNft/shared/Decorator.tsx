import { Box } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'

const Decorator = styled(Box)`
  width: 96px;
  height: 7px;
  background: ${({ theme }) => theme.colors.primary};

  @media (max-width: 576px) {
    width: 64px;
  }
`
export default Decorator
