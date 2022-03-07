import React, { useState } from 'react'
import { Text, Box, Button } from '@summitswap-uikit'
import { Token } from '@summitswap-libs'
import styled from 'styled-components'
import { useFormik } from 'formik';

import { useReferralContract } from 'hooks/useContract'
import { Contract } from 'ethers'
import checkIfUint256 from 'utils/checkUint256'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { isAddress } from '../../../utils'
import { Influencer } from '../types';
import CenterDiv from '../CenterDiv';
import StyledInput from '../StyledInput';
import { StyledBr, StyledWhiteBr } from '../StyledBr';

const InfluencerBox = styled(Box)`
  color: ${({ theme }) => theme.colors.invertedContrast};
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
`

interface CoinManagerSegmentProps {
  selectedCoin?: Token;
  influencers:  Influencer[]
}

interface SectionProps {
  contract: Contract | null;
  selectedCoin?: Token;
}

const CoinManagerSegment: React.FC<CoinManagerSegmentProps> = ({selectedCoin, influencers}) => {

  const refContract = useReferralContract(true)

  const coinLogoURL = selectedCoin instanceof WrappedTokenInfo ? selectedCoin.logoURI : undefined

  return <>
    <CenterDiv>
      {coinLogoURL && <img src={coinLogoURL} alt="COIN LOGO"/>}
      <Text bold>{selectedCoin?.symbol}</Text>
      <Text bold> - </Text>
      <Text bold>{selectedCoin?.address}</Text>
    </CenterDiv>
    <SetFirstBuyFee contract={refContract} selectedCoin={selectedCoin} />
    <SetLeadManager contract={refContract} selectedCoin={selectedCoin} />
    <RemoveLead contract={refContract} selectedCoin={selectedCoin} />
    <SetFeeInfo contract={refContract} selectedCoin={selectedCoin} />
    {influencers.map(influencer => {
      return <InfluencerBox key={influencer.referee}>
        <Box>
          <Text>{influencer.referee}</Text>
        </Box>
      </InfluencerBox>
    })}
  </>
}

const SetFirstBuyFee: React.FC<SectionProps> = ({contract, selectedCoin}) => {

  const [fee, setFee] = useState('')

  const submitHandler = async () => {
    if (!selectedCoin) return
    if (!contract) return

    if (!checkIfUint256(fee)) {
      alert(`Invalid fee!`)
      return
    }

    try {
      await contract.setFirstBuyFee(selectedCoin.address, fee)
      alert('Transaction succeeded!')
    } catch {
      alert("Can't run transaction!")
    }

  }

  return <>
    <Text bold>
      Set first buy fee
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Fee value
      </Text>
      <StyledInput value={fee} onChange={(e) => {
        const newValue = e.target.value
        setFee(newValue)
      }}/>
      <Box style={{marginTop: '12px'}}>
        <Button onClick={submitHandler}>Submit</Button>
      </Box>
    </Box>
    <StyledBr />
  </>
}

const SetFeeInfo: React.FC<SectionProps> = ({contract, selectedCoin}) => {

  interface FormInputs {
    rewardToken: string;
    refFee?: number;
    devFee?: number;
    promRefFee?: number;
    promStart?: string;
    promEnd?: string;
  }

  const validateInputs = (values: FormInputs) => {    

    if (!values.refFee && checkIfUint256(`${values.refFee}`)) {
      alert("Referral reward percentage is not valid!")
      return false
    }

    if (!values.devFee && checkIfUint256(`${values.devFee}`)) {
      alert("Developer reward percentage is not valid!")
      return false 
    }
    
    if (!values.promRefFee && checkIfUint256(`${values.promRefFee}`)) {
      alert("Promotion referral reward is not valid!")
      return false 
    }

    if (!values.promStart) {
      alert("Promotion start timestamp is not valid!")
      return false
    }

    if (!values.promEnd) {
      alert("Promotion end timestamp is not valid!")
      return false 
    }
    return true
  }

  const formik = useFormik<FormInputs>({
    initialValues: {
      rewardToken: '',
      refFee: undefined,
      devFee: undefined,
      promRefFee: undefined,
      promStart: undefined,
      promEnd: undefined,
    },
    onSubmit: async (values) => {
      if (!contract) return
      if (!selectedCoin) return

      if (!validateInputs(values)) return

      const promStart = values.promStart!
      const promEnd = values.promEnd!

      try {
        await contract.setFeeInfo(
          selectedCoin.address, 
          values.rewardToken, 
          values.refFee, 
          values.devFee, 
          values.promRefFee, 
          new Date(promStart).getTime(), 
          new Date(promEnd).getTime())
        alert('Transaction succeeded!')
      } catch {
        alert("Can't run transaction!")
      }

  }})

  return <>
    <Text bold>
      Set fee information
    </Text>
    <StyledWhiteBr />
    <form onSubmit={formik.handleSubmit}>
      <Text mb="4px" small>
        Reward token
      </Text>
      <StyledInput id="rewardToken" name="rewardToken" type="text" onChange={formik.handleChange} value={formik.values.rewardToken} />
      <Text mb="4px" small>
        Referral reward percentage
      </Text>
      <StyledInput id="refFee" name="refFee" type="number" onChange={formik.handleChange} value={formik.values.refFee}/>
      <Text mb="4px" small>
        Developer reward percentage 
      </Text>
      <StyledInput id="devFee" name="devFee" type="number" onChange={formik.handleChange} value={formik.values.devFee}/>
      <Text mb="4px" small>
        Promotion referral reward
      </Text>
      <StyledInput id="promRefFee" name="promRefFee" type="number" onChange={formik.handleChange} value={formik.values.promRefFee}/>
      <Text mb="4px" small>
        Promotion start timestamp
      </Text>
      <StyledInput id="promStart" name="promStart" type="date" onChange={formik.handleChange} value={formik.values.promStart}/>
      <Text mb="4px" small>
        Promotion end timestamp
      </Text>
      <StyledInput id="promEnd" name="promEnd" type="date" onChange={formik.handleChange} value={formik.values.promEnd}/>
      <Box style={{marginTop: '12px'}}>
        <Button type="submit" disabled={selectedCoin?.symbol === 'WBNB'}>Submit</Button>
      </Box>
    </form>
    <StyledBr />
  </>
}

const SetLeadManager: React.FC<SectionProps> = ({contract, selectedCoin}) => {
  const [influncerWallet, setInfluncerWallet] = useState('')
  const [fee, setFee] = useState('')

  const submitHandler = async () => {

    if (!selectedCoin) return
    if (!contract) return

    if (!checkIfUint256(fee)) {
      alert(`Invalid fee!`)
      return
    }

    if (!isAddress(influncerWallet)) {
      alert('Invalid wallet address!')
      return
    }

    try {
      await contract.setLeadInfluencer(selectedCoin.address, influncerWallet, fee)
      alert('Transaction succeeded!')
    } catch {
      alert("Can't run transaction!")
    }
  } 

  return <>
    <Text bold>
      Set Lead Influencer
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Influencer wallet address
      </Text>
      <StyledInput value={influncerWallet} onChange={(e) => {
        const newValue = e.target.value
        setInfluncerWallet(newValue)
      }}/>
      <Text mb="4px" small>
        Lead fee
      </Text>
      <StyledInput value={fee} onChange={(e) => {
        const newValue = e.target.value
        setFee(newValue)
      }}/>
      <Box style={{marginTop: '12px'}}>
        <Button onClick={submitHandler}>Submit</Button>
      </Box>
    </Box>
    <StyledBr />
  </>
}

const RemoveLead: React.FC<SectionProps> = ({contract, selectedCoin}) => {

  const [influncerWallet, setInfluncerWallet] = useState('');

  const submitHandler = async () => {  
    if (!contract) return
    if (!selectedCoin) return

    if (isAddress(influncerWallet)) {
      try {
        await contract.removeLeadInfluencer(selectedCoin.address, influncerWallet)
        alert('Transaction succeeded!')
      } catch {
        alert("Can't run transaction!")
      }
    } else {
      alert('Invalid wallet address!')
    }
  }

  return <>
    <Text bold>
      Remove Lead Influencer
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Influencer wallet address
      </Text>
      <StyledInput value={influncerWallet} onChange={(e) => {
        const newValue = e.target.value
        setInfluncerWallet(newValue)
      }}/>
      <Box style={{marginTop: '12px'}}>
        <Button onClick={submitHandler}>Submit</Button>
      </Box>
    </Box>
    <StyledBr />
  </>

}

export default CoinManagerSegment