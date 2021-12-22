import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box } from '@summitswap-uikit'
import _ from 'lodash'
import { useReferralContract } from 'hooks/useContract'

import TokenCard from './TokenCard'
import { REF_CONT_ADDRESS } from '../../constants'

const StyledContainer = styled(Box)`
    display: grid;
    grid-column-gap: 16px;
    grid-row-gap: 8px;
`

const RewardedTokens: React.FC = () => {
    const [rewardTokens, setRewardTokens] = useState([])
    const [isProcessing, setProcessing] = useState(false)
    const refContract = useReferralContract(REF_CONT_ADDRESS, true)

    useEffect(() => {
        const handleGetRewardTokens = async () => {
            const testRewardTokens = await refContract?.getRewardTokens()
            setRewardTokens(testRewardTokens)
        }
        handleGetRewardTokens()
    }, [refContract])
    return (
        <StyledContainer>
            {_.map(rewardTokens, (x, i) =>
                <TokenCard key={i} addr={x}
                    isProcessing={isProcessing}
                    setProcessing={setProcessing}
                />
            )}
        </StyledContainer>
    )
}

export default RewardedTokens