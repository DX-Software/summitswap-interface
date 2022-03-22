import React, { useEffect, useState } from 'react'
import { Text, Box, Button, Flex } from '@koda-finance/summitswap-uikit'
import { Token } from '@koda-finance/summitswap-sdk'
import { TransactionResponse } from '@ethersproject/providers'
import { useFormik } from 'formik';
import { BigNumber, Contract, ethers } from 'ethers'
import { AddressZero } from '@ethersproject/constants'
import web3 from 'web3'

import { useReferralContract } from 'hooks/useContract'
import checkIfUint256 from 'utils/checkUint256'
import DateInput from '../DateInput'
import isPercentage from '../utility';
import { isAddress } from '../../../utils'
import { StyledBr, StyledWhiteBr } from '../StyledBr';
import StyledInput from '../StyledInput'
import { SegmentsProps } from './SegmentsProps';
import { FeeInfo, InfInfo } from '../types';
import { CenterSign } from '../CenterDiv';

interface SectionProps {
  contract: Contract | null
  selectedCoin?: Token
  openModel: (pendingMess: string) => void
  transactionSubmitted: (response: TransactionResponse, summary: string) => void
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
        setFeePlaceholder(ethers.utils.formatUnits(_fee, 7))
        transactionSubmitted(transaction, 'Set first buy fee succeeded')
      } catch (err) {
        const callError = err as any
        const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
        transactionFailed(callErrorMessage)
      }
    }
  })

  useEffect(() => {
    const fetchFirstBuyRefereeFee = async () => {
      if (!selectedCoin) return
      if (!contract) return

      const transaction = await contract.firstBuyRefereeFee(selectedCoin.address) as BigNumber

      const holder = ethers.utils.formatUnits(transaction, 7)
      
      setFeePlaceholder(holder)
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
        <Flex>          
          <StyledInput value={formik.values.fee} onChange={formik.handleChange} name="fee" min="0" max="100" step={0.01} type="number" placeholder={feePlaceholder} autoComplete="off" />
          <CenterSign>
            <Text bold>%</Text>
          </CenterSign>
        </Flex>
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

  const formatDateFromNumber = (timestamp?: BigNumber) => {
    if (!timestamp) return ""

    const fromHexToNumber = web3.utils.hexToNumber(timestamp._hex)

    const date = new Date(fromHexToNumber)

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
  }

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return ""
    const date = new Date(Number(timestamp))

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
  }

  useEffect(() => {
    const fetchFirstBuyRefereeFee = async () => {
      if (!selectedCoin) return
      if (!contract) return

      const transaction = await contract.feeInfo(selectedCoin.address)

      if (transaction.tokenR === AddressZero) {
        setFormHolder({
          tokenR: AddressZero,
          refFee: BigNumber.from(0),
          devFee: BigNumber.from(0),
          promRefFee: undefined,
          promStart: undefined,
          promEnd: undefined
        })
      } else {
        setFormHolder({
          tokenR: transaction.tokenR,
          refFee: transaction.refFee as BigNumber,
          devFee: transaction.devFee as BigNumber,
          promRefFee: transaction.promRefFee as BigNumber,
          promStart: formatDateFromNumber((transaction.promStart as BigNumber).mul(1000)),
          promEnd: formatDateFromNumber((transaction.promEnd as BigNumber).mul(1000)),
        })
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

      const _refFee = refFee ? ethers.utils.parseUnits(refFee.toString(), 7) : BigNumber.from(0)
      const _devFee = devFee ? ethers.utils.parseUnits(devFee.toString(), 7) : BigNumber.from(0)
      const _promRefFee = promRefFee ? ethers.utils.parseUnits(promRefFee.toString(), 7) : BigNumber.from(0)
      const _promStart = promStart ? `${Math.floor(new Date(promStart).getTime() / 1000)}` : '0'
      const _promEnd = promEnd ? `${Math.floor(new Date(promEnd).getTime() / 1000)}` : '0'

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

        setFormHolder({
          tokenR: values.rewardToken,
          refFee: _refFee,
          devFee: _devFee,
          promRefFee: _promRefFee,
          promStart: formatDate(_promStart),
          promEnd: formatDate(_promEnd),
        })

        transactionSubmitted(transaction, 'Set fee information succeeded')
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
    return ethers.utils.formatUnits(amount, 7)
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
        <StyledInput name="refFee" type="number" step={0.01} onChange={formik.handleChange} value={formik.values.refFee} placeholder={formatAmount(formHolder?.refFee)} />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Developer reward percentage
      </Text>
      <Flex>
        <StyledInput name="devFee" type="number" step={0.01} onChange={formik.handleChange} value={formik.values.devFee} placeholder={formatAmount(formHolder?.devFee)} />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Promotion referral reward percentage (optional)
      </Text>
      <Flex>
        <StyledInput name="promRefFee" type="number" step={0.01} onChange={formik.handleChange} value={formik.values.promRefFee} placeholder={formatAmount(formHolder?.promRefFee)} />
        <CenterSign>
          <Text bold>%</Text>
        </CenterSign>
      </Flex>
      <Text mb="4px" small>
        Promotion start timestamp (optional)
      </Text>
      <DateInput name="promStart" type="date" onChange={formik.handleChange} value={formik.values.promStart || ''} placeholder={formHolder?.promStart} />
      <Text mb="4px" small>
        Promotion end timestamp (optional)
      </Text>
      <DateInput name="promEnd" type="date" onChange={formik.handleChange} value={formik.values.promEnd || ''} placeholder={formHolder?.promEnd} />
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
        transactionSubmitted(transaction, 'Set lead influencer succeeded')
      } catch (err) {
        const callError = err as any
        const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
        transactionFailed(callErrorMessage)
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
        <Flex>
          <StyledInput value={formik.values.fee} onChange={formik.handleChange} name="fee" type="number" placeholder="0" min="0" max="100" step={0.01} />
          <CenterSign>
            <Text bold>%</Text>
          </CenterSign>
        </Flex>
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
        transactionSubmitted(transaction, 'Remove lead influencer succeeded')
      } catch (err) {
        const callError = err as any
        const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
        transactionFailed(callErrorMessage)
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
        const callError = err as any
        const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
        transactionFailed(callErrorMessage)
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
            Lead Fee - {ethers.utils.formatUnits(infInfo.leadFee, 7)} %
          </Text>
          <Text>
            Referral Fee - {ethers.utils.formatUnits(infInfo.refFee, 7)} %
          </Text>
        </Box>
      ) : (
        <>
          <StyledBr />
          <Text bold> No influencer found with this address</Text>
        </>
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