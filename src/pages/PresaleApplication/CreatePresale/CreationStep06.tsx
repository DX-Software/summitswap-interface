import React, { useCallback, useEffect, useState } from 'react'
import { Token } from '@koda-finance/summitswap-sdk'
import { Box, Button, Flex, Heading, Text } from '@koda-finance/summitswap-uikit'
import { formatUnits } from 'ethers/lib/utils'
import { FormikProps } from 'formik'
import styled from 'styled-components'
import { useTokenContract } from 'hooks/useContract'
import { RADIO_VALUES, TOKEN_CHOICES } from 'constants/presale'
import ButtonsWrapper from './ButtonsWrapper'
import { GridContainer as Grid, GridItem1, GridItem2 } from './GridComponents'
import { PresaleDetails, ProjectDetails } from '../types'

interface Props {
  currency: string
  selectedToken: Token | undefined
  formikPresale: FormikProps<PresaleDetails>
  formikProject: FormikProps<ProjectDetails>
  changeStepNumber: (num: number) => void
}

const GridContainer = styled(Grid)`
  grid-template-columns: 160px auto;
  @media (max-width: 600px) {
    grid-template-columns: 130px auto;
    grid-template-areas: 'icon title' 'input input';
    grid-column-gap: 12px;
  }
`

const ContainerToken = styled(GridContainer)`
  @media (max-width: 600px) {
    grid-template-columns: 60px auto;
    grid-column-gap: 12px;
  }
`

const ContainerInformation = styled(GridContainer)`
  grid-template-columns: 170px auto;
  @media (max-width: 600px) {
    grid-template-columns: 150px auto;
  }
  @media (max-width: 370px) {
    grid-template-columns: 110px auto;
  }
`

const StyledGridItem1 = styled(GridItem1)`
  align-self: end;
  @media (max-width: 600px) {
    align-self: start;
  }
`

const StyledImage = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 8px;
  grid-area: icon;
  align-self: center;
  @media (max-width: 600px) {
    max-height: 60px;
    max-width: 60px;
  }
`

export const Divider = styled.div`
  width: 90%;
  max-width: 950px;
  height: 0px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.backgroundDisabled};
  margin-bottom: 25px;
`
const StyledText = styled(Text)`
  word-wrap: break-word;
  text-align: left;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`

const TextAddress = styled(StyledText)`
  max-width: 100%;
  @media (max-width: 1080px) {
    max-width: calc(100vw * 0.3);
  }
  @media (max-width: 967px) {
    max-width: calc(100vw * 0.4);
  }
  @media (max-width: 700px) {
    max-width: calc(100vw * 0.3);
  }
  @media (max-width: 600px) {
    max-width: calc(100vw * 0.47);
  }
`

const TextAddressHeading = styled(StyledText)`
  width: 184px;
  @media (max-width: 600px) {
    width: 130px;
  }
`

const AddressBox = styled(Flex)`
  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const CreationStep06 = ({ selectedToken, formikPresale, formikProject, currency, changeStepNumber }: Props) => {
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>()

  const tokenContract = useTokenContract(selectedToken?.address, true)

  useEffect(() => {
    async function fetchTotalSupply() {
      setTokenTotalSupply(
        Number(formatUnits(await tokenContract?.totalSupply(), selectedToken?.decimals)).toLocaleString()
      )
    }
    if (selectedToken && tokenContract) {
      fetchTotalSupply()
    }
  }, [tokenContract, selectedToken])

  const selectRouterText = () => {
    if (`${formikPresale.values.listingChoice}` === `${RADIO_VALUES.LISTING_SS_100}`) {
      return 'SummitSwap'
    }
    if (`${formikPresale.values.listingChoice}` === `${RADIO_VALUES.LISTING_PS_100}`) {
      return 'PancakeSwap'
    }
    return 'Both'
  }

  const selectPairSymbol = () => {
    return Object.keys(TOKEN_CHOICES).find((key) => TOKEN_CHOICES[key] === formikPresale.values.listingToken)
  }

  const getUtcDate = useCallback((date: string, time: string) => {
    const date2 = new Date(date)
    const [hours, mins] = time.split(':')
    return new Date(Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), Number(hours), Number(mins)))
  }, [])

  return (
    <>
      <Heading size="lg" color="success">
        Token Information
      </Heading>
      <ContainerToken marginTop="16px" marginBottom="45px">
        <StyledImage src={formikProject.values.logoUrl} alt="presale-icon" />
        <StyledGridItem1>
          <AddressBox marginTop="20px">
            <TextAddressHeading>Token Address</TextAddressHeading>
            <TextAddress color="sidebarActiveColor">{selectedToken?.address}</TextAddress>
          </AddressBox>
        </StyledGridItem1>

        <GridItem2>
          <GridContainer>
            <StyledText>Token Name</StyledText>
            <StyledText>{selectedToken?.name}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Symbols</StyledText>
            <StyledText>{selectedToken?.symbol}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Decimals</StyledText>
            <StyledText>{selectedToken?.decimals}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Token Supply</StyledText>
            <StyledText>{tokenTotalSupply}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText bold>Presale Currency</StyledText>
            <StyledText bold>{currency}</StyledText>
          </GridContainer>
        </GridItem2>
      </ContainerToken>
      <Divider style={{ width: '100%' }} />
      <Heading marginTop="24px" size="lg" color="success">
        Presale System
      </Heading>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Box marginTop="16px" marginRight="20px">
          <Box>
            <StyledText bold color="primaryDark">
              Presale Rate & Whitelist
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Presale rate</StyledText>
              <StyledText>{`${formikPresale.values.presaleRate} ${selectedToken?.symbol} / 1 ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Whitelist system</StyledText>
              <StyledText>
                {`${formikPresale.values.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_ENABLED}`
                  ? 'Enabled'
                  : 'Disabled'}
              </StyledText>
            </GridContainer>
          </Box>
          <Box marginTop="16px">
            <StyledText bold color="primaryDark">
              Presale Goal
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Softcap</StyledText>
              <StyledText>{`${formikPresale.values.softcap} ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Hardcap</StyledText>
              <StyledText>{`${formikPresale.values.hardcap} ${currency}`}</StyledText>
            </GridContainer>
          </Box>
          <Box marginTop="16px">
            <StyledText bold color="primaryDark">
              Presale Purchasing & Refund
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Minimum Buy</StyledText>
              <StyledText>{`${formikPresale.values.minBuy} ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Maximum Buy</StyledText>
              <StyledText>{`${formikPresale.values.maxBuy} ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Refund System </StyledText>
              <StyledText>
                {`${formikPresale.values.refundType}` === `${RADIO_VALUES.REFUND_TYPE_REFUND}` ? 'Refund' : 'Burn'}
              </StyledText>
            </GridContainer>
          </Box>
        </Box>

        <Box marginTop="16px" marginRight="10px">
          <Box>
            <StyledText bold color="primaryDark">
              Liquidity & Listing
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Router</StyledText>
              <StyledText>{selectRouterText()}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Token Pairing</StyledText>
              <StyledText>{`${selectedToken?.symbol}-${selectPairSymbol()}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Router Liquidity</StyledText>
              <StyledText>{`${formikPresale.values.liquidity}%`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Router Listing Rate</StyledText>
              <StyledText>{`${formikPresale.values.listingRate} ${selectedToken?.symbol} / 1 ${currency}`}</StyledText>
            </GridContainer>
          </Box>

          <Box marginTop="16px">
            <StyledText bold color="primaryDark">
              Vesting System
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Vesting System</StyledText>
              <StyledText>
                {`${formikPresale.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}` ? 'On' : 'Off'}
              </StyledText>
            </GridContainer>
            {`${formikPresale.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}` && (
              <>
                <GridContainer marginTop="4px">
                  <StyledText>Vesting Percentage</StyledText>
                  <StyledText>{`${formikPresale.values.maxClaimPercentage}%`}</StyledText>
                </GridContainer>
                <GridContainer marginTop="4px">
                  <StyledText>Interval Day</StyledText>
                  <StyledText>{`Day ${formikPresale.values.claimIntervalDay}`}</StyledText>
                </GridContainer>
                <GridContainer marginTop="4px">
                  <StyledText>Interval Time (UTC)</StyledText>
                  <StyledText>{`${formikPresale.values.claimIntervalHour} UTC`}</StyledText>
                </GridContainer>
              </>
            )}
          </Box>
        </Box>
      </Flex>
      <Box marginTop="16px" marginBottom="25px">
        <StyledText bold color="primaryDark">
          Presale Start & End
        </StyledText>
        <GridContainer marginTop="4px">
          <StyledText>Start Time</StyledText>
          <StyledText>
            {getUtcDate(
              formikPresale.values.startPresaleDate || '',
              formikPresale.values.startPresaleTime || ''
            ).toUTCString()}
            {formikPresale.errors.startPresaleTime && (
              <StyledText color="failure" style={{ display: 'inline' }}>
                &nbsp;({formikPresale.errors.startPresaleTime})
              </StyledText>
            )}
          </StyledText>
        </GridContainer>
        <GridContainer marginTop="4px">
          <StyledText>End Time</StyledText>
          <StyledText>
            {getUtcDate(
              formikPresale.values.endPresaleDate || '',
              formikPresale.values.endPresaleTime || ''
            ).toUTCString()}
          </StyledText>
        </GridContainer>
        <GridContainer marginTop="4px">
          <StyledText>Liquidity Lockup</StyledText>
          <StyledText>{`${formikPresale.values.liquidyLockTimeInMins} minutes`}</StyledText>
        </GridContainer>
      </Box>
      <Divider style={{ width: '100%' }} />
      <Heading marginTop="24px" size="lg" color="success">
        Additional Information
      </Heading>
      <Box>
        <Box marginTop="16px">
          <StyledText bold color="primaryDark">
            Contact Information
          </StyledText>
          <ContainerInformation marginTop="4px">
            <StyledText>Project Name</StyledText>
            <StyledText>{formikProject.values.projectName}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Contact Name</StyledText>
            <StyledText>{formikProject.values.contactName}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Contact Position</StyledText>
            <StyledText>{formikProject.values.contactPosition}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Contact Method</StyledText>
            <StyledText>Telegram</StyledText>
          </ContainerInformation>
        </Box>
        <Box marginTop="16px">
          <StyledText bold color="primaryDark">
            Project Presale Details
          </StyledText>
          <ContainerInformation marginTop="4px">
            <StyledText>Telegram ID</StyledText>
            <StyledText>{formikProject.values.telegramId || '-'}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Discord ID (optional)</StyledText>
            <StyledText>{formikProject.values.discordId || '-'}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Twitter ID (optional)</StyledText>
            <StyledText>{formikProject.values.twitterId || '-'}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>E-mail (optional)</StyledText>
            <StyledText>{formikProject.values.email || '-'}</StyledText>
          </ContainerInformation>
        </Box>
      </Box>
      <ButtonsWrapper>
        <Button variant="secondary" onClick={() => changeStepNumber(1)}>
          Previous Step
        </Button>
        {/* {formik.errors.tokenAmount ? (
          <Text bold marginY="20px" color="failure">
            {formik.errors.tokenAmount}
          </Text>
        ) : (
          <Text bold marginY="20px" color="success">
            {formik.values.tokenAmount ? `${formik.values.tokenAmount.toFixed(2)} Presale Tokens` : ''}
          </Text>
        )} */}
        <Button onClick={() => changeStepNumber(3)}>Continue</Button>
      </ButtonsWrapper>
    </>
  )
}

export default CreationStep06
