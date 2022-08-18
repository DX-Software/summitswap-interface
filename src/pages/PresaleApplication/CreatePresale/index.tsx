import React, { useState, useEffect, useCallback } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useFormik, FormikProps } from 'formik'
import { Token } from '@koda-finance/summitswap-sdk'
import { useFactoryPresaleContract, useTokenContract } from 'hooks/useContract'
import { Flex, Box, Radio, Text } from '@koda-finance/summitswap-uikit'
import {
  RADIO_VALUES,
  TOKEN_CHOICES,
  PRESALE_FACTORY_ADDRESS,
  FEE_DECIMALS,
  FEE_PAYMENT_TOKEN,
  FEE_PRESALE_TOKEN,
  FEE_EMERGENCY_WITHDRAW,
} from 'constants/presale'
import { ROUTER_ADDRESS, PANCAKESWAP_ROUTER_V2_ADDRESS } from '../../../constants'
import steps from './steps-data'
import CreationStep01 from './CreationStep01'
import CreationStep02 from './CreationStep02'
import CreationStep03 from './CreationStep03'
import CreationStep04 from './CreationStep04'
import CreationStep05 from './CreationStep05'
import CreationStep06, { Divider, getUtcDate } from './CreationStep06'
import { validatePresaleDetails, validateProjectDetails } from './formValidations'
import { PresaleDetails, ProjectDetails, FieldNames } from '../types'

const StepsWrapper = styled(Box)`
  width: 522px;
  text-align: center;
`
const ContentWrapper = styled(Box)`
  width: 90%;
  max-width: 950px;
`

const StepLine = styled.div`
  position: relative;
  top: 18px;
  background: #3c3742;
  border-radius: 9px;
  width: 100%;
  height: 4px;
`

const StyledRadio = styled(Radio)<{ completed: boolean }>`
  cursor: auto;
  background-color: ${({ completed, theme }) => (completed ? theme.colors.success : theme.colors.inputColor)};
  &:hover:not(:disabled):not(:checked) {
    box-shadow: none;
  }
  &:focus {
    box-shadow: none;
  }
  &:after {
    background-color: ${({ completed, theme }) => (completed ? theme.colors.success : theme.colors.inputColor)};
  }
  &:checked {
    &:after {
      background-color: ${({ theme }) => theme.colors.inputColor};
    }
  }
`
const CreatePresale = () => {
  const { account, library } = useWeb3React()

  const [isLoading, setIsLoading] = useState(false)
  const [presaleAddress, setPresaleAddress] = useState('')
  const [stepNumber, setStepNumber] = useState(0)
  const [currency, setCurrency] = useState('BNB')
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [accountBalance, setAccountBalance] = useState<BigNumber>()

  const tokenContract = useTokenContract(selectedToken?.address, true)
  const factoryContract = useFactoryPresaleContract(PRESALE_FACTORY_ADDRESS)

  useEffect(() => {
    async function fetchBalance() {
      setAccountBalance(await tokenContract?.balanceOf(account))
    }
    if (account && tokenContract) {
      fetchBalance()
    }
  }, [account, tokenContract])

  const changeStepNumber = useCallback((num: number) => setStepNumber(num), [])

  const formikPresale: FormikProps<PresaleDetails> = useFormik({
    initialValues: {
      [FieldNames.presaleRate]: undefined,
      [FieldNames.isWhitelistEnabled]: RADIO_VALUES.WHITELIST_ENABLED,
      [FieldNames.softcap]: undefined,
      [FieldNames.hardcap]: undefined,
      [FieldNames.minBuy]: undefined,
      [FieldNames.maxBuy]: undefined,
      [FieldNames.refundType]: RADIO_VALUES.REFUND_TYPE_REFUND,
      [FieldNames.listingChoice]: RADIO_VALUES.LISTING_SS_100,
      [FieldNames.liquidity]: undefined,
      [FieldNames.listingRate]: undefined,
      [FieldNames.startPresaleDate]: undefined,
      [FieldNames.startPresaleTime]: '00:00',
      [FieldNames.endPresaleDate]: undefined,
      [FieldNames.endPresaleTime]: '00:00',
      [FieldNames.liquidyLockTimeInMins]: undefined,
      [FieldNames.tokenAmount]: undefined,
      [FieldNames.paymentToken]: TOKEN_CHOICES.BNB,
      [FieldNames.listingToken]: TOKEN_CHOICES.KODA,
      [FieldNames.maxClaimPercentage]: undefined,
      [FieldNames.claimIntervalDay]: undefined,
      [FieldNames.claimIntervalHour]: undefined,
      [FieldNames.isVestingEnabled]: RADIO_VALUES.VESTING_DISABLED,
    } as PresaleDetails,
    validate: validatePresaleDetails,
    // eslint-disable-next-line
    onSubmit: () => {},
  })

  const formikProject: FormikProps<ProjectDetails> = useFormik({
    initialValues: {
      [FieldNames.projectName]: '',
      [FieldNames.logoUrl]: '',
      [FieldNames.contactName]: '',
      [FieldNames.contactPosition]: '',
      [FieldNames.telegramId]: '',
      [FieldNames.discordId]: '',
      [FieldNames.twitterId]: '',
      [FieldNames.email]: '',
    } as ProjectDetails,
    validate: validateProjectDetails,
    onSubmit: async (valuesProject: ProjectDetails) => {
      const values = { ...valuesProject, ...formikPresale.values }
      if (!factoryContract || !selectedToken || !formikPresale.isValid) {
        return
      }

      setIsLoading(true)
      try {
        const receipt = await factoryContract.createPresale(
          [
            values.logoUrl,
            values.projectName,
            values.contactName,
            values.contactPosition,
            values.email,
            values.telegramId,
            values.discordId,
            values.twitterId,
          ],
          {
            presaleToken: selectedToken.address,
            router0: ROUTER_ADDRESS,
            router1: PANCAKESWAP_ROUTER_V2_ADDRESS,
            listingToken: values.listingToken,
            presalePrice: parseUnits((values.presaleRate || 0).toString(), 18),
            listingPrice: parseUnits((values.listingRate || 0).toString(), 18),
            liquidityLockTime: (values.liquidyLockTimeInMins || 0) * 60,
            minBuy: parseUnits((values.minBuy || 0).toString(), 18),
            maxBuy: parseUnits((values.maxBuy || 0).toString(), 18),
            softCap: parseUnits((values.softcap || 0).toString(), 18),
            hardCap: parseUnits((values.hardcap || 0).toString(), 18),
            liquidityPercentage: BigNumber.from(values.liquidity)
              .mul(10 ** FEE_DECIMALS)
              .div(100),
            startPresaleTime: getUtcDate(values.startPresaleDate || '', values.startPresaleTime || '').getTime() / 1000,
            endPresaleTime: getUtcDate(values.endPresaleDate || '', values.endPresaleTime || '').getTime() / 1000,
            claimIntervalDay: `${values.isVestingEnabled}` === 'true' ? values.claimIntervalDay : 15,
            claimIntervalHour: `${values.isVestingEnabled}` === 'true' ? values.claimIntervalHour : 0,
            totalBought: '0',
            maxClaimPercentage:
              `${values.isVestingEnabled}` === 'true'
                ? BigNumber.from(values.maxClaimPercentage)
                    .mul(10 ** FEE_DECIMALS)
                    .div(100)
                : BigNumber.from(1).mul(10 ** FEE_DECIMALS),
            refundType: values.refundType,
            listingChoice: values.listingChoice,
            isWhiteListPhase: `${values.isWhitelistEnabled}` === 'true',
            isClaimPhase: false,
            isPresaleCancelled: false,
            isWithdrawCancelledTokens: false,
            isVestingEnabled: `${values.isVestingEnabled}` === 'true',
            isApproved: false,
          },
          {
            paymentToken: values.paymentToken,
            feePaymentToken: BigNumber.from(FEE_PAYMENT_TOKEN)
              .mul(10 ** FEE_DECIMALS)
              .div(100),
            feePresaleToken: BigNumber.from(FEE_PRESALE_TOKEN)
              .mul(10 ** FEE_DECIMALS)
              .div(100),
            feeEmergencyWithdraw: BigNumber.from(FEE_EMERGENCY_WITHDRAW)
              .mul(10 ** FEE_DECIMALS)
              .div(100),
          },
          parseUnits(`${values.tokenAmount}`, selectedToken.decimals),
          {
            value: await factoryContract.preSaleFee(),
          }
        )

        await library.waitForTransaction(receipt.hash)

        const tokenPresales: string[] = await factoryContract.getTokenPresales(selectedToken.address)
        setIsLoading(false)
        setPresaleAddress(tokenPresales[tokenPresales.length - 1])
        window.location.href = `/#/presale?address=${tokenPresales[tokenPresales.length - 1]}`
      } catch (err) {
        setIsLoading(false)
        console.error(err)
      }
    },
  })

  useEffect(() => {
    if (accountBalance && selectedToken) {
      formikPresale.values.accountBalance = Number(formatUnits(accountBalance, selectedToken.decimals))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountBalance, selectedToken])

  useEffect(() => {
    if (
      formikPresale.values.hardcap &&
      formikPresale.values.presaleRate &&
      formikPresale.values.listingRate &&
      formikPresale.values.liquidity &&
      selectedToken
    ) {
      const presaleTokenAmount = formikPresale.values.presaleRate * formikPresale.values.hardcap
      const tokensForLiquidity =
        (formikPresale.values.liquidity / 100) * formikPresale.values.hardcap * formikPresale.values.listingRate
      formikPresale.values.tokenAmount = presaleTokenAmount + tokensForLiquidity
    } else {
      formikPresale.values.tokenAmount = 0
    }
  }, [formikPresale, selectedToken])

  const showStep = () => {
    switch (stepNumber) {
      case 0:
        return (
          <CreationStep01
            formik={formikPresale}
            selectedToken={selectedToken}
            currency={currency}
            changeStepNumber={changeStepNumber}
            setSelectedToken={setSelectedToken}
            setCurrency={setCurrency}
          />
        )
      case 1:
        return <CreationStep02 formik={formikPresale} currency={currency} changeStepNumber={changeStepNumber} />
      case 2:
        return (
          <CreationStep03 selectedToken={selectedToken} formik={formikPresale} changeStepNumber={changeStepNumber} />
        )
      case 3:
        return <CreationStep04 formik={formikPresale} changeStepNumber={changeStepNumber} />
      case 4:
        return (
          <CreationStep05
            formikProject={formikProject}
            formikPresale={formikPresale}
            changeStepNumber={changeStepNumber}
          />
        )
      case 5:
        return (
          <CreationStep06
            currency={currency}
            isLoading={isLoading}
            formikProject={formikProject}
            formikPresale={formikPresale}
            selectedToken={selectedToken}
            changeStepNumber={changeStepNumber}
          />
        )
      default:
        return <></>
    }
  }

  return (
    <>
      <StepsWrapper>
        <Text color="primary" small>
          {steps[stepNumber].name}
        </Text>
        <Text marginTop="8px" fontSize="24px" fontWeight={700}>
          {steps[stepNumber].title}
        </Text>
        <Text marginTop="8px" color="textSubtle">
          {steps[stepNumber].subTitle}
        </Text>
        <Box marginY="35px">
          <StepLine />
          <Flex justifyContent="space-between">
            <StyledRadio completed={stepNumber > 0} checked={stepNumber === 0} onClick={() => setStepNumber(0)} />
            <StyledRadio completed={stepNumber > 1} checked={stepNumber === 1} onClick={() => setStepNumber(1)} />
            <StyledRadio completed={stepNumber > 2} checked={stepNumber === 2} onClick={() => setStepNumber(2)} />
            <StyledRadio completed={stepNumber > 3} checked={stepNumber === 3} onClick={() => setStepNumber(3)} />
            <StyledRadio completed={stepNumber > 4} checked={stepNumber === 4} onClick={() => setStepNumber(4)} />
            <StyledRadio completed={stepNumber > 5} checked={stepNumber === 5} onClick={() => setStepNumber(5)} />
          </Flex>
        </Box>
      </StepsWrapper>
      <Divider />
      <ContentWrapper>{showStep()}</ContentWrapper>
    </>
  )
}

export default CreatePresale
