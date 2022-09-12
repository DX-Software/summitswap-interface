import { Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'

// eslint-disable-next-line import/prefer-default-export
export const HelperText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: ${({ fontSize }) => fontSize || '14px'};
  font-family: 'Poppins';
`
