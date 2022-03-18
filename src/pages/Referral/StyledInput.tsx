import { Input } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  background-color: ${({ theme }) => theme.colors.sidebarBackground};
  margin-bottom: 16px;
  margin-top: 8px;
  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: gray;
    opacity: 1; /* Firefox */
  }

  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: gray;
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: gray;
  }
`

export default StyledInput
