import styled from 'styled-components'
import { Text } from '@koda-finance/summitswap-uikit'

export const TextHeading = styled(Text)`
  font-weight: 700;
  font-size: 24px;
  @media (max-width: 480px) {
    font-size: 15px;
  }
`
export const TextSubHeading = styled(Text)`
  font-weight: 700;
  font-size: 17px;
  @media (max-width: 480px) {
    font-size: 10px;
  }
`
export const TextContributor = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  @media (max-width: 480px) {
    font-size: 10px;
  }
`