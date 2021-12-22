import React from 'react'
import styled from 'styled-components'

const ReferralListRow: React.FC = () => {
    return (
        <StyledContainer>
            {'19/10/21'} {'Wallet A'} {'refers'} {'wallet'} {'0xB'} {'for'} ${1000} reward ${51.60}
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
`

export default ReferralListRow