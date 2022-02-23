import React, { useMemo } from 'react'
import { Input, CheckmarkCircleIcon, ErrorIcon, Flex, Checkbox, Text, Modal, Button } from '@koda-finance/summitswap-uikit'
import { useActiveWeb3React } from 'hooks'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import Loader from 'components/Loader'
import _ from 'lodash'
import styled from 'styled-components'

type EarnModalModalProps = {
  onDismiss?: () => void
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => b.addedTime - a.addedTime

const getRowStatus = (sortedRecentTransaction: TransactionDetails) => {
  const { hash, receipt } = sortedRecentTransaction

  if (!hash) {
    return { icon: <Loader />, color: 'text' }
  }

  if (hash && receipt?.status === 1) {
    return { icon: <CheckmarkCircleIcon color="success" />, color: 'success' }
  }

  return { icon: <ErrorIcon color="failure" />, color: 'failure' }
}

const EarnModal = ({ onDismiss = defaultOnDismiss }: EarnModalModalProps) => {
  const { account, chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  // Logic taken from Web3Status/index.tsx line 175
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])


  return (
    <Modal title="Referral Settings" onDismiss={onDismiss}>
      <Flex justifyContent="center" flexDirection="column" alignItems="center">
        <Flex flexDirection='column' alignItems='flex-start' alignSelf='flex-start' mb={3}>
          <Text style={{ fontWeight: 600 }} fontSize='16px' color='sidebarColor'>
            Choose earning
          </Text>
          <Flex justifyContent='flex-end' alignItems='center' mt={2}>
            <Checkbox scale='sm' />
            <Text bold ml={1}>The token eg. AAAA</Text>
          </Flex>
          <Flex justifyContent='flex-end' alignItems='center' mt={2}>
            <Checkbox scale='sm' />
            <Text bold ml={1}>KAPEX, this will initiate a sell of AAAA and purchase KAPEX – No Fee</Text>
          </Flex>
          <Flex justifyContent='flex-end' alignItems='center' mt={2}>
            <Checkbox scale='sm' />
            <Text bold ml={1}>BNB, this will initiate a sell of AAAA to BNB – Charge fee of 10%</Text>
          </Flex>
          <Flex justifyContent='flex-end' alignItems='center' mt={2}>
            <Checkbox scale='sm' />
            <Text bold ml={1}>BUSD, this will initiate a sell of AAAA to BUSD – Charge fee of 10%</Text>
          </Flex>
        </Flex>

        <Flex flexDirection='column' alignItems='flex-start' alignSelf='flex-start' mb={3}>
          <Text style={{ fontWeight: 600 }} fontSize='16px' color='sidebarColor'>
            Percent
          </Text>
          <Flex mt={1} flexDirection='column'>
            <Flex alignItems='center' mt={3}>
              <Text>Referral</Text>
              <InputOption>
                <Input
                  type="number"
                  scale="lg"
                  step={0.1}
                  min={0.1}
                  placeholder="2.5"
                />
              </InputOption>
              <Option>
                <Text color='sidebarColor' fontSize="18px" fontWeight='600'>%</Text>
              </Option>
            </Flex>
            <Flex alignItems='center' mt={3}>
              <Text>Dev fee</Text>
              <InputOption>
                <Input
                  type="number"
                  scale="lg"
                  step={0.1}
                  min={0.1}
                  placeholder="0.5"
                />
              </InputOption>
              <Option>
                <Text color='sidebarColor' fontSize="18px" fontWeight='600'>%</Text>
              </Option>
            </Flex>
          </Flex>
        </Flex>
        <Button variant="tertiary" size="sm" onClick={onDismiss}>
          Close
        </Button>
      </Flex>
    </Modal >
  )
}

const Option = styled.div`
  padding: 0 4px;
  >button {
    background-color: ${({ theme }) => theme.colors.menuItemBackground};
    color: ${({ theme }) => theme.colors.sidebarColor};
    font-size: 18px;
    font-weight: 600;
  }
`

const InputOption = styled(Option)`
  width: 165px;
  input {
    background-color: ${({ theme }) => theme.colors.menuItemBackground};
    color: ${({ theme }) => theme.colors.sidebarColor};
    box-shadow: none !important;
    font-size: 18px;
    font-weight: 600;
  }
`

export default EarnModal
