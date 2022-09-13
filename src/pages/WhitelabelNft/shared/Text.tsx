import { Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'

// eslint-disable-next-line import/prefer-default-export
export const HelperText = styled(Text)`
  color: ${({ theme, color }) => theme.colors[color || "textSubtle"]};
  font-size: ${({ fontSize }) => fontSize};
  font-family: 'Poppins';
`

HelperText.defaultProps = {
  color: 'textSubtle',
  fontSize: '14px',
}
