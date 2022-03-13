import React, { useEffect, useState } from 'react'
import { Token } from '@summitswap-libs'
import { Text, Box, Button } from '@summitswap-uikit'
import { Contract, ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core';
import { AddressZero } from '@ethersproject/constants'
import { useFormik } from 'formik';

import { useReferralContract } from 'hooks/useContract';
import StyledInput from '../StyledInput'
import { InfInfo } from '../types';
import CenterDiv from '../CenterDiv';
import { StyledBr, StyledWhiteBr } from '../StyledBr';
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

const EnterLeadAddressSection: React.FC<EnterLeadAddressSectionProps> = ({ contract, selectedCoin }) => {
  interface FormInputs {
    leadAddress?: string;
  }

  const formik = useFormik<FormInputs>({
    initialValues: {
      leadAddress: undefined,
    },
    onSubmit: async (values) => {
      const { leadAddress } = values

      if (!contract) return
      if (!selectedCoin) return
      if (!leadAddress) return

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
  })

  return <>
    <Box>
      <Text mb="4px" small>
        Lead influencer wallet address
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <StyledInput value={formik.values.leadAddress} onChange={formik.handleChange} name="leadAddress"/>
        <Box style={{ marginTop: '12px' }}>
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
    <StyledBr />
  </>
}

const InfoBox: React.FC<InfoBoxProps> = ({ address, leadFee, refFee }) => {
  return <Box>
    <Text>
      Address - {address}
    </Text>
    <Text>
      Fee - {leadFee}
    </Text>
    <Text>
      Referral Fee - {refFee}
    </Text>
  </Box>
}

const SubInfluencer: React.FC<SubInfluencerProps> = ({ myLeadInfluencerAddress, selectedCoin }) => {
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

      if (subInfluncerInfo.lead !== AddressZero) {
        setSubInfo({ address: account, leadFee: ethers.utils.formatUnits(subInfluncerInfo.leadFee), refFee: ethers.utils.formatUnits(subInfluncerInfo.refFee) })
        setLeadInfo({ address: myLeadInfluencerAddress, leadFee: ethers.utils.formatUnits(leadInfluncerInfo.leadFee), refFee: ethers.utils.formatUnits(leadInfluncerInfo.refFee) })
      }

    }
    getLeadInfo()
  }, [myLeadInfluencerAddress, refContract, selectedCoin, account])

  return (
    <Box>
      {leadInfo && subInfo ? (<>
        <Text bold>My info (as a sub influencer)</Text>
        <StyledWhiteBr />
        <InfoBox {...subInfo} />
        <StyledBr />
        <Text bold>My lead influencer info</Text>
        <StyledWhiteBr />
        <InfoBox {...leadInfo} />
      </>) : (
        <Box>
          <CenterDiv>
            <Text bold>Want to become a sub influencer?</Text>
          </CenterDiv>
          <StyledWhiteBr />
          <EnterLeadAddressSection contract={refContract} selectedCoin={selectedCoin} />
        </Box>
      )}
    </Box>
  )
}

export default SubInfluencer