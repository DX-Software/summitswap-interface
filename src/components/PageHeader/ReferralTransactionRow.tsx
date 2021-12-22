import React from 'react'
import { Flex, Text } from '@summitswap-uikit'
import web3 from 'web3'
import { useToken } from '../../hooks/Tokens'

interface Props {
    timestamp: any
    amountA: any
    amountB: any
    tokenA: any
    tokenB: any
    tokenR: any
    amountR: any
}

const ReferralTransactionRow: React.FC<Props> = ({ timestamp, amountA, amountB, tokenA, tokenB, tokenR, amountR }) => {
    const amountRR = parseFloat(web3.utils.fromWei(amountR.toString(), 'ether')).toFixed(3)
    const amountAA = parseFloat(web3.utils.fromWei(amountA.toString(), 'ether')).toFixed(3)
    const amountBB = parseFloat(web3.utils.fromWei(amountB.toString(), 'ether')).toFixed(3)
    const ts = `${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getFullYear() - 2000}/${(new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getMonth() + 1)}/${new Date(web3.utils.hexToNumber(timestamp._hex) * 1000).getDate()}`
    
    const tokenAA = useToken(tokenA)?.symbol
    const tokenBB = useToken(tokenB)?.symbol
    const tokenRR = useToken(tokenR)?.symbol
    return (
        <Flex alignItems="center" justifyContent="space-between">
            <Text mb="2px" color='primary'>
                {ts} {amountRR} <span style={{ color: 'white' }}>{tokenRR} from Swap</span> {amountAA} <span style={{ color: 'white' }}>{tokenAA}</span> <span style={{ color: 'white' }}>for</span> {amountBB} <span style={{ color: 'white' }}>{tokenBB}</span>
            </Text>
        </Flex>
    )
}

export default ReferralTransactionRow