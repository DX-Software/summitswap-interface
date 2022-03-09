import React from 'react'
import { Text, Box } from '@summitswap-uikit'

import DropdownWrapper from 'components/DropdownWrapper';
import { PaginatedRewards, ReferralReward } from '../types'
import { StyledBr } from '../StyledBr';
import ReferralTransactionRow from '../ReferralTransactionRow';


interface LeadHistoryProps {
  paginatedRewards: PaginatedRewards
  selectedAddress: string
  setSelectedAddress: (val: string) => void
}

interface HistoryListProps {
  history: ReferralReward[]
}

const HistoryList: React.FC<HistoryListProps> = ({history}) => {
  return <>
    {history.map(record => {
      return <Box>
        <StyledBr />
        <ReferralTransactionRow {...record}/>
      </Box>
    })}
  </>
}

const LeadHistory: React.FC<LeadHistoryProps> = ({ paginatedRewards, selectedAddress, setSelectedAddress }) => {
  const addresses = Object.keys(paginatedRewards)

  return addresses.length ? (
    <>
        <DropdownWrapper options={addresses} onChange={(option) => { setSelectedAddress(option.value)}} value={selectedAddress} />;
        <HistoryList history={paginatedRewards[selectedAddress]} />
    </>
  ) : (
    <Text>No sub influencers history available!</Text>
  )
}

export default LeadHistory