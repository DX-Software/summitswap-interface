import { Input } from '@summitswap-uikit'
import styled from 'styled-components'

const StyledInput = styled(Input)`
    background-color: ${({ theme }) => theme.colors.sidebarBackground};
    margin-bottom: 16px;
    margin-top: 8px;
`

export default StyledInput 