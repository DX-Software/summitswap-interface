import { ArrowBackIcon, Breadcrumbs, Button, CheckmarkIcon, EditIcon, Flex, Heading, Input, Radio, Select, Skeleton, Text, TextArea } from "@koda-finance/summitswap-uikit"
import { Grid } from "@mui/material"
import { INITIAL_PROJECT_CREATION } from "constants/kickstarter"
import { FormikProps, useFormik } from "formik"
import React, { useCallback, useState } from "react"
import styled from "styled-components"
import { ContactMethod, KickstarterApprovalStatus } from "types/kickstarter"
import FundingInput from "../FundingInput"
import { CurrencyInfo, Divider, StatusInfo, TextInfo } from "../shared"
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
  isEdit: boolean
  handleIsEdit: (isEdit: boolean) => void
}

type EditWithdrawalProps = {
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

enum WithdrawalFeeMethod {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount"
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

const EditButtons = ({isEdit, handleIsEdit}: EditButtonsProps) => {
  return (
    <Flex style={{ columnGap: "8px" }}>
      {!isEdit && (
        <Button
        variant="tertiary"
        scale="sm"
        startIcon={<EditIcon />}
        style={{fontFamily:'Poppins'}}
        onClick={() => handleIsEdit(true)}>
        Edit Project
      </Button>
      )}
      {isEdit && (
        <>
          <Button
            scale="sm"
            startIcon={<CheckmarkIcon color="default" />}
            style={{fontFamily:'Poppins'}}>
            Change & Approve
          </Button>
          <Button
            variant="tertiary"
            scale="sm"
            style={{fontFamily:'Poppins'}}
            onClick={() => handleIsEdit(false)}>
            Cancel Edit
          </Button>
        </>
      )}
    </Flex>
  )
}

const ProjectDetails = () => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Project Details</Heading>
      <ProjectDetailsContainer>
        <ImgKickstarter image="https://picsum.photos/400" />
        <br />
        <Flex flexDirection="column">
          <StatusInfo title="Project Status" approvalStatus={KickstarterApprovalStatus.WAITING_FOR_APPROVAL} />
          <Divider />
          <TextInfo title="Project Title" description="Summit Swap #1 Project" />
          <br />
          <TextInfo title="Project Creator" description="SUMMITSWAP" />
          <br />
          <TextInfo title="Project Description" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non nibh a, commodo aliquam nullam pharetra viverra. Etiam odio aliquam quis lacus, justo, aliquam molestie suspendisse tempus." />
          <br />
          <Grid container spacing="16px">
            <Grid item xs={12} sm={6} lg={4}>
              <CurrencyInfo title="Project Currency" description="BNB" iconUrl="/images/coins/bnb.png" />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <CurrencyInfo title="Project Goals" description="101" iconUrl="/images/coins/bnb.png" />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <CurrencyInfo title="Minimum Backing" description="10" iconUrl="/images/coins/bnb.png" />
            </Grid>
          </Grid>
        </Flex>
      </ProjectDetailsContainer>
    </>
  )
}

const EditProjectDetails = () => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Project Details</Heading>
      <ProjectDetailsContainer>
        <ImgKickstarter image="https://picsum.photos/400" />
        <br />
        <Flex flexDirection="column" style={{ width: "100%" }}>
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Project Title</Text>
          <Input />
          <br />
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Project Creator</Text>
          <Input />
          <br />
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Project Description</Text>
          <TextArea />
          <br />
        </Flex>
      </ProjectDetailsContainer>
      <Heading size='md' marginBottom="4px" color="default">Choose Project Currency</Heading>
      <Text color="textSubtle" marginBottom="8px">Participant will pay with <b style={{ color: "#2BA55D" }}>BNB</b> for your token</Text>
      <Grid container spacing="16px">
        <Grid item xs={12} sm={4} lg={2} style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
          <Radio
            scale="sm"
            name={ProjectFormField.currency}
            style={{ flexShrink: 0 }}
          />
          <Text>BNB</Text>
        </Grid>
        <Grid item xs={12} sm={4} lg={2} style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
          <Radio
            scale="sm"
            name={ProjectFormField.currency}
            style={{ flexShrink: 0 }}
          />
          <Text>USDT</Text>
        </Grid>
        <Grid item xs={12} sm={4} lg={2} style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
          <Radio
            scale="sm"
            name={ProjectFormField.currency}
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
            value="0"
            description="Minimum Backing"
            onChange={(value) => console.log(value)}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <FundingInput
            label="Enter Amount"
            value="0"
            description="NB : This is the minimum amount for participate in donating the project"
            onChange={(value) => console.log(value)}
          />
        </Grid>
      </Grid>
    </>
  )
}

const FundAndRewardsSystem = () => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Fund & Reward System</Heading>
      <TextInfo
        title="Creator Wallet Address"
        description="0x653222feCf0C7a936C121832561f9DD8774eE496"
      />
      <br />
      <TextInfo
        title="Reward Description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non nibh a, commodo aliquam nullam pharetra viverra. Etiam odio aliquam quis lacus, justo, aliquam molestie suspendisse tempus."
      />
      <br />
      <Grid container spacing="16px">
        <Grid item xs={12} sm={6}>
          <TextInfo
            title="Project Due Date"
            description="Tuesday, July 26th 2022"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo
            title="Reward Distribution"
            description="Tuesday, July 26th 2022"
            tooltipText="This is only an estimated date. It might be possible for the reward to be distributed earlier or later from scheduled."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo title="Contact Method" description="Telegram" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInfo title="Telegram ID" description="summitswap" />
        </Grid>
      </Grid>
    </>
  )
}

const EditFundAndRewardsSystem = () => {
  const contactMethods = [
    {
      label: 'Discrod',
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
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Fund & Reward System</Heading>
      <TextInfo
        title="Creator Wallet Address"
        description="0x653222feCf0C7a936C121832561f9DD8774eE496"
      />
      <br />
      <Text fontSize="14px" color="textSubtle" marginBottom="4px">Reward Description</Text>
      <TextArea />
      <br />
      <Grid container spacing="16px">
        <Grid item sm={12} md={6}>
          <FundingInput
            label="Project Due Date"
            type="datetime-local"
            value=""
            description="NB: Due date should be minimum a week after the project is created"
            onChange={() => console.log("value")}
            isFunding={false}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <FundingInput
            label="Reward Distribution"
            type="datetime-local"
            value=""
            description="NB: Enter the estimate date for the reward distribution"
            onChange={() => console.log("value")}
            isFunding={false}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Chosen Contact Method</Text>
          <Select
            onValueChanged={(value) => console.log(value)}
            options={contactMethods}
            minWidth="165px"
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">Telegram ID</Text>
          <Input />
        </Grid>
      </Grid>
    </>
  )
}

const Withdrawal = () => {
  return (
    <>
      <Heading size='lg' marginBottom="16px" color="sidebarActiveColor">Withdrawal Fee Amount</Heading>
      <Grid container spacing="16px">
        <Grid item xs={12} sm={6} lg={4}>
          <TextInfo
            title="Fee Method"
            description="Percentage"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <TextInfo
            title="Fee Percentage"
            description="5%"
          />
        </Grid>
      </Grid>
    </>
  )
}

const EditWithdrawal = ({ formik }: EditWithdrawalProps) => {
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
      <Input placeholder="0" style={{ margin: "4px 0" }} disabled={!isSelected} />
      <Text fontSize="14px" color="textDisabled">{description}</Text>
    </>
  )
}

function KickstarterDetails({ previousPage, kickstarterId, handleKickstarterId }: KickstarterDetailsProps) {
  const [isEdit, setIsEdit] = useState(false);

  const formik: FormikProps<Project> = useFormik<Project>({
    enableReinitialize: true,
    initialValues: INITIAL_PROJECT_CREATION,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log("values", values)
    },
  })

  return (
    <Flex flexDirection="column">
      <Header previousPage={previousPage} handleKickstarterId={handleKickstarterId} />
      <br />
        <EditButtons isEdit={isEdit} handleIsEdit={setIsEdit} />
      <br />
      {isEdit ? <EditProjectDetails /> : <ProjectDetails />}
      <Divider />
      {isEdit ? <EditFundAndRewardsSystem /> : <FundAndRewardsSystem />}
      <Divider />
      {isEdit ? <EditWithdrawal formik={formik} /> : <Withdrawal />}
    </Flex>
  )
}

export default KickstarterDetails
