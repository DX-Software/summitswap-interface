import React from 'react'
import { Flex, Text } from '@summitswap-uikit'
import web3 from 'web3'
import { useToken } from '../../hooks/Tokens'

interface Props {
    amountA: any
    amountB: any
    tokenA: any
    tokenB: any
    amountR: any
}

const ReferralTransactionRow: React.FC<Props> = ({ amountA, amountB, tokenA, tokenB, amountR }) => {    
    const amountRR = parseFloat(web3.utils.fromWei(amountR.toString(), 'ether')).toFixed(3)
    const amountAA = parseFloat(web3.utils.fromWei(amountA.toString(), 'ether')).toFixed(3)
    const amountBB = parseFloat(web3.utils.fromWei(amountB.toString(), 'ether')).toFixed(3)

    const tokenAA = useToken(tokenA)?.symbol
    const tokenBB = useToken(tokenB)?.symbol
    return (
        <Flex alignItems="center" justifyContent="space-between">
            <Text mb="2px" color='primary'>
                {amountRR} <span style={{ color: 'white' }}>Koda from Swap</span> {amountAA} <span style={{ color: 'white' }}>{tokenAA}</span> for {amountBB} <span style={{ color: 'white' }}>{tokenBB}</span>
            </Text>
        </Flex>
    )
}

export default ReferralTransactionRow