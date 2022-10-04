import { Button } from '@koda-finance/summitswap-uikit'
import { darken } from '@mui/material'
import styled from 'styled-components'

const StyledButton = styled(Button)<{ color: string }>`
  background: ${({ color }) => darken(color, 0.25)};
  box-shadow: none;
`

export default StyledButton
