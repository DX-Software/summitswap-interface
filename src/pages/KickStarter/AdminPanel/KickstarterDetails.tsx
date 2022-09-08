import { ArrowBackIcon, Breadcrumbs, Button, CheckmarkIcon, EditIcon, Flex, Heading, Input, Radio, Select, Text, TextArea } from "@koda-finance/summitswap-uikit"
import { Grid } from "@mui/material"
import { useKickstarterById } from "api/useKickstarterApi"
import { getTokenImageBySymbol } from "connectors"
import { BUSD, NULL_ADDRESS, USDT } from "constants/index"
import { format, fromUnixTime } from "date-fns"
import { Formik, FormikProps, FormikProvider, useFormik } from "formik"
import React, { useCallback, useState } from "react"
import styled from "styled-components"
import { ContactMethod, Kickstarter, KickstarterApprovalStatus, WithdrawalFeeMethod } from "types/kickstarter"
import { getKickstarterContactMethodById } from "utils/kickstarter"
import { CurrencyInfo, Divider, StatusInfo, TextInfo } from "../shared"
import FundingInput from "../shared/FundingInput"
import { Project, ProjectFormField } from "../types"

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
  kickstarter?: Kickstarter
  isLoading?: boolean
}

type EditSectionProps = {
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

const ImgKickstarter = styled.div<{ image: string }>`
  width: 240px;
  height: 230px;
  border-radius: 8px;
  flex-shrink: 0;

  background: ${(props) => `gray url(${props.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;

  @media (max-width: 768px) {
    width: 100%;
    height: 230px;
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
        disabled={isDisabled}>
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
            onClick={() => formik.submitForm()}>
            Change & Approve
          </Button>
          <Button
            variant="tertiary"
            scale="sm"
            style={{fontFamily:'Poppins'}}
            onClick={() => handleIsEdit(false)}
            disabled={isDisabled}>
            Cancel Edit
          </Button>
        </>
      )}
    </Flex>
  )
}

const ProjectDetails = ({ kickstarter, isLoading }: SectionProps) => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Project Details</Heading>
      <ProjectDetailsContainer>
        <ImgKickstarter image="https://picsum.photos/400" />
        <br />
        <Flex flexDirection="column">
          <StatusInfo
            title="Project Status"
            approvalStatus={KickstarterApprovalStatus.WAITING_FOR_APPROVAL}
            isLoading={isLoading}
          />
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

const EditProjectDetails = ({ formik }: EditSectionProps) => {
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
        <ImgKickstarter image="https://picsum.photos/400" />
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
      <Heading size='md' marginBottom="4px" color="default">Choose Project Currency</Heading>
      <Text color="textSubtle" marginBottom="8px">Participant will pay with <b style={{ color: "#2BA55D" }}>BNB</b> for your token</Text>
      <Grid container spacing="16px">
        <Grid item xs={12} sm={4} lg={2} style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
          <Radio
            scale="sm"
            name={ProjectFormField.paymentToken}
            value={NULL_ADDRESS}
            onChange={formik.handleChange}
            checked={formik.values.paymentToken === NULL_ADDRESS}
            style={{ flexShrink: 0 }}
          />
          <Text>BNB</Text>
        </Grid>
        <Grid item xs={12} sm={4} lg={2} style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
          <Radio
            scale="sm"
            name={ProjectFormField.paymentToken}
            value={USDT.address}
            onChange={formik.handleChange}
            checked={formik.values.paymentToken === USDT.address}
            style={{ flexShrink: 0 }}
          />
          <Text>USDT</Text>
        </Grid>
        <Grid item xs={12} sm={4} lg={2} style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
          <Radio
            scale="sm"
            name={ProjectFormField.paymentToken}
            value={BUSD.address}
            onChange={formik.handleChange}
            checked={formik.values.paymentToken === BUSD.address}
            style={{ flexShrink: 0 }}
          />
          <Text>BUSD</Text>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing="16px">
        <Grid item sm={12} md={6}>
          <FundingInput
            label="Project Goals"
            value={formik.values.projectGoals.toString()}
            onChange={handleProjectGoalsChanged}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <FundingInput
            label="Minimum Backing"
            value={formik.values.minContribution.toString()}
            description="NB : This is the minimum amount for participate in donating the project"
            onChange={handleMinimumBackingChanged}
          />
        </Grid>
      </Grid>
    </>
  )
}

const FundAndRewardsSystem = ({ kickstarter, isLoading }: SectionProps) => {
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
            description="Telegram"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo
            title="Telegram ID"
            description="summitswap"
          />
        </Grid>
      </Grid>
    </>
  )
}

const EditFundAndRewardsSystem = ({ formik }: EditSectionProps) => {
  const contactMethods = [
    {
      label: 'Discord',
      value: ContactMethod.DISCORD,
    },
    {
      label: 'Email',
      value: ContactMethod.EMAIL,
    },
    {
      label: 'Telegram',
      value: ContactMethod.TELEGRAM,
    },
    {
      label: 'Twitter',
      value: ContactMethod.TWITTER,
    },
  ]

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
            options={contactMethods}
            minWidth="165px"
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Telegram ID</Text>
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

const Withdrawal = ({ kickstarter, isLoading }: SectionProps) => {
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

const EditWithdrawal = ({ formik }: EditSectionProps) => {
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
  const [isEdit, setIsEdit] = useState(false);

  const kickstarter = useKickstarterById(kickstarterId)

  const formik: FormikProps<Project> = useFormik<Project>({
    enableReinitialize: true,
    initialValues: {
      title: kickstarter.data?.title || "",
      creator: kickstarter.data?.creator || "",
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
      contactMethod: ContactMethod.DISCORD
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log("values", values)
    },
  })

  return (
    <FormikProvider value={formik}>
      <Flex flexDirection="column">
        <Header previousPage={previousPage} handleKickstarterId={handleKickstarterId} />
        <br />
          <EditButtons
            formik={formik}
            isEdit={isEdit}
            handleIsEdit={setIsEdit}
            isDisabled={kickstarter.isFetching || !kickstarter.data}
          />
        <br />
        {isEdit ? (
          <EditProjectDetails formik={formik} />
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
            kickstarter={kickstarter.data}
            isLoading={kickstarter.isFetching}
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
            <Button variant="awesome" onClick={() => formik.submitForm()}>Approve Project</Button>
            <Button variant="danger">Reject Project</Button>
          </Flex>
        </>
      )}
    </FormikProvider>
  )
}

export default React.memo(KickstarterDetails)
