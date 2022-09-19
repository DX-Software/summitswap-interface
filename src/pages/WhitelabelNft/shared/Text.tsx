import { Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'

export const HelperText = styled(Text)`
  color: ${({ theme, color }) => theme.colors[color || "textSubtle"]};
  font-size: ${({ fontSize }) => fontSize};
  font-family: 'Poppins';
`

HelperText.defaultProps = {
  color: 'textSubtle',
  fontSize: '14px',
}

export const DescriptionText = styled(Text)`
  margin-bottom: 16px;

  @media (max-width: 576px) {
    margin-bottom: 8px;
    font-size: 14px;
  }
`
