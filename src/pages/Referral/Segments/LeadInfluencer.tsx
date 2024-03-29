import React, { useEffect, useState } from 'react'
import { Text, Box, Button, Flex } from '@koda-finance/summitswap-uikit'
import { Contract, Event, ethers } from 'ethers'
import { useFormik } from 'formik'
import { useWeb3React } from '@web3-react/core'
import { AddressZero } from '@ethersproject/constants'

import { useReferralContract } from 'hooks/useContract';
import { isAddress } from 'utils'
import { PaginatedRewards, ReferralReward } from '../types'
import { StyledWhiteBr } from '../StyledBr';
import StyledInput from '../StyledInput'
import { REFERRAL_DEPLOYMENT_BLOCKNUMBER, MAX_QUERYING_BLOCK_AMOUNT } from '../../../constants'
import LeadHistory from './LeadHistory'
import { SegmentsProps } from './SegmentsProps'
import { CenterSign } from '../CenterDiv'
import { isdecimals, isPercentage } from '../utility'

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
      transactionFailed('Sub influencers wallet adresses is not valid!')
      return false
    }

    const _leadFee = Number(inputs.leadFee)
    const _refFee = Number(inputs.refFee)
    if (!inputs.leadFee || !isdecimals(_leadFee) || !isPercentage(_leadFee)) {
      transactionFailed('Lead influencers fee is not a valid value!')
      return false
    }

    if (!inputs.refFee || !isdecimals(_refFee) || !isPercentage(_refFee)) {
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
          ethers.utils.parseUnits(values.leadFee?.toString() || '0', 7),
          ethers.utils.parseUnits(values.refFee?.toString() || '0', 7)
        )
        transactionSubmitted(transaction, 'Sub influencer set successfully')
      } catch (err){
        const callError = err as any
        const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
        transactionFailed(callErrorMessage)
      }
  }})

  return <>
    <Text bold>
      Set Sub Influencer
    </Text>
    <StyledWhiteBr />
    <form onSubmit={formik.handleSubmit}>
      <Text mb="4px" small>
        Sub influencer wallet address
      </Text>
      <StyledInput name="subWalletAdress" type="text" onChange={formik.handleChange} value={formik.values.subWalletAdress} autoComplete="off" placeholder={AddressZero}/>
      <Text mb="4px" small>
        Lead influencer fee
      </Text>
      <Flex>
        <StyledInput name="leadFee" type="number" onChange={formik.handleChange} value={formik.values.leadFee} min="0" max="100" placeholder="0" step={0.01} />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Sub influencer fee
      </Text>
      <Flex>
        <StyledInput name="refFee" type="number" onChange={formik.handleChange} value={formik.values.refFee} min="0" max="100" placeholder="0" step={0.01} />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
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
