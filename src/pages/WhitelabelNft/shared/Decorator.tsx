import { Box } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'

const Decorator = styled(Box)<{ color?: string }>`
  width: 96px;
  height: 8px;
  background: ${({ theme, color }) => color ?? theme.colors.primary};

  @media (max-width: 576px) {
    width: 64px;
  }
`
export default Decorator
