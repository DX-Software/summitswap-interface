import styled from 'styled-components'
import { Text, Heading as BasicHeading } from '@koda-finance/summitswap-uikit'

export const Heading = styled(BasicHeading)`
  font-size: 20px;
  @media (max-width: 480px) {
    font-size: 18px;
  }
`

export const Caption = styled(Text)`
  font-size: 12px;
  line-height: 18px;
  display: inline-block;
`
export const XSmallText = styled(Text)`
  font-size: 10px;
  line-height: 16px;
`
