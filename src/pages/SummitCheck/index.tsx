import React from 'react'
import { Flex } from '@summitswap-uikit'
import CardNav from 'components/CardNav'
import PageHeader from 'components/PageHeader'
import AppBody from '../AppBody'

import Form from './CheckForm'

// I need to add a form here and while submitting to submit in rails app so rails can then do all processing and get the data back here
// I might use contract to get the owner, holders top holders etc...
export default function SummitCheck() {
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
