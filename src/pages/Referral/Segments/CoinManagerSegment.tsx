import React from 'react'
import { Text, Box, Button, Flex } from '@koda-finance/summitswap-uikit'
import { Token } from '@koda-finance/summitswap-sdk'
import { useFormik } from 'formik';
import styled from 'styled-components'
import { Contract } from 'ethers'


import { useReferralContract } from 'hooks/useContract'
import checkIfUint256 from 'utils/checkUint256'
import { isAddress } from '../../../utils'
import { StyledBr, StyledWhiteBr } from '../StyledBr';
import StyledInput from '../StyledInput'
import { SegmentsProps } from './SegmentsProps';



const InputForDates = styled(StyledInput)`
  -webkit-appearance: none;
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
}

`

const CenterSign = styled(Flex)`
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  margin-top: 8px;
  margin-left: 8px;
`

interface SectionProps {
  contract: Contract | null
  selectedCoin?: Token
  openModel: (pendingMess: string) => void
  transactionSubmitted: (hashText: string, summary: string) => void
  transactionFailed: (messFromError: string) => void
}

const SetFirstBuyFee: React.FC<SectionProps> = ({
  contract,
  selectedCoin,
  openModel,
  transactionSubmitted,
  transactionFailed
}) => {

  interface FormInputs {
    fee?: number;
  }

  const formik = useFormik<FormInputs>({
    initialValues: {
      fee: undefined
    },
    onSubmit: async (values) => {
      const { fee } = values

      if (!selectedCoin) return
      if (!contract) return
      if (!fee) return

      openModel('Set first buy fee')
      
      if (!checkIfUint256(`${fee}`)) {
        transactionFailed('Invalid Fee!')
        return
      }

      try {
        const transaction = await contract.setFirstBuyFee(selectedCoin.address, fee)
        transactionSubmitted(transaction.hash, 'Set first buy fee succeeded')
      } catch (err) {
        transactionFailed(err.message as string)
      }
    }
  })

  return <>
    <Text bold>
      Set First Buy Fee
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Fee value
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <StyledInput value={formik.values.fee} onChange={formik.handleChange} name="fee" min="0" type="number" />
        <Box style={{ marginTop: '12px' }}>
          <Button type="submit" >Submit</Button>
        </Box>
      </form>
    </Box>
    <StyledBr />
  </>
}

const SetFeeInfo: React.FC<SectionProps> = ({
  contract,
  selectedCoin,
  openModel,
  transactionSubmitted,
  transactionFailed
}) => {
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
      transactionFailed('Referral reward percentage is not valid!')
      return false
    }

    if (!values.devFee && checkIfUint256(`${values.devFee}`)) {
      transactionFailed('Developer reward percentage is not valid!')
      return false
    }

    if (values.promRefFee) {
      if (checkIfUint256(`${values.promRefFee}`)) {
        transactionFailed('Promotion referral reward is not valid!')
        return false
      }
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

      openModel('Set fee information')

      if (!validateInputs(values)) return

      const {
        promStart,
        promEnd,
        refFee,
        devFee,
        promRefFee
      } = values

      try {
        const transaction = await contract.setFeeInfo(
          selectedCoin.address,
          values.rewardToken,
          refFee ? refFee * 10 ** 7 : null,
          devFee ? devFee * 10 ** 7 : null,
          promRefFee ? promRefFee * 10 ** 7 : null,
          promStart ? new Date(promStart).getTime() : null,
          promEnd ? new Date(promEnd).getTime() : null)
        transactionSubmitted(transaction.hash, 'Set fee information succeeded')
      } catch (err) {
        transactionFailed(err.message as string)
      }
    }
  })



  return <>
    <Text bold>
      Set Fee Information
    </Text>
    <StyledWhiteBr />
    <form onSubmit={formik.handleSubmit}>
      <Text mb="4px" small>
        Reward token
      </Text>
      <StyledInput name="rewardToken" type="text" onChange={formik.handleChange} value={formik.values.rewardToken} />
      <Text mb="4px" small>
        Referral reward percentage
      </Text>
      <Flex>
        <StyledInput name="refFee" type="number" onChange={formik.handleChange} value={formik.values.refFee} min="0" />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Developer reward percentage
      </Text>
      <Flex>
        <StyledInput name="devFee" type="number" onChange={formik.handleChange} value={formik.values.devFee} min="0" />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Promotion referral reward percentage
      </Text>
      <Flex>
        <StyledInput name="promRefFee" type="number" onChange={formik.handleChange} value={formik.values.promRefFee} min="0" />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Promotion start timestamp
      </Text>
      <InputForDates name="promStart" type="date" onChange={formik.handleChange} value={formik.values.promStart} />
      <Text mb="4px" small>
        Promotion end timestamp
      </Text>
      <InputForDates name="promEnd" type="date" onChange={formik.handleChange} value={formik.values.promEnd} />
      <Box style={{ marginTop: '12px' }}>
        <Button type="submit" disabled={selectedCoin?.symbol === 'WBNB'}>Submit</Button>
      </Box>
    </form>
    <StyledBr />
  </>
}

const SetLeadManager: React.FC<SectionProps> = ({
  contract,
  selectedCoin,
  openModel,
  transactionSubmitted,
  transactionFailed
}) => {
  interface FormInputs {
    influencerWallet?: string;
    fee?: string;
  }

  const formik = useFormik<FormInputs>({
    initialValues: {
      influencerWallet: undefined,
      fee: undefined
    },
    onSubmit: async (values) => {

      const { fee, influencerWallet } = values

      if (!selectedCoin) return
      if (!contract) return
      if (!fee) return
      if (!influencerWallet) return

      openModel('Set lead influencer')

      if (!checkIfUint256(fee)) {
        transactionFailed('Invalid fee!')
        return
      }

      if (!isAddress(influencerWallet)) {
        transactionFailed('Invalid wallet address!')
        return
      }

      try {
        const transaction = await contract.setLeadInfluencer(selectedCoin.address, influencerWallet, fee)
        transactionSubmitted(transaction.hash, 'Set lead influencer succeeded')
      } catch (err) {
        transactionFailed(err.message as string)
      }
    }
  })

  return <>
    <Text bold>
      Set Lead Influencer
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Influencer wallet address
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <StyledInput value={formik.values.influencerWallet} onChange={formik.handleChange} name="influencerWallet" />
        <Text mb="4px" small>
          Lead fee
        </Text>
        <StyledInput value={formik.values.fee} onChange={formik.handleChange} name="fee" type="number" />
        <Box style={{ marginTop: '12px' }}>
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
    <StyledBr />
  </>
}

const RemoveLead: React.FC<SectionProps> = ({
  contract,
  selectedCoin,
  openModel,
  transactionSubmitted,
  transactionFailed
}) => {
  interface FormInputs {
    influencerWallet?: string;
  }

  const formik = useFormik<FormInputs>({
    initialValues: {
      influencerWallet: undefined,
    },
    onSubmit: async (values) => {
      const { influencerWallet } = values

      if (!contract) return
      if (!selectedCoin) return
      if (!influencerWallet) return

      openModel('Remove lead influencer')

      if (!isAddress(influencerWallet)) {
        transactionFailed('Invalid wallet address!')
        return
      }

      try {
        const transaction = await contract.removeLeadInfluencer(selectedCoin.address, influencerWallet)
        transactionSubmitted(transaction.hash, 'Remove lead influencer succeeded')
      } catch (err) {
        transactionFailed(err.message as string)
      }
    }
  }
  )


  return <>
    <Text bold>
      Remove Lead Influencer
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Influencer wallet address
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <StyledInput value={formik.values.influencerWallet} onChange={formik.handleChange} name="influencerWallet" />
        <Box style={{ marginTop: '12px' }}>
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
    <StyledBr />
  </>

}

const CoinManagerSegment: React.FC<SegmentsProps> = ({ outputToken, openModel, transactionSubmitted, transactionFailed}) => {
  const refContract = useReferralContract(true)

  const forwardedProps = {
    contract: refContract,
    selectedCoin: outputToken,
    openModel,
    transactionSubmitted,
    transactionFailed
  }

  return <>
    <SetFirstBuyFee {...forwardedProps} />
    <SetLeadManager {...forwardedProps} />
    <RemoveLead {...forwardedProps} />
    <SetFeeInfo {...forwardedProps} />
  </>
}

export default CoinManagerSegment