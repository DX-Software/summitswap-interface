import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { formatUnits } from 'ethers/lib/utils'
import {
  AutoRenewIcon,
  CheckmarkCircleIcon,
  Box,
  Button,
  EditIcon,
  Flex,
  Heading,
  InfoIcon,
} from '@koda-finance/summitswap-uikit'
import { useTokenContract, usePresaleContract, useFactoryPresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { MouseoverTooltip } from 'components/Tooltip'
import { fetchPresaleInfo, fetchFeeInfo, fetchProjectDetails } from 'utils/presale'
import { FEE_DECIMALS, RADIO_VALUES, TOKEN_CHOICES } from 'constants/presale'
import { NULL_ADDRESS } from 'constants/index'
import { GridItem2 } from './CreatePresale/GridComponents'
import { PresaleInfo, ProjectDetails, FeeInfo } from './types'
import PresaleStatus from './AdminPanel/PresaleStatus'
import {
  GridContainer,
  ContainerToken,
  ContainerInformation,
  StyledGridItem1,
  StyledImage,
  StyledText,
  SectionHeading,
  ResponsiveFlex,
  TextAddressHeading,
} from './CreatePresale/CreationStep06'

interface Props {
  presaleAddress: string
  onApproveHandler?: (presaleAddress: string) => void
  handleEditButtonHandler?: (isEdit: boolean) => void
}

const Divider = styled.div`
  width: 100%;
  max-width: 950px;
  height: 0px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputColor};
  margin-bottom: 25px;
`

const HeadingPresaleDetails = styled(Heading)`
  font-size: 40px;
  line-height: 44px;
  @media (max-width: 600px) {
    font-size: 32px;
    line-height: 35px;
  }
`

const PresaleSummary = ({ presaleAddress, handleEditButtonHandler, onApproveHandler }: Props) => {
  const { account, library } = useWeb3React()

  const [isLoading, setIsLoading] = useState(false)
  const [accountIsAdminOrOwner, setAccountIsAdminOrOwner] = useState(false)
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>()
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>()
  const [currency, setCurrency] = useState('BNB')

  const presaleToken = useToken(presaleInfo?.presaleToken)
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken !== NULL_ADDRESS ? presaleFeeInfo?.paymentToken : undefined
  )
  const tokenContract = useTokenContract(presaleInfo?.presaleToken, true)
  const presaleContract = usePresaleContract(presaleAddress)
  const factoryContract = useFactoryPresaleContract()

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
    async function checkIsAdminOrOwner() {
      setAccountIsAdminOrOwner(
        (await factoryContract?.isAdmin(account)) || (await factoryContract?.owner()) === account
      )
    }
    if (factoryContract && account) checkIsAdminOrOwner()
  }, [factoryContract, account])

  useEffect(() => {
    async function fetchTotalSupply() {
      setTokenTotalSupply(
        Number(formatUnits(await tokenContract?.totalSupply(), presaleToken?.decimals)).toLocaleString()
      )
    }
    if (presaleToken && tokenContract) {
      fetchTotalSupply()
    }
  }, [tokenContract, presaleToken])

  useEffect(() => {
    if (presaleFeeInfo) {
      const currentCurrency = Object.keys(TOKEN_CHOICES).find(
        (key) => TOKEN_CHOICES[key] === presaleFeeInfo?.paymentToken
      )
      setCurrency(currentCurrency as string)
    }
  }, [presaleFeeInfo])

  const selectRouterText = () => {
    if (`${presaleInfo?.listingChoice}` === `${RADIO_VALUES.LISTING_SS_100}`) {
      return 'SummitSwap'
    }
    if (`${presaleInfo?.listingChoice}` === `${RADIO_VALUES.LISTING_PS_100}`) {
      return 'PancakeSwap'
    }
    return 'Both'
  }

  const selectPairSymbol = () => {
    return Object.keys(TOKEN_CHOICES).find((key) => TOKEN_CHOICES[key] === presaleInfo?.listingToken)
  }

  const approvePresaleHandler = async () => {
    if (!presaleContract || !factoryContract || presaleInfo?.isApproved) {
      return
    }
    try {
      setIsLoading(true)
      const receipt = await factoryContract.approvePresale(presaleAddress)
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)
      setPresaleInfo((preInfo) => preInfo && { ...preInfo, isApproved: true })
      if (onApproveHandler) onApproveHandler(presaleAddress)
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <>
      <PresaleStatus presaleInfo={presaleInfo} presaleAddress={presaleAddress} />
      <ResponsiveFlex justifyContent="space-between">
        <HeadingPresaleDetails marginTop="30px" size="xl">
          Presale Details
        </HeadingPresaleDetails>
      </ResponsiveFlex>
      <SectionHeading marginTop="16px" color="success">
        Token Information
      </SectionHeading>
      <ContainerToken marginTop="16px" marginBottom="45px">
        <StyledImage src={projectDetails?.logoUrl} alt="presale-icon" />
        <StyledGridItem1>
          <ResponsiveFlex marginTop="20px">
            <TextAddressHeading>Token Address</TextAddressHeading>
            <StyledText color="sidebarActiveColor">{presaleToken?.address}</StyledText>
          </ResponsiveFlex>
        </StyledGridItem1>

        <GridItem2>
          <GridContainer>
            <StyledText>Token Name</StyledText>
            <StyledText>{presaleToken?.name}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Symbols</StyledText>
            <StyledText>{presaleToken?.symbol}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Decimals</StyledText>
            <StyledText>{presaleToken?.decimals}</StyledText>
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
      <Divider />
      <SectionHeading marginTop="24px" color="success">
        Presale System
      </SectionHeading>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Box marginTop="16px" marginRight="20px">
          <Box>
            <StyledText bold color="primaryDark">
              Presale Rate & Whitelist
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Presale rate</StyledText>
              <StyledText>{`${formatUnits(presaleInfo?.presaleRate || 0)} ${
                presaleToken?.symbol
              } / 1 ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Whitelist system</StyledText>
              <StyledText>
                {`${presaleInfo?.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_ENABLED}` ? 'Enabled' : 'Disabled'}
              </StyledText>
            </GridContainer>
          </Box>
          <Box marginTop="16px">
            <StyledText bold color="primaryDark">
              Presale Goal
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Softcap</StyledText>
              <StyledText>{`${formatUnits(presaleInfo?.softcap || 0, paymentToken?.decimals)} ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Hardcap</StyledText>
              <StyledText>{`${formatUnits(presaleInfo?.hardcap || 0, paymentToken?.decimals)} ${currency}`}</StyledText>
            </GridContainer>
          </Box>
          <Box marginTop="16px">
            <StyledText bold color="primaryDark">
              Presale Purchasing & Refund
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Minimum Buy</StyledText>
              <StyledText>{`${formatUnits(presaleInfo?.minBuy || 0, paymentToken?.decimals)} ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Maximum Buy</StyledText>
              <StyledText>{`${formatUnits(presaleInfo?.maxBuy || 0, paymentToken?.decimals)} ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Refund System </StyledText>
              <StyledText>{presaleInfo?.refundType === RADIO_VALUES.REFUND_TYPE_REFUND ? 'Refund' : 'Burn'}</StyledText>
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
              <StyledText>{`${presaleToken?.symbol}-${selectPairSymbol()}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Router Liquidity</StyledText>
              <StyledText>{`${presaleInfo?.liquidity.mul(100).div(10 ** FEE_DECIMALS)}%`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Router Listing Rate</StyledText>
              <StyledText>{`${formatUnits(presaleInfo?.listingRate || 0)} ${
                presaleToken?.symbol
              } / 1 ${currency}`}</StyledText>
            </GridContainer>
          </Box>

          <Box marginTop="16px">
            <StyledText bold color="primaryDark">
              Vesting System
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Vesting System</StyledText>
              <StyledText>{presaleInfo?.isVestingEnabled ? 'On' : 'Off'}</StyledText>
            </GridContainer>
            {presaleInfo?.isVestingEnabled && (
              <>
                <GridContainer marginTop="4px">
                  <StyledText>Vesting Percentage</StyledText>
                  <StyledText>{`${presaleInfo?.maxClaimPercentage.mul(100).div(10 ** FEE_DECIMALS)}%`}</StyledText>
                </GridContainer>
                <GridContainer marginTop="4px">
                  <StyledText>Interval Day</StyledText>
                  <StyledText>{`Day ${presaleInfo?.claimIntervalDay}`}</StyledText>
                </GridContainer>
                <GridContainer marginTop="4px">
                  <StyledText>Interval Time (UTC)</StyledText>
                  <StyledText>{`${
                    Number(presaleInfo?.claimIntervalHour) < 10
                      ? `0${presaleInfo?.claimIntervalHour}`
                      : presaleInfo?.claimIntervalHour
                  }:00 UTC`}</StyledText>
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
          <StyledText>{new Date(presaleInfo?.startPresaleTime.mul(1000).toNumber() || 0).toUTCString()}</StyledText>
        </GridContainer>
        <GridContainer marginTop="4px">
          <StyledText>End Time</StyledText>
          <StyledText>{new Date(presaleInfo?.endPresaleTime.mul(1000).toNumber() || 0).toUTCString()}</StyledText>
        </GridContainer>
        <GridContainer marginTop="4px">
          <StyledText>Liquidity Lockup</StyledText>
          <StyledText>{`${presaleInfo?.liquidyLockTimeInMins.div(60)} minutes`}</StyledText>
        </GridContainer>
      </Box>
      <Divider />
      <SectionHeading marginTop="24px" color="success">
        Additional Information
      </SectionHeading>
      <Box marginBottom="25px">
        <Box marginTop="16px">
          <StyledText bold color="primaryDark">
            Contact Information
          </StyledText>
          <ContainerInformation marginTop="4px">
            <StyledText>Project Name</StyledText>
            <StyledText>{projectDetails?.projectName}</StyledText>
          </ContainerInformation>
          {projectDetails?.description && (
            <ContainerInformation marginTop="4px">
              <StyledText>Project Details</StyledText>
              <StyledText>{projectDetails.description}</StyledText>
            </ContainerInformation>
          )}
          <ContainerInformation marginTop="4px">
            <StyledText>Contact Name</StyledText>
            <StyledText>{projectDetails?.contactName}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Contact Position</StyledText>
            <StyledText>{projectDetails?.contactPosition}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Contact Method</StyledText>
            <StyledText>{projectDetails?.contactMethod}</StyledText>
          </ContainerInformation>
        </Box>
        <Box marginTop="16px">
          <StyledText bold color="primaryDark">
            Project Presale Details
          </StyledText>
          <ContainerInformation marginTop="4px">
            <StyledText>Website URL</StyledText>
            <StyledText color="linkColor">{projectDetails?.websiteUrl || '-'}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Telegram ID</StyledText>
            <StyledText>{projectDetails?.telegramId || '-'}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Discord ID</StyledText>
            <StyledText>{projectDetails?.discordId || '-'}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Twitter ID</StyledText>
            <StyledText>{projectDetails?.twitterId || '-'}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>E-mail</StyledText>
            <StyledText>{projectDetails?.email || '-'}</StyledText>
          </ContainerInformation>
        </Box>
      </Box>
      {accountIsAdminOrOwner && (
        <>
          <Divider />
          <SectionHeading marginTop="24px" color="success">
            Fee Information
          </SectionHeading>
          <Box marginTop="16px" marginRight="20px" marginBottom="25px">
            <ContainerInformation marginTop="4px">
              <Flex alignItems="baseline" justifyContent="start">
                <StyledText marginRight="4px">Payment Token Fee</StyledText>
                <MouseoverTooltip
                  size="11px"
                  text={`Payment token fee is how much ${currency} will be given to summitswap as fee when presale is finalised`}
                >
                  <InfoIcon width="13px" color="linkColor" />
                </MouseoverTooltip>
              </Flex>
              <StyledText>{`${presaleFeeInfo?.feePaymentToken.mul(100).div(10 ** FEE_DECIMALS)}%`}</StyledText>
            </ContainerInformation>
            <ContainerInformation marginTop="4px">
              <Flex alignItems="baseline" justifyContent="start">
                <StyledText marginRight="4px">Presale Token Fee</StyledText>
                <MouseoverTooltip
                  size="11px"
                  text={`Presale token fee is how much ${presaleToken?.symbol} will be given to summitswap as fee when presale is finalised`}
                >
                  <InfoIcon width="13px" color="linkColor" />
                </MouseoverTooltip>
              </Flex>
              <StyledText>{`${presaleFeeInfo?.feePresaleToken.mul(100).div(10 ** FEE_DECIMALS)}%`}</StyledText>
            </ContainerInformation>
            <ContainerInformation marginTop="4px">
              <Flex alignItems="baseline" justifyContent="start">
                <StyledText marginRight="4px">Emergency Withdraw Fee</StyledText>
                <MouseoverTooltip
                  size="11px"
                  text={`Emergency Withdraw fee is how much ${currency} will be given to summitswap when the user want to suddenly withdraw all of their funds`}
                >
                  <InfoIcon width="13px" color="linkColor" />
                </MouseoverTooltip>
              </Flex>
              <StyledText>{`${presaleFeeInfo?.emergencyWithdrawFee.mul(100).div(10 ** FEE_DECIMALS)}%`}</StyledText>
            </ContainerInformation>
          </Box>
          {!presaleInfo?.isApproved && (
            <>
              <Divider />
              <Button
                variant="awesome"
                marginTop="16px"
                startIcon={!isLoading && <CheckmarkCircleIcon color="currentColor" />}
                endIcon={isLoading && <AutoRenewIcon spin color="currentColor" />}
                disabled={!presaleToken || !presaleContract || !factoryContract || isLoading || !account}
                type="button"
                marginRight="8px"
                onClick={approvePresaleHandler}
              >
                Approve Presale
              </Button>
            </>
          )}
          {handleEditButtonHandler && (
            <Button
              marginTop="16px"
              startIcon={<EditIcon color="currentColor" />}
              scale="md"
              width="fit-content"
              variant="tertiary"
              onClick={() => handleEditButtonHandler && handleEditButtonHandler(true)}
            >
              Edit Presale
            </Button>
          )}
        </>
      )}
    </>
  )
}

export default PresaleSummary
