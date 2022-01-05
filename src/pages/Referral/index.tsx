import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Text, Box, Button, useWalletModal } from '@summitswap-uikit'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import _ from 'lodash'
import { injected, walletconnect } from 'connectors'

import ReferralTransactionRow from 'components/PageHeader/ReferralTransactionRow'
import { useAllSwapList } from 'state/transactions/hooks'
import { TranslateString } from 'utils/translateTextHelpers'
import AppBody from '../AppBody'
import BalanceCard from './BalanceCard'

interface IProps {
    isLanding?: boolean
    match?: any
}

const Referral: React.FC<IProps> = () => {
    const { account, chainId, deactivate, activate } = useWeb3React()
    const handleLogin = (connectorId: string) => {
        if (connectorId === 'walletconnect') {
            return activate(walletconnect())
        }
        return activate(injected)
    }
    const location = useLocation()
    const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)
    const [allSwapList, setAllSwapList] = useState([])
    const swapListTemp = useAllSwapList()
    const getAllSwapList = async () => {
        const tmp: any = await swapListTemp
        setAllSwapList(tmp)
    }

    useEffect(() => {
        getAllSwapList()
    })
    useEffect(() => {
        const handleSettingLinkUrl = async () => {
            setReferralURL(`http://${document.location.hostname}:${3000}/#/swap?ref=${account}`)
        }
        handleSettingLinkUrl()
    }, [location,account])

    const [referralURL, setReferralURL] = useState('')
    const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

    return (
        <>
            <AppBody>
                <Box mt={5}>
                    {account &&
                        <>
                            <Text mb="8px" bold>
                                My Referral link
                            </Text>
                            <LinkBox mb={4}>
                                <Box>
                                    <Text>{referralURL}</Text>
                                </Box>
                                <Box onClick={() => {
                                    if (navigator.clipboard) {
                                        navigator.clipboard.writeText(referralURL);
                                        setIsTooltipDisplayed(true);
                                        setTimeout(() => {
                                            setIsTooltipDisplayed(false);
                                        }, 1000);
                                    }
                                }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none">
                                        <path d="M13 0L2 0C0.9 0 0 0.9 0 2L0 15C0 15.55 0.45 16 1 16C1.55 16 2 15.55 2 15L2 3C2 2.45 2.45 2 3 2L13 2C13.55 2 14 1.55 14 1C14 0.45 13.55 0 13 0ZM17 4L6 4C4.9 4 4 4.9 4 6L4 20C4 21.1 4.9 22 6 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4ZM16 20H7C6.45 20 6 19.55 6 19L6 7C6 6.45 6.45 6 7 6L16 6C16.55 6 17 6.45 17 7V19C17 19.55 16.55 20 16 20Z" fill="white" />
                                    </svg>
                                    <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
                                </Box>
                            </LinkBox>
                        </>
                    }
                    {account && <BalanceCard />}
                    {account && allSwapList && allSwapList.length <= 0 &&
                        <Text>No recent transactions</Text>
                    }
                    {account &&
                        chainId &&
                        allSwapList &&
                        allSwapList.length > 0 &&
                        <Box mb={2}>
                            {_.map(allSwapList, (x: any, i) =>
                                <ReferralTransactionRow {...x} />
                            )}
                        </Box>
                    }
                    {!account &&
                        <Box mb={3}>
                            <Button style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
                                {TranslateString(292, 'Connect wallet to view your referral link')}
                            </Button>
                        </Box>
                    }
                </Box>
            </AppBody>
        </>
    )
}
const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
    display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? "block" : "none")};
    position: absolute;
    bottom: 36px;
    right: 0;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    background-color: ${({ theme }) => theme.colors.sidebarBackground} !important;
    color: ${({ theme }) => theme.colors.invertedContrast};
    border-radius: 16px;
    opacity: 0.7;
    width: fit-content;
    padding: 10px;
`;
const LinkBox = styled(Box)`
    padding: 16px;
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.sidebarBackground};
    display: flex;
    align-items: center;
    >div:first-of-type {
        flex: 1;
        overflow: hidden;
        >div {
            overflow: hidden;
            max-width: calc(100% - 20px);
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
        }
    }
    >div:last-of-type {
        cursor: pointer;
        position: relative;
    }
`

export default Referral