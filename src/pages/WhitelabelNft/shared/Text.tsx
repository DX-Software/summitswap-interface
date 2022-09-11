import { Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'

export const Title = styled(Text)`
  font-family: 'Poppins';
  font-size: ${({ fontSize }) => fontSize || '40px'};
  font-weight: 600;
  margin-bottom: 8px;
`

export const SubTitle = styled(Text)`
  font-family: 'Poppins';
  font-size: ${({ fontSize }) => fontSize || '24px'};
  font-weight: 600;
  margin-bottom: 8px;
`

export const HelperText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: ${({ fontSize }) => fontSize || '14px'};
  font-family: 'Poppins';
`
