import { ETHER } from '@koda-finance/summitswap-sdk'
import { Button, Flex, Heading, Skeleton, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import AccountIcon from 'components/AccountIcon'
import CopyButton from 'components/CopyButton'
import { getTokenImageBySymbol } from 'connectors'
import { format } from 'date-fns'
import { FormikProps } from 'formik'
import React from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import styled from 'styled-components'
import { shortenAddress } from 'utils'
import { getSymbolByAddress } from 'utils/kickstarter'
import { ImgCurrency, TextInfo } from '../shared'
import { Project } from '../types'

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
  max-height: 230px;
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

function CreationStep03({ setCurrentCreationStep, formik }: Props) {
  const { account } = useWeb3React()
  const accountBalance = useCurrencyBalance(account ?? undefined, ETHER)?.toSignificant(6)

  return (
    <Flex flexDirection="column">
      <Heading size="lg" color="menuItemActiveBackground" marginBottom="24px">
        Project Details
      </Heading>
      <ImageAndDescriptionWrapper marginBottom="16px">
        {formik.values.image && (
          <ImageWrapper>
            <img src={URL.createObjectURL(formik.values.image)} alt="Kickstarter" style={{ width: '100%' }} />
          </ImageWrapper>
        )}
        <Flex flexDirection="column" flex={1}>
          <Text color="textSubtle" marginBottom="4px">
            Project Title
          </Text>
          <Text>{formik.values.title}</Text>
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Creator
          </Text>
          <Text>{formik.values.creator}</Text>
          <br />
          <Text color="textSubtle" marginBottom="4px">
            Project Description
          </Text>
          <Text style={{ whiteSpace: 'break-spaces' }}>{formik.values.projectDescription}</Text>
          <br />
          <CriteriaWrapper>
            <Flex flexDirection="column" marginRight="auto">
              <Text color="textSubtle" marginBottom="4px">
                Project Goals
              </Text>
              <Flex style={{ columnGap: '8px' }}>
                <ImgCurrency image={getTokenImageBySymbol(getSymbolByAddress(formik.values.paymentToken))} />
                <Text>{formik.values.projectGoals}</Text>
              </Flex>
            </Flex>
            <Flex flexDirection="column" marginRight="auto">
              <Text color="textSubtle" marginBottom="4px">
                Minimum Backing
              </Text>
              <Flex style={{ columnGap: '8px' }}>
                <ImgCurrency image={getTokenImageBySymbol(getSymbolByAddress(formik.values.paymentToken))} />
                <Text>{formik.values.minContribution}</Text>
              </Flex>
            </Flex>
          </CriteriaWrapper>
        </Flex>
      </ImageAndDescriptionWrapper>
      <Heading size="lg" color="menuItemActiveBackground" marginY="16px">
        Fund &amp; Reward System
      </Heading>
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
          Reward Description
        </Text>
        <Text marginBottom="24px" style={{ whiteSpace: 'break-spaces' }}>{formik.values.rewardDescription}</Text>
        <Grid container spacing="16px">
          <Grid item xs={12} sm={6}>
            <TextInfo
              title="Project Due Date"
              description={format(new Date(formik.values.endTimestamp), 'LLLL do, yyyy HH:mm')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInfo
              title="Reward Distribution"
              description={format(new Date(formik.values.rewardDistributionTimestamp), 'LLLL do, yyyy HH:mm')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInfo title="Contact Method" description={formik.values.contactMethod} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInfo title={formik.values.contactMethod || ''} description={formik.values.contactMethodValue} />
          </Grid>
        </Grid>
        <br />
        <br />
        <ButtonWrapper>
          <Button variant="secondary" onClick={() => setCurrentCreationStep(1)}>
            Re-edit Project
          </Button>
          <Button variant="primary" onClick={formik.submitForm} isLoading={formik.isSubmitting}>
            Create New Project
          </Button>
        </ButtonWrapper>
      </Flex>
    </Flex>
  )
}
export default React.memo(CreationStep03)
