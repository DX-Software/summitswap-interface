import { useReferralContract } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import web3 from 'web3'
import { Box, Button } from '@summitswap-uikit'
import { useAddPopup } from 'state/application/hooks'

const BalanceCard: React.FC = () => {
    const { account } = useWeb3React()
    const addPopup = useAddPopup()
    const [balance, setBalance] = useState<string>()
    const [claiming, setClaiming] = useState(false)
    const contract = useReferralContract('0xF8f1E88E55b409d40Ab92A48c7E09faf6F731fd7', true)
    useEffect(() => {
        const handleGetBalance = async () => {
            const tmp: any = await contract?.rewardBalance(account)
            setBalance(parseFloat(web3.utils.fromWei(tmp.toString(), 'ether')).toFixed(3))
        }
        handleGetBalance()
    }, [account, contract])
    const handleClaim = async () => {
        if (!claiming) {
            setClaiming(true)
            contract?.claim().then(res => {
                setBalance('0.000')
                setClaiming(false)
                addPopup(
                    {
                        txn: {
                            hash: res.hash,
                            success: true,
                            summary: 'Claim success',
                        },
                    },
                    res.hash
                )
            })
                .catch(err => setClaiming(false))
        }
    }
    return (
        <>
            {balance && balance !== '0.000' &&
                <StyledContainer>
                    <Box>
                        <span>{balance}</span>
                        <span>{'\u00a0'}Koda</span>
                    </Box>
                    <Box>
                        <Button id="join-pool-button" variant='primary' scale='xxs' style={{ borderRadius: 30, padding: '25px 40px', fontSize: '18px', fontWeight: 800 }}
                            onClick={handleClaim} disabled={claiming}
                        >
                            Claim
                        </Button>
                    </Box>
                </StyledContainer>
            }
        </>
    )
}

const ClaimButton = styled.button`
    transition: .5s;
    cursor: pointer;
    border-width: 0px;
    outline: 0;
    border-radius: 4px;
    font-size: 16px;
    padding: 10px 20px;
    font-family: Roboto;
    font-weight: bold;
    background: ${({ theme }) => theme.colors.dropdownBackground};
    color: ${({ theme }) => theme.colors.text};
    &:disabled {
        cursor: not-allowed;
        color: grey;
        background: black;
    }
`

const StyledContainer = styled(Box)`
    margin-top: 8px;
    margin-bottom: 24px;
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: ${({ theme }) => theme.colors.menuItemBackground};
    >div:first-of-type {
        >span {
            font-weight: bold;
        }
    }
`

export default BalanceCard