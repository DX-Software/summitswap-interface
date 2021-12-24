import React, { useEffect } from 'react'
import { Flex, Text } from '@summitswap-uikit'
import CardNav from 'components/CardNav'
import PageHeader from 'components/PageHeader'
import { useReferralContract } from 'hooks/useContract'
import { REF_CONT_ADDRESS } from '../../constants'
import AppBody from '../AppBody'

import Form from './CheckForm'

// I need to add a form here and while submitting to submit in rails app so rails can then do all processing and get the data back here
// I might use contract to get the owner, holders top holders etc...
export default function SummitCheck() {
  const refContract = useReferralContract(REF_CONT_ADDRESS, true)
  useEffect(() => {
    if (refContract && localStorage.getItem('rejected') === '1') {
      refContract
        ?.recordReferral(localStorage.getItem('accepter'), localStorage.getItem('inviter'))
        .then((r2) => {
          if (r2) {
            localStorage.removeItem('inviter')
            localStorage.removeItem('accepter')
            localStorage.removeItem('rejected')
          }
        })
        .catch((err) => {
          if (err.code === 4001) localStorage.setItem('rejected', '1')
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

        <Flex justifyContent="center">{/* <Text color='text' fontSize='20px'>Coming soon...</Text> */}</Flex>
        <Flex justifyContent="center">
          <Form />
        </Flex>
      </AppBody>
    </>
  )
}
