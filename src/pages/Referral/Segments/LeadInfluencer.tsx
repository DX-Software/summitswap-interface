import React, { useEffect, useState } from 'react'
import { Text, Box, Button} from '@summitswap-uikit'
import styled from 'styled-components'
import { Token } from '@summitswap-libs'
import { Contract, Event } from 'ethers'
import { useFormik } from 'formik'
import { useWeb3React } from '@web3-react/core'

import { useReferralContract } from 'hooks/useContract';
import { isAddress } from 'utils'
import checkIfUint256 from 'utils/checkUint256'
import { ReferralReward } from '../types'
import StyledInput from '../StyledInput';
import { StyledBr, StyledWhiteBr } from '../StyledBr';
import { REFERRAL_DEPLOYMENT_BLOCKNUMBER, MAX_QUERYING_BLOCK_AMOUNT } from '../../../constants'


const InfluencerBox = styled(Box)`
  color: ${({ theme }) => theme.colors.invertedContrast};
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
`

interface LeadInfluencerProps {
  selectedCoin?: Token
}

interface SetSubInfluencerSegmentProps {
  contract: Contract | null
  selectedCoin?: Token
}

const SetSubInfluencerSegment: React.FC<SetSubInfluencerSegmentProps> = ({contract, selectedCoin}) => {

  interface FormInputs {
    subWalletAdress?: string
    leadFee?: string
    refFee?: string
  }

  const validateInputs = (inputs: FormInputs) => {
    if (!isAddress(inputs.subWalletAdress)) {
      alert('Sub influencers wallet adresses is not valid!')
      return false
    }

    if (!inputs.leadFee && checkIfUint256(inputs.leadFee || '')) {
      alert('Lead influencers fee is not a valid value!')
      return false
    }

    if (!inputs.refFee && checkIfUint256(inputs.refFee || '')) {
      alert('Sub influencers fee is not a valid value!')
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
      if (!selectedCoin) return
      if (!validateInputs(values)) return

      try {
        await contract.setSubInfluencer(
          selectedCoin.address, 
          values.subWalletAdress, 
          values.leadFee, 
          values.refFee
        )
        alert('Transaction succeeded!')
      } catch (error) {
        console.error(error)
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
        Sub Influncer Wallet Address
      </Text>
      <StyledInput id="subWalletAdress" name="subWalletAdress" type="text" onChange={formik.handleChange} value={formik.values.subWalletAdress} />
      <Text mb="4px" small>
        Lead Influencer Fee
      </Text>
      <StyledInput id="leadFee" name="leadFee" type="number" onChange={formik.handleChange} value={formik.values.leadFee}/>
      <Text mb="4px" small>
        Sub Influncer Fee 
      </Text>
      <StyledInput id="refFee" name="refFee" type="number" onChange={formik.handleChange} value={formik.values.refFee}/>
      <Box style={{marginTop: '12px'}}>
        <Button type="submit">Submit</Button>
      </Box>
    </form>
    <StyledBr />
  </>
}

const LeadInfluencer: React.FC<LeadInfluencerProps> = ({selectedCoin}) => {
  const refContract = useReferralContract(true)
  const [subReward, setSubReward] = useState<ReferralReward[]>([])
  const { account, library} = useWeb3React()

  useEffect(() => {
    async function fetchReferralData() {
      if (!account || !refContract || !library) return
      
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

      setSubReward(subInfluencerReward)
    }
    fetchReferralData()
  }, [account, refContract, library])

  return <>
    <SetSubInfluencerSegment contract={refContract} selectedCoin={selectedCoin} />
  </>
}


export default LeadInfluencer