import React from 'react'
import { Flex, Text } from '@summitswap-uikit'
import CardNav from 'components/CardNav'
import PageHeader from 'components/PageHeader'
import AppBody from '../AppBody'

export default function SummitCheck() {
    return (
        <>
            <AppBody>
                <PageHeader title="Swap" />
                <CardNav activeIndex={2} />
                <Flex justifyContent='center'>
                <Text color='text' fontSize='20px'>Coming soon...</Text>
                </Flex>
            </AppBody>
        </>
    )
}
