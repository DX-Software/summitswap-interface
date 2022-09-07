import { BinanceIcon, Button, Flex, Heading, Skeleton, Text } from '@koda-finance/summitswap-uikit'
import AccountIcon from 'components/AccountIcon'
import CopyButton from 'components/CopyButton'
import { useKickstarterContext } from 'contexts/kickstarter'
import { format } from 'date-fns'
import React from 'react'
import styled from 'styled-components'
import { shortenAddress } from 'utils'

type Props = {
  handleCreateProject: () => void
}

const ImageAndDescriptionWrapper = styled(Flex)`
  column-gap: 32px;
  row-gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const ImageWrapper = styled(Flex)`
  width: 270px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`

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

const CriteriaWrapper = styled(Flex)`
  row-gap: 16px;
  @media (max-width: 576px) {
    flex-direction: column;
  }
`

const EstimationWrapper = styled(Flex)`
  flex: 1;
  column-gap: 32px;
  row-gap: 16px;
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

function CreationStep03({ handleCreateProject }: Props) {
  const { account, accountBalance, projectCreation, handleCurrentCreationStepChanged } = useKickstarterContext()

  return (
    <Flex flexDirection="column">
      <Heading size="lg" color="menuItemActiveBackground" marginBottom="24px">Project Details</Heading>
      <ImageAndDescriptionWrapper marginBottom="16px">
        {projectCreation.image && (
          <ImageWrapper>
            <img src={URL.createObjectURL(projectCreation.image)} alt="Kickstarter" style={{ width: "100%" }} />
          </ImageWrapper>
        )}
        <Flex flexDirection="column" flex={1}>
          <Text color="textSubtle" marginBottom="4px">
            Project Title
          </Text>
          <Text>{projectCreation.title}</Text>
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Creator
          </Text>
          <Text>{projectCreation.creator}</Text>
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Description
          </Text>
          <Text>{projectCreation.projectDescription}</Text>
          <br />
          <CriteriaWrapper>
            <Flex flexDirection="column" marginRight="auto">
              <Text color="textSubtle" marginBottom="4px">
                Project Goals
              </Text>
              <Flex style={{ columnGap: "8px" }}>
                <BinanceIcon width="20px" />
                <Text>{projectCreation.goals}</Text>
              </Flex>
            </Flex>
            <Flex flexDirection="column" marginRight="auto">
              <Text color="textSubtle" marginBottom="4px">
                Minimum Backing
              </Text>
              <Flex style={{ columnGap: "8px" }}>
                <BinanceIcon width="20px" />
                <Text>{projectCreation.minimumBacking}</Text>
              </Flex>
            </Flex>
          </CriteriaWrapper>
        </Flex>
      </ImageAndDescriptionWrapper>
      <Heading size="lg" color="menuItemActiveBackground" marginY="16px">Fund &amp; Reward System</Heading>
      <Flex flexDirection="column">
        {account && (
          <>
            <Text marginBottom="8px">Funding Account</Text>
            <AccountWrapper marginBottom="24px" alignItems="center">
              <AccountIcon account={account} size={32} />
              <Flex flexDirection="column" marginRight="auto">
                <Flex style={{ columnGap: "8px" }} position="relative">
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
                  <Text fontWeight="bold" color="primaryDark">{accountBalance} BNB</Text>
                )}
              </Flex>
            </AccountWrapper>
          </>
        )}
        <Text color="textSubtle" marginBottom="4px">Reward Description</Text>
        <Text marginBottom="24px">{projectCreation.rewardDescription}</Text>
        <EstimationWrapper>
          <Flex flexDirection="column" marginRight="auto">
            <Text color="textSubtle" marginBottom="4px">
              Project Due Date
            </Text>
            <Text>{format(new Date(projectCreation.projectDueDate), 'LLLL do, yyyy HH:MM')}</Text>
          </Flex>
          <Flex flexDirection="column" marginRight="auto">
            <Text color="textSubtle" marginBottom="4px">
              Reward Distribution
            </Text>
            <Text>{format(new Date(projectCreation.rewardDistribution), 'LLLL do, yyyy HH:MM')}</Text>
          </Flex>
        </EstimationWrapper>
        <ButtonWrapper>
          <Button variant="secondary" onClick={() => handleCurrentCreationStepChanged(1)}>
            Re-edit Project
          </Button>
          <Button variant="primary" onClick={handleCreateProject}>
            Create New Project
          </Button>
        </ButtonWrapper>
      </Flex>
    </Flex>
  )
}

export default CreationStep03
