import React, { useEffect, useState } from 'react'
import { Text, Box, Button } from '@koda-finance/summitswap-uikit'
import { Contract, ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core';
import { AddressZero } from '@ethersproject/constants'
import { useFormik } from 'formik';

import { useReferralContract } from 'hooks/useContract';
import StyledInput from '../StyledInput'
import { InfInfo } from '../types';
import { CenterDiv } from '../CenterDiv';
import { StyledBr, StyledWhiteBr } from '../StyledBr';
import { isAddress } from '../../../utils';
import { SegmentsProps } from './SegmentsProps';


interface SubInfluencerProps extends SegmentsProps {
  myLeadInfluencerAddress?: string;
}

interface InfoBoxProps {
  address: string;
  leadFee: string;
  refFee: string;
}

interface EnterLeadAddressSectionProps extends SegmentsProps {
  contract: Contract | null;
}

const EnterLeadAddressSection: React.FC<EnterLeadAddressSectionProps> = ({ 
  contract, 
  outputToken,    
  openModel,
  transactionSubmitted,
  transactionFailed
}) => {
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
      if (!outputToken) return
      if (!leadAddress) return

      openModel('Request add as sub influencer')

      if (!isAddress(leadAddress)) {
        transactionFailed('Invalid lead wallet address')
        return
      }

      try {
        const transaction = await contract.acceptLeadInfluencer(outputToken.address, leadAddress)
        transactionSubmitted(transaction.hash, 'Request succeeded!')
      } catch (err) {
        transactionFailed(err.message as string)
      }
    }
  })

  return <>
    <Box>
      <Text mb="4px" small>
        Lead influencer wallet address
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <StyledInput value={formik.values.leadAddress} onChange={formik.handleChange} name="leadAddress" autoComplete="off" placeholder={AddressZero}/>
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
      Fee - {leadFee} %
    </Text>
    <Text>
      Referral Fee - {refFee} %
    </Text>
  </Box>
}

const SubInfluencer: React.FC<SubInfluencerProps> = ({ 
  myLeadInfluencerAddress, 
  outputToken,
  openModel,
  transactionSubmitted,
  transactionFailed,
  onDismiss
}) => {
  const refContract = useReferralContract(true)
  const [leadInfo, setLeadInfo] = useState<InfoBoxProps | undefined>()
  const [subInfo, setSubInfo] = useState<InfoBoxProps | undefined>()

  const { account } = useWeb3React()

  useEffect(() => {
    const getLeadInfo = async () => {
      if (!refContract) return
      if (!outputToken) return
      if (!myLeadInfluencerAddress) return
      if (!account) return

      const subInfluncerInfo = await refContract.influencers(outputToken.address, account) as InfInfo
      const leadInfluncerInfo = await refContract.influencers(outputToken.address, subInfluncerInfo.lead) as InfInfo

      if (subInfluncerInfo.lead !== AddressZero) {
        setSubInfo({ 
          address: account, 
          leadFee: ethers.utils.formatUnits(subInfluncerInfo.leadFee, 7), 
          refFee: ethers.utils.formatUnits(subInfluncerInfo.refFee, 7) 
        })
        setLeadInfo({ 
          address: myLeadInfluencerAddress, 
          leadFee: ethers.utils.formatUnits(leadInfluncerInfo.leadFee, 7), 
          refFee: ethers.utils.formatUnits(leadInfluncerInfo.refFee, 7) 
        })
      }

    }
    getLeadInfo()
  }, [myLeadInfluencerAddress, refContract, outputToken, account])

  const modelFunctions = {
    openModel,
    transactionSubmitted,
    transactionFailed,
    onDismiss
  }

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
          <EnterLeadAddressSection contract={refContract} outputToken={outputToken} {...modelFunctions}/>
        </Box>
      )}
    </Box>
  )
}

export default SubInfluencer