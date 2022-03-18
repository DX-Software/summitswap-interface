import React, { useEffect, useState } from 'react'
import { Text, Box, Button, Flex } from '@koda-finance/summitswap-uikit'
import { Token } from '@koda-finance/summitswap-sdk'
import { useFormik } from 'formik';
import styled from 'styled-components'
import { BigNumber, Contract, ethers } from 'ethers'
import { AddressZero } from '@ethersproject/constants'
import web3 from 'web3'

import { useReferralContract } from 'hooks/useContract'
import checkIfUint256 from 'utils/checkUint256'
import DateInput from '../DateInput'
import { isAddress } from '../../../utils'
import { StyledBr, StyledWhiteBr } from '../StyledBr';
import StyledInput from '../StyledInput'
import { SegmentsProps } from './SegmentsProps';
import { FeeInfo, InfInfo } from '../types';

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
  onDismiss: () => void
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

  const [feePlaceholder, setFeePlaceholder] = useState<string | undefined>()

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

      const _fee = fee ? ethers.utils.parseUnits(fee.toString(), 7) : "0"

      try {
        const transaction = await contract.setFirstBuyFee(selectedCoin.address, _fee)
        transactionSubmitted(transaction.hash, 'Set first buy fee succeeded')
      } catch (err) {
        transactionFailed(err.message as string)
      }
    }
  })

  useEffect(() => {
    const fetchFirstBuyRefereeFee = async () => {
      if (!selectedCoin) return
      if (!contract) return

      const transaction = await contract.firstBuyRefereeFee(selectedCoin.address) as BigNumber

      const holder = transaction.toString()

      setFeePlaceholder(holder !== '0' ? holder : undefined)
    }
    fetchFirstBuyRefereeFee()
  }, [selectedCoin, contract])

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
        <StyledInput value={formik.values.fee} onChange={formik.handleChange} name="fee" min="0" max="100" type="number" placeholder={feePlaceholder} autoComplete="off" />
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
  const [formHolder, setFormHolder] = useState<FeeInfo | undefined>()

  interface FormInputs {
    rewardToken: string;
    refFee?: number;
    devFee?: number;
    promRefFee?: number;
    promStart?: string;
    promEnd?: string;
  }

  const isPercentage = (value?: number): boolean => {
    if (!value) return false

    return value >= 0 && value <= 100
  }

  const validateInputs = (values: FormInputs) => {

    if (!values.refFee && checkIfUint256(`${values.refFee}`) && !isPercentage(values.refFee)) {
      transactionFailed('Referral reward percentage is not valid!')
      return false
    }

    if (!values.devFee && checkIfUint256(`${values.devFee}`) && !isPercentage(values.devFee)) {
      transactionFailed('Developer reward percentage is not valid!')
      return false
    }

    if (values.promRefFee) {
      if (!checkIfUint256(`${values.promRefFee}`) && !isPercentage(values.promRefFee)) {
        transactionFailed('Promotion referral reward is not valid!')
        return false
      }
    }

    return true
  }

  useEffect(() => {
    const fetchFirstBuyRefereeFee = async () => {
      if (!selectedCoin) return
      if (!contract) return

      const transaction = await contract.feeInfo(selectedCoin.address) as FeeInfo

      if (transaction.tokenR === AddressZero) {
        setFormHolder(undefined)
      } else {
        setFormHolder(transaction)
      }
    }
    fetchFirstBuyRefereeFee()
  }, [selectedCoin, contract])

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

      const _refFee = refFee ? ethers.utils.parseUnits(refFee.toString(), 7) : "0"
      const _devFee = devFee ? ethers.utils.parseUnits(devFee.toString(), 7) : "0"
      const _promRefFee = promRefFee ? ethers.utils.parseUnits(promRefFee.toString(), 7) : "0"
      const _promStart = promStart ? `${Math.floor(new Date(promStart).getTime() / 1000)}` : "0"
      const _promEnd = promEnd ? `${Math.floor(new Date(promEnd).getTime() / 1000)}` : "0"

      try {
        const transaction = await contract.setFeeInfo(
          selectedCoin.address,
          values.rewardToken,
          _refFee.toString(),
          _devFee.toString(),
          _promRefFee.toString(),
          _promStart.toString(),
          _promEnd.toString(),
        )
        transactionSubmitted(transaction.hash, 'Set fee information succeeded')
      } catch (err) {
        const callError = err as any
        const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
        transactionFailed(callErrorMessage)
      }
    }
  })

  const formatAmount = (amount?: BigNumber) => {
    if (!amount) return undefined
    if (!selectedCoin) return undefined
    return ethers.utils.formatUnits(amount, selectedCoin.decimals)
  }

  const formatDate = (timestamp?: BigNumber) => {
    if (!timestamp) return undefined
    const date = new Date(web3.utils.hexToNumber(timestamp._hex))

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
  }

  return <>
    <Text bold>
      Set Fee Information
    </Text>
    <StyledWhiteBr />
    <form onSubmit={formik.handleSubmit}>
      <Text mb="4px" small>
        Reward token
      </Text>
      <StyledInput name="rewardToken" type="text" onChange={formik.handleChange} value={formik.values.rewardToken} placeholder={formHolder?.tokenR} autoComplete="off" />
      <Text mb="4px" small>
        Referral reward percentage
      </Text>
      <Flex>
        <StyledInput name="refFee" type="number" onChange={formik.handleChange} value={formik.values.refFee} placeholder={formatAmount(formHolder?.refFee)} />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Developer reward percentage
      </Text>
      <Flex>
        <StyledInput name="devFee" type="number" onChange={formik.handleChange} value={formik.values.devFee} placeholder={formatAmount(formHolder?.devFee)} />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Promotion referral reward percentage (optional)
      </Text>
      <Flex>
        <StyledInput name="promRefFee" type="number" onChange={formik.handleChange} value={formik.values.promRefFee} placeholder={formatAmount(formHolder?.promRefFee)} />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Promotion start timestamp (optional)
      </Text>
      <DateInput name="promStart" type="date" onChange={formik.handleChange} value={formik.values.promStart || ''} placeholder={formatDate(formHolder?.promStart)} />
      <Text mb="4px" small>
        Promotion end timestamp (optional)
      </Text>
      <DateInput name="promEnd" type="date" onChange={formik.handleChange} value={formik.values.promEnd || ''} placeholder={formatDate(formHolder?.promEnd)} />
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

      const _fee = fee ? ethers.utils.parseUnits(fee.toString(), 7) : "0"

      try {
        const transaction = await contract.setLeadInfluencer(selectedCoin.address, influencerWallet, _fee)
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
        <StyledInput value={formik.values.influencerWallet} onChange={formik.handleChange} name="influencerWallet" autoComplete="off" placeholder={AddressZero}/>
        <Text mb="4px" small>
          Lead fee
        </Text>
        <StyledInput value={formik.values.fee} onChange={formik.handleChange} name="fee" type="number" placeholder="0" min="0" max="100"/>
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
        <StyledInput value={formik.values.influencerWallet} onChange={formik.handleChange} name="influencerWallet" autoComplete="off" placeholder={AddressZero}/>
        <Box style={{ marginTop: '12px' }}>
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
    <StyledBr />
  </>

}

const CheckRole: React.FC<SectionProps> = ({
  contract,
  selectedCoin,
  openModel,
  transactionFailed,
  onDismiss
}) => {
  interface FormInputs {
    influencerWallet?: string;
  }

  const [infInfo, setInfInfo] = useState<InfInfo | undefined>()


  const formik = useFormik<FormInputs>({
    initialValues: {
      influencerWallet: undefined,
    },
    onSubmit: async (values) => {
      const { influencerWallet } = values

      if (!contract) return
      if (!selectedCoin) return
      if (!influencerWallet) return

      openModel('Check address role')

      if (!isAddress(influencerWallet)) {
        transactionFailed('Invalid wallet address!')
        return
      }

      try {
        const transaction = await contract.influencers(selectedCoin.address, influencerWallet) as InfInfo
        onDismiss()
        setInfInfo(transaction)
      } catch (err) {
        transactionFailed(err.message as string)
      }
    }
  }
  )

  const getRole = (info?: InfInfo) => {
    if (!info) return null

    if (info.isLead && info.isActive) {
      return <Text bold>This is a Lead Influencer</Text>
    } 
    
    if (info.lead !== AddressZero && info.isActive){ 
      return <Text bold>This is a Sub Influencer</Text>
    } 
      
    return <Text bold>This is not an Influencer</Text>
  }

  return <>
    <Text bold>
      Check role for address
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Wallet address
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <StyledInput value={formik.values.influencerWallet} onChange={formik.handleChange} name="influencerWallet" autoComplete="off" placeholder={AddressZero}/>
        <Box style={{ marginTop: '12px' }}>
          <Button type="submit">Submit</Button>
        </Box>
      </form>
      {infInfo && (infInfo.isActive ? (
        <Box>
          <StyledBr />
          {getRole(infInfo)}
          {
            (infInfo.lead !== AddressZero) ? (
              <Text>
                Lead address - {infInfo.lead}
              </Text>
            ) : null
          }
          <Text>
            Lead Fee - {ethers.utils.formatUnits(infInfo.leadFee, 7)}
          </Text>
          <Text>
            Referral Fee - {ethers.utils.formatUnits(infInfo.refFee, 7)}
          </Text>
        </Box>
      ) : (
        <Text bold> No influencer found with this addresse</Text>
      ))}
    </Box>
    <StyledBr />
  </>

}


const CoinManagerSegment: React.FC<SegmentsProps> = ({ outputToken, openModel, transactionSubmitted, transactionFailed, onDismiss }) => {
  const refContract = useReferralContract(true)

  const forwardedProps = {
    contract: refContract,
    selectedCoin: outputToken,
    openModel,
    transactionSubmitted,
    transactionFailed,
    onDismiss
  }

  return <>
    <SetFirstBuyFee {...forwardedProps} />
    <SetLeadManager {...forwardedProps} />
    <RemoveLead {...forwardedProps} />
    <SetFeeInfo {...forwardedProps} />
    <CheckRole {...forwardedProps} />
  </>
}

export default CoinManagerSegment