import { Tag } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'

const CustomTag = styled(Tag)`
  margin-top: 16px;
  margin-bottom: 8px;

  @media (max-width: 576px) {
    margin-top: 8px;
    margin-bottom: 0;
  }
`

export default CustomTag
