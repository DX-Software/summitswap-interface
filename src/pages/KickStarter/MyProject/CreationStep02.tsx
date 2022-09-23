import { ETHER } from '@koda-finance/summitswap-sdk'
import { Button, Flex, Input, Select, Skeleton, Text, TextArea } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import AccountIcon from 'components/AccountIcon'
import CopyButton from 'components/CopyButton'
import { CONTACT_METHODS } from 'constants/kickstarter'
import { FormikProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import styled from 'styled-components'
import { shortenAddress } from 'utils'
import FundingInput from '../shared/FundingInput'
import { Project, ProjectFormField } from '../types'

const AccountWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.inputColor};
  border-radius: 8px;
  padding: 16px;
  column-gap: 16px;
  margin-right: auto;
  width: 320px;

  @media (max-width: 576px) {
    width: 100%;
  }
`

const ButtonWrapper = styled(Flex)`
  justify-content: space-between;
  row-gap: 16px;
  @media (max-width: 576px) {
    flex-direction: column-reverse;
  }
`

type Props = {
  setCurrentCreationStep: React.Dispatch<React.SetStateAction<number>>
  formik: FormikProps<Project>
}

function CreationStep02({ setCurrentCreationStep, formik }: Props) {
  const { account } = useWeb3React()
  const [isStepValid, setIsStepValid] = useState(false)
  const accountBalance = useCurrencyBalance(account ?? undefined, ETHER)?.toSignificant(6)

  useEffect(() => {
    setIsStepValid(
      !!(
        formik.values.rewardDescription &&
        formik.values.rewardDistributionTimestamp &&
        formik.values.endTimestamp &&
        formik.values.contactMethod &&
        formik.values.contactMethodValue
      )
    )
  }, [
    formik.values.rewardDescription,
    formik.values.rewardDistributionTimestamp,
    formik.values.endTimestamp,
    formik.values.contactMethod,
    formik.values.contactMethodValue,
  ])

  const handleProjectDueDateChange = (value: string) => {
    formik.setFieldValue(ProjectFormField.endTimestamp, value)
  }

  const handleRewardDistributionChange = (value: string) => {
    formik.setFieldValue(ProjectFormField.rewardDistributionTimestamp, value)
  }

  const handleContactMethodChange = (value: string) => {
    formik.setFieldValue(ProjectFormField.contactMethod, value)
  }

  return (
    <Flex flexDirection="column">
      {account && (
        <>
          <Text marginBottom="8px">Funding Account</Text>
          <AccountWrapper marginBottom="24px" alignItems="center">
            <AccountIcon account={account} size={32} />
            <Flex flexDirection="column" marginRight="auto">
              <Flex style={{ columnGap: '8px' }} position="relative">
                <Text fontSize="16px">{shortenAddress(account)}</Text>
                <CopyButton
                  color="success"
                  text={account}
                  tooltipMessage="Copied"
                  tooltipTop={-40}
                  tooltipRight={-25}
                  width="16px"
                />
              </Flex>
              {!accountBalance ? (
                <Skeleton width={100} height={28} />
              ) : (
                <Text fontWeight="bold" color="primaryDark">
                  {accountBalance} BNB
                </Text>
              )}
            </Flex>
          </AccountWrapper>
        </>
      )}
      <Text color="textSubtle" marginBottom="4px">
        Project Reward
      </Text>
      <TextArea
        placeholder="Describe the reward for this project"
        name={ProjectFormField.rewardDescription}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      >
        {formik.values.rewardDescription}
      </TextArea>
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
            description="NB: Enter the estimate date for the reward distribution. Reward distribution date should be equal or greater than project due date"
            onChange={handleRewardDistributionChange}
            isFunding={false}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Text fontSize="14px" color="textSubtle" marginBottom="4px">
            Chosen Contact Method
          </Text>
          <Select onValueChanged={handleContactMethodChange} options={CONTACT_METHODS} minWidth="165px" />
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
      <br />

      <ButtonWrapper>
        <Button variant="secondary" onClick={() => setCurrentCreationStep(1)}>
          Previous Step
        </Button>
        <Button variant="primary" onClick={() => setCurrentCreationStep(3)} disabled={!isStepValid}>
          Create New Project
        </Button>
      </ButtonWrapper>
    </Flex>
  )
}

export default CreationStep02
