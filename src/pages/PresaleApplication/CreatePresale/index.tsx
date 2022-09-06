import React, { useState, useEffect, useCallback } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useFormik, FormikProps } from 'formik'
import { Token } from '@koda-finance/summitswap-sdk'
import { useFactoryPresaleContract, usePresaleContract, useTokenContract } from 'hooks/useContract'
import { Box, Text } from '@koda-finance/summitswap-uikit'
import {
  RADIO_VALUES,
  TOKEN_CHOICES,
  FEE_DECIMALS,
  FEE_PAYMENT_TOKEN,
  FEE_PRESALE_TOKEN,
  FEE_EMERGENCY_WITHDRAW,
  CONTACT_INFO_DELIMITER,
} from 'constants/presale'
import { useToken } from 'hooks/Tokens'
import { fetchPresaleInfo } from 'utils/presale'
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

const ContentWrapper = styled(Box)`
  width: 90%;
  max-width: 950px;
`
interface Props {
  setHomeButtonIndex: React.Dispatch<React.SetStateAction<number>>
}
const CreatePresale = ({ setHomeButtonIndex }: Props) => {
  const { account, library } = useWeb3React()

  const [isLoading, setIsLoading] = useState(false)
  const [stepNumber, setStepNumber] = useState(0)
  const [currency, setCurrency] = useState('BNB')
  const [lastTokenPresales, setLastTokenPresales] = useState('')
  const [canMakeNewPresale, setCanMakeNewPresale] = useState(true)
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [accountBalance, setAccountBalance] = useState<BigNumber>(BigNumber.from(0))

  const tokenContract = useTokenContract(selectedToken?.address, true)
  const factoryContract = useFactoryPresaleContract()
  const lastTokenPresaleContract = usePresaleContract(lastTokenPresales)

  useEffect(() => {
    async function fetchBalance() {
      setAccountBalance(await tokenContract?.balanceOf(account))
    }
    if (account && tokenContract) {
      fetchBalance()
    }
  }, [account, tokenContract])

  useEffect(() => {
    async function checkIsLastPresaleCancelled() {
      const info = await fetchPresaleInfo(lastTokenPresaleContract)
      if (info.isPresaleCancelled) {
        setCanMakeNewPresale(true)
      } else {
        setCanMakeNewPresale(false)
      }
    }
    if (lastTokenPresaleContract) checkIsLastPresaleCancelled()
  }, [lastTokenPresaleContract])

  useEffect(() => {
    async function checkIfPresaleExists() {
      const addresses: string[] = await factoryContract?.getTokenPresales(selectedToken?.address)
      if (addresses.length > 0) {
        setLastTokenPresales(addresses[addresses.length - 1])
      } else {
        setLastTokenPresales('')
        setCanMakeNewPresale(true)
      }
    }
    if (factoryContract && selectedToken) checkIfPresaleExists()
  }, [selectedToken, factoryContract])

  const changeStepNumber = useCallback((num: number) => setStepNumber(num), [])

  const paymentToken = useToken(currency !== 'BNB' ? TOKEN_CHOICES[currency] : undefined)

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
      [FieldNames.claimIntervalDay]: 15,
      [FieldNames.claimIntervalHour]: 0,
      [FieldNames.isVestingEnabled]: RADIO_VALUES.VESTING_DISABLED,
    } as PresaleDetails,
    validate: validatePresaleDetails,
    // eslint-disable-next-line
    onSubmit: () => {},
  })

  const formikProject: FormikProps<ProjectDetails> = useFormik({
    initialValues: {
      [FieldNames.projectName]: '',
      [FieldNames.contactMethod]: 'Telegram',
      [FieldNames.logoUrl]: '',
      [FieldNames.contactName]: '',
      [FieldNames.contactPosition]: '',
      [FieldNames.telegramId]: '',
      [FieldNames.discordId]: '',
      [FieldNames.twitterId]: '',
      [FieldNames.email]: '',
      [FieldNames.description]: '',
    } as ProjectDetails,
    validate: validateProjectDetails,
    onSubmit: async (valuesProject: ProjectDetails) => {
      const values = { ...valuesProject, ...formikPresale.values }
      if (!factoryContract || !selectedToken || !formikPresale.isValid) {
        return
      }

      setIsLoading(true)

      const combinedSocialIds = [values.websiteUrl, values.discordId, values.twitterId, values.telegramId].join(
        CONTACT_INFO_DELIMITER
      )

      try {
        const receipt = await factoryContract.createPresale(
          [
            values.logoUrl,
            values.projectName,
            values.contactName,
            values.contactPosition,
            values.email,
            values.contactMethod,
            values.description,
            combinedSocialIds,
          ],
          {
            presaleToken: selectedToken.address,
            router0: ROUTER_ADDRESS,
            router1: PANCAKESWAP_ROUTER_V2_ADDRESS,
            listingToken: values.listingToken,
            presalePrice: parseUnits((values.presaleRate || 0).toString(), 18),
            listingPrice: parseUnits((values.listingRate || 0).toString(), 18),
            liquidityLockTime: (values.liquidyLockTimeInMins || 0) * 60,
            minBuy: parseUnits((values.minBuy || 0).toString(), paymentToken?.decimals),
            maxBuy: parseUnits((values.maxBuy || 0).toString(), paymentToken?.decimals),
            softCap: parseUnits((values.softcap || 0).toString(), paymentToken?.decimals),
            hardCap: parseUnits((values.hardcap || 0).toString(), paymentToken?.decimals),
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
        window.location.href = `/#/presale-application?address=${tokenPresales[tokenPresales.length - 1]}`
        setHomeButtonIndex(2)
      } catch (err) {
        setIsLoading(false)
        console.error(err)
      }
    },
  })

  useEffect(() => {
    if (selectedToken) {
      formikPresale.setFieldValue(
        FieldNames.accountBalance,
        Number(formatUnits(accountBalance, selectedToken.decimals))
      )
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
            lastTokenPresales={lastTokenPresales}
            canMakeNewPresale={canMakeNewPresale}
            formik={formikPresale}
            selectedToken={selectedToken}
            currency={currency}
            changeStepNumber={changeStepNumber}
            setSelectedToken={setSelectedToken}
            setCurrency={setCurrency}
          />
        )
      case 1:
        return (
          <CreationStep02
            selectedToken={selectedToken}
            formik={formikPresale}
            currency={currency}
            changeStepNumber={changeStepNumber}
          />
        )
      case 2:
        return (
          <CreationStep03
            selectedToken={selectedToken}
            currency={currency}
            formik={formikPresale}
            changeStepNumber={changeStepNumber}
          />
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
    <ContentWrapper>
      <Text color="textSubtle" small>
        {`${steps[stepNumber].name} of 06 - ${steps[stepNumber].title}`}
      </Text>
      <Text marginBottom="4px" style={{ lineHeight: '40px' }} fontSize="40px" fontWeight={700}>
        Create New Presale
      </Text>
      <Divider />
      {showStep()}
    </ContentWrapper>
  )
}

export default CreatePresale
