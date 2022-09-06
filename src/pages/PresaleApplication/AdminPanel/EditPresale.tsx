/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useFormik, FormikProps } from 'formik'
import { useWeb3React } from '@web3-react/core'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useToken } from 'hooks/Tokens'
import { usePresaleContract, useFactoryPresaleContract } from 'hooks/useContract'
import { fetchPresaleInfo, fetchFeeInfo, fetchProjectDetails } from 'utils/presale'
import { FEE_DECIMALS, JOIN_IDS_WITH } from 'constants/presale'
import { NULL_ADDRESS } from 'constants/index'
import { getUtcDate } from '../CreatePresale/CreationStep06'
import { PresaleInfo, ProjectDetails, FeeInfo, FieldNames, AdminForm as IAdminForm } from '../types'
import PresaleStatus from './PresaleStatus'
import validations from './formValidation'
import EditPresaleForm from './EditPresaleForm'

interface Props {
  presaleAddress: string
  handleEditButtonHandler: (isEdit: boolean) => void
}

const EditPresale = ({ presaleAddress, handleEditButtonHandler }: Props) => {
  const { account, library } = useWeb3React()

  const [isLoading, setIsLoading] = useState(false)
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>()

  const factoryContract = useFactoryPresaleContract()
  const presaleContract = usePresaleContract(presaleAddress)
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken !== NULL_ADDRESS ? presaleFeeInfo?.paymentToken : undefined
  )

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract)
      const feeInfo = await fetchFeeInfo(presaleContract)
      const projDetails = await fetchProjectDetails(presaleContract)
      setPresaleInfo({ ...preInfo })
      setPresaleFeeInfo({ ...feeInfo })
      setProjectDetails({ ...projDetails })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

  useEffect(() => {
    if (presaleInfo && presaleInfo.isApproved) handleEditButtonHandler(true)
  }, [presaleInfo, handleEditButtonHandler])

  const formik: FormikProps<IAdminForm> = useFormik({
    initialValues: {
      [FieldNames.presaleInfo]: undefined,
    } as IAdminForm,
    validate: validations,
    onSubmit: async (values: IAdminForm) => {
      if (!presaleContract || !factoryContract || !presaleInfo || presaleInfo?.isApproved || !account) {
        return
      }
      const combinedSocialIds = [values.websiteUrl, values.discordId, values.twitterId, values.telegramId].join(
        JOIN_IDS_WITH
      )

      try {
        setIsLoading(true)
        const receipt = await factoryContract.updatePresaleAndApprove(
          {
            presaleToken: presaleInfo.presaleToken,
            router0: presaleInfo.router0,
            router1: presaleInfo.router1,
            listingToken: values.listingToken,
            presalePrice: presaleInfo.presaleRate,
            listingPrice: presaleInfo.listingRate,
            liquidityLockTime: (values.liquidyLockTimeInMins || 0) * 60,
            minBuy: parseUnits((values.minBuy || 0).toString(), paymentToken?.decimals),
            maxBuy: parseUnits((values.maxBuy || 0).toString(), paymentToken?.decimals),
            softCap: parseUnits((values.softcap || 0).toString(), paymentToken?.decimals),
            hardCap: presaleInfo.hardcap,
            liquidityPercentage: presaleInfo.liquidity,
            startPresaleTime: getUtcDate(values.startPresaleDate || '', values.startPresaleTime || '').getTime() / 1000,
            endPresaleTime: getUtcDate(values.endPresaleDate || '', values.endPresaleTime || '').getTime() / 1000,
            claimIntervalDay:
              `${values.isVestingEnabled}` === 'true' ? values.claimIntervalDay : presaleInfo.claimIntervalDay,
            claimIntervalHour:
              `${values.isVestingEnabled}` === 'true' ? values.claimIntervalHour : presaleInfo.claimIntervalHour,
            totalBought: '0',
            maxClaimPercentage:
              `${values.isVestingEnabled}` === 'true'
                ? BigNumber.from(values.maxClaimPercentage)
                    .mul(10 ** FEE_DECIMALS)
                    .div(100)
                : presaleInfo.maxClaimPercentage,
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
            feePaymentToken: BigNumber.from(values.feePaymentToken || 0)
              .mul(10 ** FEE_DECIMALS)
              .div(100),
            feePresaleToken: BigNumber.from(values.feePresaleToken || 0)
              .mul(10 ** FEE_DECIMALS)
              .div(100),
            feeEmergencyWithdraw: BigNumber.from(values.emergencyWithdrawFee)
              .mul(10 ** FEE_DECIMALS)
              .div(100),
          },
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
          presaleAddress
        )
        await library.waitForTransaction(receipt.hash)
        setIsLoading(false)
        setPresaleInfo((preInfo) => preInfo && { ...preInfo, isApproved: true })
        handleEditButtonHandler(false)
      } catch (err) {
        console.error(err)
        setIsLoading(false)
      }
    },
  })

  useEffect(() => {
    if (presaleContract && presaleInfo && projectDetails && presaleFeeInfo && !formik.values.presaleInfo) {
      formik.setValues({
        [FieldNames.isWhitelistEnabled]: presaleInfo.isWhitelistEnabled,
        [FieldNames.softcap]: Number(formatUnits(presaleInfo.softcap, paymentToken?.decimals)),
        [FieldNames.minBuy]: Number(formatUnits(presaleInfo.minBuy, paymentToken?.decimals)),
        [FieldNames.maxBuy]: Number(formatUnits(presaleInfo.maxBuy, paymentToken?.decimals)),
        [FieldNames.refundType]: presaleInfo.refundType,
        [FieldNames.listingChoice]: presaleInfo.listingChoice,
        [FieldNames.startPresaleDate]: new Date(presaleInfo.startPresaleTime.mul(1000).toNumber())
          .toISOString()
          .substring(0, 10),
        [FieldNames.startPresaleTime]: new Date(presaleInfo.startPresaleTime.mul(1000).toNumber())
          .toISOString()
          .substring(11, 16),
        [FieldNames.endPresaleDate]: new Date(presaleInfo.endPresaleTime.mul(1000).toNumber())
          .toISOString()
          .substring(0, 10),
        [FieldNames.endPresaleTime]: new Date(presaleInfo.endPresaleTime.mul(1000).toNumber())
          .toISOString()
          .substring(11, 16),
        [FieldNames.liquidyLockTimeInMins]: presaleInfo.liquidyLockTimeInMins.div(60).toNumber(),
        [FieldNames.paymentToken]: presaleFeeInfo.paymentToken,
        [FieldNames.listingToken]: presaleInfo.listingToken,
        [FieldNames.maxClaimPercentage]: presaleInfo.maxClaimPercentage
          .mul(100)
          .div(10 ** FEE_DECIMALS)
          .toNumber(),
        [FieldNames.claimIntervalDay]: presaleInfo.claimIntervalDay.toNumber(),
        [FieldNames.claimIntervalHour]: presaleInfo.claimIntervalHour.toNumber(),
        [FieldNames.isVestingEnabled]: presaleInfo.isVestingEnabled,
        [FieldNames.feePresaleToken]: presaleFeeInfo.feePresaleToken
          .mul(100)
          .div(10 ** FEE_DECIMALS)
          .toNumber(),
        [FieldNames.feePaymentToken]: presaleFeeInfo.feePaymentToken
          .mul(100)
          .div(10 ** FEE_DECIMALS)
          .toNumber(),
        [FieldNames.emergencyWithdrawFee]: presaleFeeInfo.emergencyWithdrawFee
          .mul(100)
          .div(10 ** FEE_DECIMALS)
          .toNumber(),
        ...projectDetails,
        [FieldNames.presaleInfo]: { ...presaleInfo },
      } as IAdminForm)
    }
  }, [presaleContract, projectDetails, presaleInfo, presaleFeeInfo, formik, paymentToken])

  return (
    <>
      <PresaleStatus presaleInfo={presaleInfo} presaleAddress={presaleAddress} />
      <EditPresaleForm isLoading={isLoading} formik={formik} cancelEditButtonHandler={handleEditButtonHandler} />
    </>
  )
}

export default EditPresale
