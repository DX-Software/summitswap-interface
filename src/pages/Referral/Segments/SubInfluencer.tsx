import React, { useEffect, useState } from 'react'
import { Token } from '@summitswap-libs'
import { Text, Box, Button } from '@summitswap-uikit'
import { Contract } from 'ethers'
import { useWeb3React } from '@web3-react/core';
import { AddressZero } from '@ethersproject/constants'

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

interface InfoBoxProps {
  address: string;
  leadFee: string;
  refFee: string;
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
    } catch (e) {
      console.log(e)
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

const InfoBox: React.FC<InfoBoxProps> = ({address, leadFee, refFee}) => {
  return <Box>
    <Text>
      Lead Address - {address}
    </Text>
    <Text>
      Lead Fee - {leadFee}
    </Text>
    <Text>
      Referral Fee - {refFee}
    </Text>
  </Box>
}

const SubInfluencer: React.FC<SubInfluencerProps> = ({myLeadInfluencerAddress, selectedCoin}) => {

  const refContract = useReferralContract(true)
  const [leadInfo, setLeadInfo] = useState<InfoBoxProps | undefined>()
  const [subInfo, setSubInfo] = useState<InfoBoxProps | undefined>()

  const { account } = useWeb3React()

  useEffect(() => {
    const getLeadInfo = async () => {
      if (!refContract) return
      if (!selectedCoin) return
      if (!myLeadInfluencerAddress) return
      if (!account) return

      const subInfluncerInfo = await refContract.influencers(selectedCoin.address, account) as InfInfo
      const leadInfluncerInfo = await refContract.influencers(selectedCoin.address, subInfluncerInfo.lead) as InfInfo

      if (subInfluncerInfo.lead !== AddressZero ) {
        setSubInfo({address: account, leadFee: subInfluncerInfo.leadFee.toString(), refFee: subInfluncerInfo.refFee.toString() })
        setLeadInfo({address: myLeadInfluencerAddress, leadFee: leadInfluncerInfo.leadFee.toString(), refFee: leadInfluncerInfo.refFee.toString() })
      }

    }
    getLeadInfo()
  }, [myLeadInfluencerAddress, refContract, selectedCoin, account])

  return (
    <Box>
      {leadInfo && subInfo ? (<>
        <InfoBox {...leadInfo} />
        <InfoBox {...subInfo} />
      </>) : (
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