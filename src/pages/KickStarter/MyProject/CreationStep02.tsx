import { ETHER } from '@koda-finance/summitswap-sdk'
import { Button, Flex, Skeleton, Text, TextArea } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import AccountIcon from 'components/AccountIcon'
import CopyButton from 'components/CopyButton'
import { FormikProps } from 'formik'
import React, { useMemo } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import styled from 'styled-components'
import { shortenAddress } from 'utils'
import FundingInput from '../FundingInput'
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

const EstimationWrapper = styled(Flex)`
  flex: 1;
  column-gap: 32px;
  row-gap: 16px;
  margin-top: 24px;
  margin-bottom: 32px;

  @media (max-width: 576px) {
    flex-direction: column;
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
  const accountBalance = useCurrencyBalance(account ?? undefined, ETHER)?.toSignificant(6)

  const hasValidInput = useMemo<boolean>(() => {
    return !!(formik.values.rewardDescription && formik.values.rewardDistribution && formik.values.projectDueDate)
  }, [formik.values.rewardDescription, formik.values.rewardDistribution, formik.values.projectDueDate])

  const handleProjectDueDateChange = (value: string) => {
    formik.setFieldValue(ProjectFormField.projectDueDate, value)
  }

  const handleRewardDistributionChange = (value: string) => {
    formik.setFieldValue(ProjectFormField.rewardDistribution, value)
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
      <EstimationWrapper>
        <FundingInput
          label="Project Due Date"
          type="datetime-local"
          value={formik.values.projectDueDate}
          description="NB: Due date should be minimum a week after the project is created"
          onChange={handleProjectDueDateChange}
          isFunding={false}
        />
        <FundingInput
          label="Reward Distribution"
          type="datetime-local"
          value={formik.values.rewardDistribution}
          description="NB: Enter the estimate date for the reward distribution. Reward distribution date should be equal or greater than project due date"
          onChange={handleRewardDistributionChange}
          isFunding={false}
        />
      </EstimationWrapper>
      <ButtonWrapper>
        <Button variant="secondary" onClick={() => setCurrentCreationStep(1)}>
          Previous Step
        </Button>
        <Button variant="primary" onClick={() => setCurrentCreationStep(3)} disabled={!hasValidInput}>
          Create New Project
        </Button>
      </ButtonWrapper>
    </Flex>
  )
}

export default CreationStep02
