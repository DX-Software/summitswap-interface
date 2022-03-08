import React, { useEffect, useState } from 'react'
import { Token } from '@summitswap-libs'
import { Text, Box, Button } from '@summitswap-uikit'
import { Contract } from 'ethers'

import { useReferralContract } from 'hooks/useContract';
import { InfInfo } from '../types';
import CenterDiv from '../CenterDiv';
import { StyledBr, StyledWhiteBr } from '../StyledBr';
import StyledInput from '../StyledInput';
import { isAddress } from '../../../utils';


interface SubInfluencerProps {
  myLeadInfluencerAddress?: string;
  selectedCoin?: Token;
}

interface LeadInfoBoxProps {
  leadInfo: InfInfo
}

interface EnterLeadAddressSectionProps {
  contract: Contract | null;
  selectedCoin?: Token;
}

const EnterLeadAddressSection: React.FC<EnterLeadAddressSectionProps> = ({contract, selectedCoin}) => {

  const [leadAddress, setLeadAddress] = useState('')

  const submitHandler = async () => {
    if (!contract) return
    if (!selectedCoin) return

    if (!isAddress(leadAddress)) {
      alert("Invalid lead wallet address")
      return
    }

    try {
      await contract.acceptLeadInfluencer(selectedCoin.address, leadAddress)
      alert('Transaction succeeded!')
    } catch {
      alert("Can't run transaction!")
    }

  }

  return <>
    <Box>
      <Text mb="4px" small>
        Influencer Wallet Address
      </Text>
      <StyledInput value={leadAddress} onChange={(e) => {
        const newValue = e.target.value
        setLeadAddress(newValue)
      }}/>
      <Box style={{marginTop: '12px'}}>
        <Button onClick={submitHandler}>Submit</Button>
      </Box>
    </Box>
    <StyledBr />
  </>
}

const LeadInfoBox: React.FC<LeadInfoBoxProps> = ({leadInfo}) => {
  return <Box>
    <Text>
      Lead Address - {leadInfo.lead}
    </Text>
    <Text>
      Lead Fee - {leadInfo.leadFee.toString()}
    </Text>
    <Text>
      Referral Fee - {leadInfo.refFee.toString()}
    </Text>
  </Box>
}

const SubInfluencer: React.FC<SubInfluencerProps> = ({myLeadInfluencerAddress, selectedCoin}) => {

  const refContract = useReferralContract(true)
  const [leadInfo, setLeadInfo] = useState<InfInfo | undefined>()

  useEffect(() => {
    const getLeadInfo = async () => {
      if (!refContract) return
      if (!selectedCoin) return
      if (!myLeadInfluencerAddress) return 

      const influncerInfo = await refContract.influencers(selectedCoin.address, myLeadInfluencerAddress) as InfInfo

      console.log(influncerInfo)

      if (influncerInfo.isLead) {
        setLeadInfo(influncerInfo)
      }
    }
    getLeadInfo()
  }, [myLeadInfluencerAddress, refContract, selectedCoin])

  return (
    <Box>
      {leadInfo ? (<LeadInfoBox leadInfo={leadInfo}/>) : (
        <Box>
          <CenterDiv>
            <Text bold>Enter Lead Influencer Wallet Address</Text>
          </CenterDiv>
          <StyledWhiteBr />
          <EnterLeadAddressSection contract={refContract} selectedCoin={selectedCoin} />
        </Box>
      )}
    </Box>
  )
}

export default SubInfluencer