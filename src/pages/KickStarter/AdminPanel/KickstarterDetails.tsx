import { ArrowBackIcon, Breadcrumbs, Button, CheckmarkIcon, EditIcon, Flex, Heading, Input, Radio, Select, Skeleton, Text, TextArea, useModal } from "@koda-finance/summitswap-uikit"
import { Grid } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import { useKickstarterById, useKickstarterContactMethod, useKickstarterContactMethodUpdate } from "api/useKickstarterApi"
import { UploadImageResult, useUploadImageApi } from "api/useUploadImageApi"
import { getTokenImageBySymbol } from "connectors"
import { NULL_ADDRESS } from "constants/index"
import { CONTACT_METHODS } from "constants/kickstarter"
import { format, fromUnixTime, getUnixTime } from "date-fns"
import { parseUnits } from "ethers/lib/utils"
import { FormikProps, FormikProvider, useFormik } from "formik"
import { useKickstarterContract, useTokenContract } from "hooks/useContract"
import React, { useCallback, useRef, useState } from "react"
import styled from "styled-components"
import { ContactMethod, Kickstarter, KickstarterApprovalStatus, KickstarterApprovalStatusId, WithdrawalFeeMethod } from "types/kickstarter"
import { getKickstarterContactMethodById, getSymbolByAddress } from "utils/kickstarter"
import { CurrencyInfo, Divider, StatusInfo, TextInfo } from "../shared"
import ChoosePaymentToken from "../shared/ChoosePaymentToken"
import FundingInput from "../shared/FundingInput"
import { Project, ProjectFormField } from "../types"
import RejectModal from "./RejectModal"

type KickstarterDetailsProps = {
  previousPage: string
  kickstarterId: string
  handleKickstarterId: (value: string) => void
}

type HeaderProps = {
  previousPage: string
  handleKickstarterId: (value: string) => void
}

type EditButtonsProps = {
  formik: FormikProps<Project>
  isEdit: boolean
  isDisabled: boolean
  handleIsEdit: (isEdit: boolean) => void
}

type SectionProps = {
  formik?: FormikProps<Project>
  kickstarter?: Kickstarter
  isLoading?: boolean
}

type EditSectionProps = {
  kickstarter?: Kickstarter
  formik: FormikProps<Project>
}

type EditWithdrawalOptionProps = {
  formik: FormikProps<Project>
  value: string
  isSelected: boolean
  title: string
  inputTitle: string
  description: JSX.Element
}

const ImageWrapper = styled(Flex)`
  flex-shrink: 0;
  width: 270px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: auto;

  img {
    width: 100%;
    height: fit-content;
  }
`

const ProjectDetailsContainer = styled(Flex)`
  column-gap: 16px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Header = ({ previousPage, handleKickstarterId }: HeaderProps) => {
  return (
    <>
      <Flex borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={() => handleKickstarterId("")}>
            {previousPage}
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            Project Details
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} onClick={() => handleKickstarterId("")}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: "underline" }}>back to Admin Panel</Text>
      </Flex>
    </>
  )
}

const EditButtons = ({ formik, isEdit, handleIsEdit, isDisabled }: EditButtonsProps) => {
  return (
    <Flex style={{ columnGap: "8px" }}>
      {!isEdit && (
        <Button
        variant="tertiary"
        scale="sm"
        startIcon={<EditIcon />}
        style={{fontFamily:'Poppins'}}
        onClick={() => handleIsEdit(true)}
        disabled={isDisabled}
        isLoading={formik.isSubmitting}>
        Edit Project
      </Button>
      )}
      {isEdit && (
        <>
          <Button
            scale="sm"
            startIcon={<CheckmarkIcon color="default" />}
            style={{fontFamily:'Poppins'}}
            disabled={isDisabled}
            isLoading={formik.isSubmitting}
            onClick={() => formik.submitForm()}>
            Change & Approve
          </Button>
          <Button
            variant="tertiary"
            scale="sm"
            style={{fontFamily:'Poppins'}}
            isLoading={formik.isSubmitting}
            onClick={() => handleIsEdit(false)}
            disabled={isDisabled}>
            Cancel Edit
          </Button>
        </>
      )}
    </Flex>
  )
}

const ProjectDetails = ({ formik, kickstarter, isLoading }: SectionProps) => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Project Details</Heading>
      <ProjectDetailsContainer>
          <ImageWrapper>
            {isLoading ? <Skeleton height={270} width={320} /> : (
              <img src={kickstarter?.imageUrl || ""} alt="Kickstarter" />
            )}
          </ImageWrapper>
        <br />
        <Flex flexDirection="column" style={{ width: "100%" }}>
          <StatusInfo
            title="Project Status"
            approvalStatus={kickstarter?.approvalStatus || KickstarterApprovalStatus.WAITING_FOR_APPROVAL}
            isLoading={isLoading}
          />
          {kickstarter?.approvalStatus === KickstarterApprovalStatus.REJECTED && (
            <>
              <br />
              <Text fontSize="14px" color="textSubtle" marginBottom="4px">Rejection Reason</Text>
              <Text color="failure">{kickstarter?.rejectedReason || "-"}</Text>
            </>
          )}
          <Divider />
          <TextInfo
            title="Project Title"
            description={kickstarter?.title}
            isLoading={isLoading}
          />
          <br />
          <TextInfo
            title="Project Creator"
            description={kickstarter?.creator}
            isLoading={isLoading}
          />
          <br />
          <TextInfo
            title="Project Description"
            description={kickstarter?.projectDescription}
            isLoading={isLoading}
          />
          <br />
          <Grid container spacing="16px">
            <Grid item xs={12} sm={6} lg={4}>
              <CurrencyInfo
                title="Project Currency"
                description={kickstarter?.tokenSymbol}
                iconUrl={getTokenImageBySymbol(kickstarter?.tokenSymbol)}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <CurrencyInfo
                title="Project Goals"
                description={kickstarter?.projectGoals?.toString()}
                iconUrl={getTokenImageBySymbol(kickstarter?.tokenSymbol)}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <CurrencyInfo
                title="Minimum Backing"
                description={kickstarter?.minContribution?.toString()}
                iconUrl={getTokenImageBySymbol(kickstarter?.tokenSymbol)}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
        </Flex>
      </ProjectDetailsContainer>
    </>
  )
}

const EditProjectDetails = ({ formik, kickstarter }: EditSectionProps) => {
  const inputFileElement = useRef<HTMLInputElement>(null)

  const handleChooseImage = () => {
    inputFileElement.current?.click()
  }

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    formik.setFieldValue(ProjectFormField.image, event.target.files[0])
  }

  const handleMinimumBackingChanged = useCallback(
    (value: string) => {
      if (value !== '' && value.match('^[0-9]{0,9}(\\.[0-9]{0,18})?$') == null) return
      formik.setFieldValue(ProjectFormField.minContribution, value)
    },
    [formik]
  )
  const handleProjectGoalsChanged = useCallback(
    (value: string) => {
      if (value !== '' && value.match('^[0-9]{0,9}(\\.[0-9]{0,18})?$') == null) return
      formik.setFieldValue(ProjectFormField.projectGoals, value)
    },
    [formik]
  )

  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Project Details</Heading>
      <ProjectDetailsContainer>
        <ImageWrapper onClick={handleChooseImage}>
          <img src={formik.values.image ? URL.createObjectURL(formik.values.image) : (kickstarter?.imageUrl || "")} alt="Kickstarter" />
        </ImageWrapper>
        <input
          ref={inputFileElement}
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageSelected}
          style={{ display: 'none' }}
        />
        <br />
        <Flex flexDirection="column" style={{ width: "100%" }}>
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Project Title</Text>
          <Input
            placeholder="Enter your project title"
            name={ProjectFormField.title}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <br />
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Project Creator</Text>
          <Input
            placeholder="Enter your name"
            name={ProjectFormField.creator}
            value={formik.values.creator}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <br />
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Project Description</Text>
          <TextArea
            placeholder="Write something about your project"
            name={ProjectFormField.projectDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {formik.values.projectDescription}
          </TextArea>
          <br />
        </Flex>
      </ProjectDetailsContainer>
      <br />
      <ChoosePaymentToken formik={formik} />
      <br />
      <Grid container spacing="16px">
        <Grid item sm={12} md={6}>
          <FundingInput
            label="Project Goals"
            tokenSymbol={getSymbolByAddress(formik.values.paymentToken)}
            value={formik.values.projectGoals.toString()}
            onChange={handleProjectGoalsChanged}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <FundingInput
            label="Minimum Backing"
            tokenSymbol={getSymbolByAddress(formik.values.paymentToken)}
            value={formik.values.minContribution.toString()}
            description="NB : This is the minimum amount for participate in donating the project"
            onChange={handleMinimumBackingChanged}
          />
        </Grid>
      </Grid>
    </>
  )
}

const FundAndRewardsSystem = ({ formik, kickstarter, isLoading }: SectionProps) => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Fund & Reward System</Heading>
      <TextInfo
        title="Creator Wallet Address"
        description={kickstarter?.owner?.id}
        isLoading={isLoading}
      />
      <br />
      <TextInfo
        title="Reward Description"
        description={kickstarter?.rewardDescription}
        isLoading={isLoading}
      />
      <br />
      <Grid container spacing="16px">
        <Grid item xs={12} sm={6}>
          <TextInfo
            title="Project Due Date"
            description={format(new Date((kickstarter?.endTimestamp?.toNumber() || 0) * 1000), 'LLLL do, yyyy HH:mm')}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo
            title="Reward Distribution"
            description={format(new Date((kickstarter?.rewardDistributionTimestamp?.toNumber() || 0) * 1000), 'LLLL do, yyyy HH:mm')}
            tooltipText="This is only an estimated date. It might be possible for the reward to be distributed earlier or later from scheduled."
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo
            title="Contact Method"
            description={formik?.values.contactMethod}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo
            title="Telegram ID"
            description={formik?.values.contactMethodValue}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </>
  )
}

const EditFundAndRewardsSystem = ({ formik, kickstarter }: EditSectionProps) => {
  const handleContactMethodChange = (value: string) => {
    formik.setFieldValue(ProjectFormField.contactMethod, getKickstarterContactMethodById(value))
  }

  const handleProjectDueDateChange = (value: string) => {
    formik.setFieldValue(ProjectFormField.endTimestamp, value)
  }

  const handleRewardDistributionChange = (value: string) => {
    formik.setFieldValue(ProjectFormField.rewardDistributionTimestamp, value)
  }

  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Fund & Reward System</Heading>
      <TextInfo
        title="Creator Wallet Address"
        description="0x653222feCf0C7a936C121832561f9DD8774eE496"
      />
      <br />
      <Text fontSize="14px" color="textSubtle" marginBottom="4px">Reward Description</Text>
      <TextArea
        placeholder="Describe the reward for this project"
        name={ProjectFormField.rewardDescription}
        value={formik.values.rewardDescription}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <br />
      <Grid container spacing="16px">
        <Grid item sm={12} md={6}>
          <FundingInput
            label="Project Due Date"
            type="datetime-local"
            value={formik.values.endTimestamp}
            description="NB: Due date should be minimum a week after the project is created"
            onChange={handleProjectDueDateChange}
            isFunding={false}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <FundingInput
            label="Reward Distribution"
            type="datetime-local"
            value={formik.values.rewardDistributionTimestamp}
            description="NB: Enter the estimate date for the reward distribution"
            onChange={handleRewardDistributionChange}
            isFunding={false}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Chosen Contact Method</Text>
          <Select
            onValueChanged={handleContactMethodChange}
            options={CONTACT_METHODS}
            selected={formik.values.contactMethod}
            minWidth="165px"
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">
            {CONTACT_METHODS.find((method) => formik.values.contactMethod === method.value)?.label}
          </Text>
          <Input
            placeholder="Enter your Contact Info"
            name={ProjectFormField.contactMethodValue}
            value={formik.values.contactMethodValue}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>
      </Grid>
    </>
  )
}

const Withdrawal = ({ formik, kickstarter, isLoading }: SectionProps) => {
  let withdrawalFeeMethod = "Not Defined"
  let fee = "0"
  if (kickstarter && !!kickstarter.fixFeeAmount?.toNumber()) {
    withdrawalFeeMethod = "Fix Fee"
    fee = kickstarter.fixFeeAmount.times(100).div(10000).toString()
  } else if (kickstarter && !!kickstarter.percentageFeeAmount?.toNumber()) {
    withdrawalFeeMethod = "Percentage Fee"
    fee = `${kickstarter.percentageFeeAmount.times(100).div(10000).toString()}%`
  }

  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Withdrawal Fee Amount</Heading>
      <Grid container spacing="16px">
        <Grid item xs={12} sm={6} lg={4}>
          <TextInfo
            title="Fee Method"
            description={withdrawalFeeMethod}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <TextInfo
            title="Fee Percentage"
            description={fee}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </>
  )
}

const EditWithdrawal = ({ formik, kickstarter }: EditSectionProps) => {
  return (
    <>
      <Heading size='lg' marginBottom="8px" color="sidebarActiveColor">Withdrawal Fee Amount</Heading>
      <Text>Withdrawal fee is collected when project creator wants to withdraw their project fund</Text>
      <br />
      <Grid container spacing="24px">
        <Grid item xs={12} md={6}>
          <EditWithdrawalOption
            formik={formik}
            value={WithdrawalFeeMethod.PERCENTAGE.toString()}
            isSelected={formik.values.withdrawalFeeMethod === WithdrawalFeeMethod.PERCENTAGE.toString()}
            title="Percentage"
            inputTitle="Enter Fee Percentage (%)"
            description={
              <>
                If the project fund has total of 100 BNB, they will have to pay&nbsp;
                <Text bold color="linkColor" style={{ display: "inline-block", fontSize: "inherit" }}>5 BNB (5%)</Text>
                &nbsp;for the withdraw fee
              </>
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <EditWithdrawalOption
            formik={formik}
            value={WithdrawalFeeMethod.FIXED_AMOUNT.toString()}
            isSelected={formik.values.withdrawalFeeMethod === WithdrawalFeeMethod.FIXED_AMOUNT.toString()}
            title="Fixed Amount"
            inputTitle="Enter Fixed Amount"
            description={
              <>
                If the project fund has total of 100 BNB, they will have to pay&nbsp;
                <Text bold color="linkColor" style={{ display: "inline-block", fontSize: "inherit" }}>0 BNB</Text>
                &nbsp;for the withdrawal fee
              </>
            }
          />
        </Grid>
      </Grid>
    </>
  )
}

const EditWithdrawalOption = ({
  formik,
  value,
  isSelected,
  title,
  inputTitle,
  description,
}: EditWithdrawalOptionProps) => {
  const handleFeePercentageChanged = useCallback(
    (feePercentage: string) => {
      if (feePercentage !== '' && feePercentage.match('^[0-9]{0,9}(\\.[0-9]{0,18})?$') == null) return
      formik.setFieldValue(ProjectFormField.withdrawalFeeAmount, feePercentage)
    },
    [formik]
  )
  return (
    <>
      <Flex alignItems="center" style={{ columnGap: "8px" }}>
        <Radio
          scale="sm"
          name={ProjectFormField.withdrawalFeeMethod}
          value={value}
          onChange={formik.handleChange}
          style={{ flexShrink: 0 }}
          checked={isSelected}
        />
        <div>
          <Text bold color={isSelected ? "linkColor" : "default"} fontSize="14px">{title}</Text>
          <Text color="textSubtle" fontSize="12px">User will have to pay withdraw fee from the X% project fund</Text>
        </div>
      </Flex>
      <br />
      <Text fontSize="14px" color={isSelected ? "default": "textDisabled"}>{inputTitle}</Text>
      <Input
        name={ProjectFormField.withdrawalFeeAmount}
        value={isSelected ? formik.values.withdrawalFeeAmount : ""}
        placeholder="0"
        onChange={(e) => handleFeePercentageChanged(e.target.value)}
        style={{ margin: "4px 0" }}
        disabled={!isSelected}
      />
      <Text fontSize="14px" color="textDisabled">{description}</Text>
    </>
  )
}

function KickstarterDetails({ previousPage, kickstarterId, handleKickstarterId }: KickstarterDetailsProps) {
  const { library } = useWeb3React()
  const [isEdit, setIsEdit] = useState(false);
  const kickstarter = useKickstarterById(kickstarterId)
  const kickstarterContract = useKickstarterContract(kickstarterId)
  const tokenContract = useTokenContract(kickstarter.data?.paymentToken)
  const uploadImageApi = useUploadImageApi()
  const kickstarterContactMethod = useKickstarterContactMethod(kickstarterId)
  const kickstarterContactMethodUpdate = useKickstarterContactMethodUpdate()

  const formik: FormikProps<Project> = useFormik<Project>({
    enableReinitialize: true,
    initialValues: {
      title: kickstarter.data?.title || "",
      creator: kickstarter.data?.creator || "",
      image: undefined,
      imageUrl: kickstarter.data?.imageUrl,
      projectDescription: kickstarter.data?.projectDescription || "",
      rewardDescription: kickstarter.data?.rewardDescription || "",
      paymentToken: kickstarter.data?.paymentToken || "",
      projectGoals: kickstarter.data?.projectGoals?.toString() || "",
      minContribution: kickstarter.data?.minContribution?.toString() || "",
      endTimestamp: format(fromUnixTime(kickstarter.data?.endTimestamp?.toNumber() || 0), 'yyyy-MM-dd\'T\'HH:mm'),
      rewardDistributionTimestamp: format(fromUnixTime(kickstarter.data?.rewardDistributionTimestamp?.toNumber() || 0), 'yyyy-MM-dd\'T\'HH:mm'),
      withdrawalFeeMethod: kickstarter.data?.fixFeeAmount?.toNumber() ? WithdrawalFeeMethod.FIXED_AMOUNT : WithdrawalFeeMethod.PERCENTAGE,
      withdrawalFeeAmount: kickstarter.data?.fixFeeAmount?.toNumber() ? kickstarter.data?.fixFeeAmount?.toString() : (kickstarter.data?.percentageFeeAmount?.times(100).div(10000).toString() || ""),
      contactMethod: getKickstarterContactMethodById(kickstarterContactMethod.data?.contactMethod),
      contactMethodValue: kickstarterContactMethod.data?.contactValue
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (!kickstarterContract || (kickstarter.data?.paymentToken !== NULL_ADDRESS && !tokenContract)) return
      setSubmitting(true)
      try {
        if(!isEdit) {
          await handleApproveProject()
        } else {
          await handleEditAndApproveProject()
        }
        handleKickstarterId("")
      } catch (e: any) {
        console.error("Failed to Approve Kickstarter", e.message)
      }
      setSubmitting(false)
    },
  })

  const getPercentageFeeAndFixFeeAmount = async () => {
    let percentageFeeAmount = "0"
    let fixFeeAmount = "0"
    let decimals = 18
    if (formik.values.withdrawalFeeMethod === WithdrawalFeeMethod.PERCENTAGE) {
      percentageFeeAmount = (Number(formik.values.withdrawalFeeAmount || 0) * 100).toString()
    } else if (formik.values.withdrawalFeeMethod === WithdrawalFeeMethod.FIXED_AMOUNT) {
      fixFeeAmount = formik.values.withdrawalFeeAmount?.toString() || "0"
    }
    if (kickstarter.data?.paymentToken !== NULL_ADDRESS) {
      decimals = await tokenContract!.decimals()
    }
    return {
      percentageFeeAmount,
      fixFeeAmount: parseUnits(fixFeeAmount, decimals)
    }
  }

  const handleApproveProject = async () => {
    const withdrawalFee = await getPercentageFeeAndFixFeeAmount()
    const receipt = kickstarterContract!.approve(withdrawalFee.percentageFeeAmount, withdrawalFee.fixFeeAmount)
    await library.waitForTransaction(receipt.hash)
  }

  const handleEditAndApproveProject = async () => {
    let uploadImageResult: UploadImageResult | undefined
    if (formik.values.image) {
      uploadImageResult = await uploadImageApi.mutateAsync(formik.values.image)
    }
    const project = {
      paymentToken: formik.values.paymentToken,
      title: formik.values.title,
      creator: formik.values.creator,
      imageUrl: formik.values.image ? uploadImageResult?.url : formik.values.imageUrl,
      projectDescription: formik.values.projectDescription,
      rewardDescription: formik.values.rewardDescription,
      minContribution: parseUnits(formik.values.minContribution, 18).toString(),
      projectGoals: parseUnits(formik.values.projectGoals, 18).toString(),
      rewardDistributionTimestamp: Math.floor(new Date(formik.values.rewardDistributionTimestamp).getTime() / 1000),
      startTimestamp: getUnixTime(new Date()),
      endTimestamp: getUnixTime(new Date(formik.values.endTimestamp)),
    }

    const withdrawalFee = await getPercentageFeeAndFixFeeAmount()
    const receipt = await kickstarterContract![
      "configProjectInfo((address,string,string,string,string,string,uint256,uint256,uint256,uint256,uint256),uint8,uint256,uint256)"
    ](
      project,
      KickstarterApprovalStatusId.APPROVED,
      withdrawalFee.percentageFeeAmount,
      withdrawalFee.fixFeeAmount
    )
    await kickstarterContactMethodUpdate.mutateAsync({
      kickstarterAddress: kickstarterId,
      contactMethod: `${formik.values.contactMethod}`,
      contactValue: `${formik.values.contactMethodValue}`,
    })
    await library.waitForTransaction(receipt.hash)
  }

  const [showPayment] = useModal(
    <RejectModal kickstarter={kickstarter.data} handleKickstarterId={handleKickstarterId} />
  )

  return (
    <FormikProvider value={formik}>
      <Flex flexDirection="column">
        <Header previousPage={previousPage} handleKickstarterId={handleKickstarterId} />
        <br />
        {kickstarter.data?.approvalStatus === KickstarterApprovalStatus.WAITING_FOR_APPROVAL && (
          <EditButtons
            formik={formik}
            isEdit={isEdit}
            handleIsEdit={setIsEdit}
            isDisabled={kickstarter.isFetching || !kickstarter.data}
          />
        )}
        <br />
        {isEdit ? (
          <EditProjectDetails kickstarter={kickstarter.data} formik={formik} />
        ) : (
          <ProjectDetails
            kickstarter={kickstarter.data}
            isLoading={kickstarter.isFetching}
          />
        )}
        <Divider />
        {isEdit ? (
          <EditFundAndRewardsSystem formik={formik} />
        ) : (
          <FundAndRewardsSystem
            formik={formik}
            kickstarter={kickstarter.data}
            isLoading={kickstarter.isFetching || kickstarterContactMethod.isFetching}
          />
        )}
        <Divider />
        {(isEdit || kickstarter.data?.approvalStatus === KickstarterApprovalStatus.WAITING_FOR_APPROVAL ) ? (
          <EditWithdrawal formik={formik} />
        ) : (
          <Withdrawal
            kickstarter={kickstarter.data}
            isLoading={kickstarter.isFetching}
          />
        )}
      </Flex>
      {!isEdit && kickstarter.data?.approvalStatus === KickstarterApprovalStatus.WAITING_FOR_APPROVAL && (
        <>
          <Divider />
          <Flex style={{ columnGap: "12px" }}>
            <Button variant="awesome" onClick={() => formik.submitForm()} isLoading={formik.isSubmitting}>Approve Project</Button>
            <Button variant="danger" isLoading={formik.isSubmitting} onClick={showPayment}>Reject Project</Button>
          </Flex>
        </>
      )}
    </FormikProvider>
  )
}

export default React.memo(KickstarterDetails)
