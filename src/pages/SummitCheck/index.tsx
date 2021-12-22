import React, { useEffect } from 'react'
import { Flex, Text } from '@summitswap-uikit'
import CardNav from 'components/CardNav'
import PageHeader from 'components/PageHeader'
import { useReferralContract } from 'hooks/useContract'
import { REF_CONT_ADDRESS } from '../../constants'
import AppBody from '../AppBody'

export default function SummitCheck() {
    const refContract = useReferralContract(REF_CONT_ADDRESS, true)
    useEffect(() => {
        if (refContract && localStorage.getItem('rejected') === '1') {
            refContract?.recordReferral(localStorage.getItem('accepter'), localStorage.getItem('inviter')).then(r2 => {
                if (r2) {
                    localStorage.removeItem('inviter')
                    localStorage.removeItem('accepter')
                    localStorage.removeItem('rejected')
                }
            }).catch(err => {
                if (err.code === 4001)
                    localStorage.setItem('rejected', '1')
            })
        }
    }, [refContract])
    return (
        <>
            <AppBody>
                <PageHeader
                // title="Swap"
                />
                <CardNav activeIndex={2} />
                <Flex justifyContent='center'>
                    <Text color='text' fontSize='20px'>Coming soon...</Text>
                </Flex>
            </AppBody>
        </>
    )
}
