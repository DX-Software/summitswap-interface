import React, { useEffect, useState } from 'react'
import { Text, Box, Button } from '@koda-finance/summitswap-uikit'
import { Contract, Event } from 'ethers'
import { useFormik } from 'formik'
import { useWeb3React } from '@web3-react/core'

import { useReferralContract } from 'hooks/useContract';
import { isAddress } from 'utils'
import checkIfUint256 from 'utils/checkUint256'
import { PaginatedRewards, ReferralReward } from '../types'
import { StyledWhiteBr } from '../StyledBr';
import StyledInput from '../StyledInput'
import { REFERRAL_DEPLOYMENT_BLOCKNUMBER, MAX_QUERYING_BLOCK_AMOUNT } from '../../../constants'
import LeadHistory from './LeadHistory'
import { SegmentsProps } from './SegmentsProps'

interface SetSubInfluencerSegmentProps extends SegmentsProps {
  contract: Contract | null
}

const getRewardsPaginated = (rewards: ReferralReward[]) => {
  const pagination: PaginatedRewards = {}
  return rewards.reduce((acc, reward) => {
    const input = acc[reward.referrer]
    if (input) {
      acc[reward.referrer].push(reward)
    } else {
      acc[reward.referrer] = []
    }
    return acc
  }, pagination)
}

const SetSubInfluencerSegment: React.FC<SetSubInfluencerSegmentProps> = ({
  contract, 
  outputToken,
  openModel,
  transactionSubmitted,
  transactionFailed
}) => {

  interface FormInputs {
    subWalletAdress?: string
    leadFee?: string
    refFee?: string
  }

  const validateInputs = (inputs: FormInputs) => {
    if (!isAddress(inputs.subWalletAdress)) {
      alert('Sub influencers wallet adresses is not valid!')
      transactionFailed('Sub influencers wallet adresses is not valid!')
      return false
    }

    if (!inputs.leadFee && checkIfUint256(inputs.leadFee || '')) {
      transactionFailed('Lead influencers fee is not a valid value!')
      return false
    }

    if (!inputs.refFee && checkIfUint256(inputs.refFee || '')) {
      transactionFailed('Sub influencers fee is not a valid value!')
      return false
    }

    return true
  }

  const formik = useFormik<FormInputs>({
    initialValues: {
      subWalletAdress: undefined,
      leadFee: undefined,
      refFee: undefined,
    },
    onSubmit: async (values) => {
      if (!contract) return
      if (!outputToken) return

      openModel('Set Sub Influencer')

      if (!validateInputs(values)) return

      try {
        const transaction = await contract.setSubInfluencer(
          outputToken.address, 
          values.subWalletAdress, 
          values.leadFee, 
          values.refFee
        )
        transactionSubmitted(transaction.hash, 'Sub influencer set successfully')
      } catch (err){
        transactionFailed(err.message as string)
      }
  }})

  return <>
    <Text bold>
      Set Sub Influencer
    </Text>
    <StyledWhiteBr />
    <form onSubmit={formik.handleSubmit}>
      <Text mb="4px" small>
        Sub influncer wallet address
      </Text>
      <StyledInput name="subWalletAdress" type="text" onChange={formik.handleChange} value={formik.values.subWalletAdress} autoComplete="off"/>
      <Text mb="4px" small>
        Lead influencer fee
      </Text>
      <StyledInput name="leadFee" type="number" onChange={formik.handleChange} value={formik.values.leadFee} min="0"/>
      <Text mb="4px" small>
        Sub influncer fee 
      </Text>
      <StyledInput name="refFee" type="number" onChange={formik.handleChange} value={formik.values.refFee} min="0"/>
      <Box style={{marginTop: '12px'}}>
        <Button type="submit">Submit</Button>
      </Box>
    </form>
  </>
}


const LeadInfluencer: React.FC<SegmentsProps> = ({
  outputToken,
  openModel,
  transactionSubmitted,
  transactionFailed,
  onDismiss
}) => {
  const refContract = useReferralContract(true)
  const [subReward, setSubReward] = useState<PaginatedRewards>({})
  const { account, library } = useWeb3React()
  const [selectedAddress, setSelectedAddress] = useState('')
  
  useEffect(() => {
    async function fetchReferralData() {
      if (!account || !refContract || !library || !outputToken) return
      
      const referralsRewardEvents = refContract.filters.ReferralReward(null, account)

      const latestBlocknumber = await library.getBlockNumber()

      let referrerEvents = [] as Event[]

      const queries: [start: number, end: number][] = []

      for (
        let blockNumber = REFERRAL_DEPLOYMENT_BLOCKNUMBER;
        blockNumber < latestBlocknumber;
        blockNumber += MAX_QUERYING_BLOCK_AMOUNT
      ) {
        queries.push([blockNumber, Math.min(latestBlocknumber, blockNumber + MAX_QUERYING_BLOCK_AMOUNT - 1)])
      }
      await Promise.all(queries.map(async (query) => {
        const referrerReward = await refContract.queryFilter(referralsRewardEvents, query[0], query[1])

        referrerEvents = [...referrerEvents, ...referrerReward]
      }))

      const subInfluencerReward = referrerEvents.map(event => event.args) as ReferralReward[]

      const filteredRewards = subInfluencerReward.filter(reward => reward.outputToken === outputToken?.address)

      const rewards = getRewardsPaginated(filteredRewards)

      const subAdresses = Object.keys(rewards)

      const firstAddress = subAdresses.length ? subAdresses[0] : ''
      
      setSelectedAddress(firstAddress)

      setSubReward(rewards)
    }
    fetchReferralData()
  }, [account, refContract, library, outputToken])

  const modelFunctions = {
    openModel,
    transactionSubmitted,
    transactionFailed,
    onDismiss
  }

  return <>
    <SetSubInfluencerSegment 
      contract={refContract} 
      outputToken={outputToken} {...modelFunctions}/>
    <LeadHistory 
      paginatedRewards={subReward} 
      selectedAddress={selectedAddress} 
      setSelectedAddress={setSelectedAddress} 
      outputToken={outputToken} />
  </>
}


export default LeadInfluencer