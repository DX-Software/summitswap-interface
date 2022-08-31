import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import {
  TelegramIcon,
  AutoRenewIcon,
  TwitterIcon,
  DiscordIcon,
  EmailIcon,
  Box,
  Button,
  Flex,
  useModal,
  WebIcon,
  darkColors,
} from '@koda-finance/summitswap-uikit'
import { usePresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import CopyButton from 'components/CopyButton'
import { RowFixed } from 'components/Row'
import { fetchPresaleInfo, fetchFeeInfo, fetchProjectDetails, checkSalePhase } from 'utils/presale'
import { TOKEN_CHOICES } from 'constants/presale'
import { NULL_ADDRESS } from 'constants/index'
import { PresaleInfo, ProjectDetails, FeeInfo, PresalePhases, LoadingButtonTypes, LoadingForButton } from '../types'
import { StyledText, Divider } from './Shared'
import PresaleTags from '../PresaleTags'
import TokenDetails from './TokenDetails'
import PresaleDetails from './PresaleDetails'
import GoalSystem from './GoalSystem'
import RouterDetails from './RouterDetails'
import BuyTokens from './BuyTokens'
import PresaleCancelled from './PresaleCancelled'
import ClaimTokens from './ClaimTokens'
import TimeDetails from './TimeDetails'
import Status from './Status'
import FinalizePresaleModal from './FinalizePresaleModal'
import WhitelistSection from './WhitelistSection'
import ContributorsSection from './ContributorsSection'
import PresaleCancelModal from './PresaleCancelModal'

interface Props {
  presaleAddress: string
}

const GridContainer = styled(Box)`
  display: grid;
  grid-column-gap: 16px;
  grid-template-columns: 80px auto;
  grid-template-areas: 'icon tag' 'icon info';
  justify-content: start;
  align-items: start;
  @media (max-width: 500px) {
    grid-template-columns: auto;
    grid-template-areas: 'tag' 'icon' 'info';
    grid-column-gap: 0;
  }
`
const StyledImage = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 50%;
  grid-area: icon;
  @media (max-width: 500px) {
    height: 60px;
    width: 60px;
  }
`

const TagWrapper = styled(Box)`
  grid-area: tag;
`

const InfoWrapper = styled(Box)`
  grid-area: info;
`

const Link = styled.a`
  background: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 90px;
  margin-right: 8px;
`
const CancelButton = styled(Button)`
  border: ${({ theme }) => `2px solid ${theme.colors.failure}`};
  background: none;
  color: ${({ theme }) => `${theme.colors.failure}`};
`

const ResponsiveBox1 = styled(Box)`
  max-width: 570px;
  width: 570px;
  @media (max-width: 1186px) {
    width: 55%;
  }
  @media (max-width: 750px) {
    max-width: 100%;
    width: 100%;
  }
`

const ResponsiveBox2 = styled(Box)`
  max-width: 330px;
  width: 330px;
  @media (max-width: 1186px) {
    width: 40%;
  }
  @media (max-width: 750px) {
    margin-top: 24px;
    width: 100%;
    max-width: 100%;
  }
`

const Presale = ({ presaleAddress }: Props) => {
  const { account } = useWeb3React()

  const [isViewWhitelist, setIsViewWhitelist] = useState(false)
  const [isViewContributors, setIsViewContributors] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accountIsOwner, setAccountIsOwner] = useState(false)
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>()
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>([])
  const [contributors, setContributors] = useState<string[]>([])
  const [isAccountWhitelisted, setIsAccountWhitelisted] = useState(false)
  const [currency, setCurrency] = useState('BNB')
  const [presalePhase, setPresalePhase] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [canPresaleBeFinalized, setCanPresaleBeFinalized] = useState(false)

  const [isLoadingButton, setIsLoadingButton] = useState<LoadingForButton>({
    type: LoadingButtonTypes.NotSelected,
    error: '',
    isClicked: false,
  })

  const presaleToken = useToken(presaleInfo?.presaleToken)
  const presaleContract = usePresaleContract(presaleAddress)
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken !== NULL_ADDRESS ? presaleFeeInfo?.paymentToken : undefined
  )

  useEffect(() => {
    if (presaleInfo) {
      const presalePhase_ = checkSalePhase(presaleInfo)
      const timer = setTimeout(() => {
        if (presalePhase_ !== presalePhase) setPresalePhase(presalePhase_)
        if (presalePhase === PresalePhases.PresalePhase || presalePhase === PresalePhases.PresaleNotStarted) {
          setCurrentTime(new Date())
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [presaleInfo, currentTime, presalePhase])

  useEffect(() => {
    if (isLoadingButton?.error !== '') {
      setTimeout(() => {
        setIsLoadingButton((prevState) => ({ ...prevState, error: '' }))
      }, 3000)
    }
  }, [isLoadingButton])

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
    if (account && presaleInfo) {
      setAccountIsOwner(presaleInfo.owner === account)
    }
  }, [account, presaleInfo])

  useEffect(() => {
    const currentCurrency = Object.keys(TOKEN_CHOICES).find(
      (key) => TOKEN_CHOICES[key] === presaleFeeInfo?.paymentToken
    )
    setCurrency(currentCurrency as string)
  }, [presaleFeeInfo])

  useEffect(() => {
    async function fetchAddresses() {
      setWhitelistAddresses(await presaleContract?.getWhitelist())
      setContributors(await presaleContract?.getContributors())
    }
    if (presaleContract) fetchAddresses()
  }, [presaleContract, presaleInfo])

  useEffect(() => {
    if (whitelistAddresses && account) {
      setIsAccountWhitelisted(whitelistAddresses.includes(account))
    }
  }, [whitelistAddresses, account])

  const selectSection = () => {
    switch (presalePhase) {
      case PresalePhases.PresaleNotStarted:
      case PresalePhases.PresalePhase:
      case PresalePhases.PresaleEnded:
        return presaleInfo?.hardcap.eq(presaleInfo?.totalBought) ? (
          <ClaimTokens isMainLoading={isLoading} setIsMainLoading={setIsLoading} presaleAddress={presaleAddress} />
        ) : (
          presalePhase !== PresalePhases.PresaleEnded && (
            <BuyTokens
              isAccountWhitelisted={isAccountWhitelisted}
              isMainLoading={isLoading}
              setIsMainLoading={setIsLoading}
              presaleAddress={presaleAddress}
              presaleInfo={presaleInfo}
              setPresaleInfo={setPresaleInfo}
            />
          )
        )
      case PresalePhases.PresaleCancelled:
        return (
          <PresaleCancelled isMainLoading={isLoading} setIsMainLoading={setIsLoading} presaleAddress={presaleAddress} />
        )
      case PresalePhases.ClaimPhase:
        return <ClaimTokens isMainLoading={isLoading} setIsMainLoading={setIsLoading} presaleAddress={presaleAddress} />
      default:
        return <></>
    }
  }

  useEffect(() => {
    if (presaleInfo && account && !canPresaleBeFinalized) {
      if (
        !presaleInfo.isPresaleCancelled &&
        (presaleInfo.hardcap.eq(presaleInfo.totalBought) ||
          (presaleInfo.totalBought.gte(presaleInfo.softcap) && presaleInfo.endPresaleTime.mul(1000).lt(Date.now())))
      ) {
        setCanPresaleBeFinalized(true)
      }
    }
  }, [presaleInfo, account, canPresaleBeFinalized])

  const presaleFinalizeHandler = async () => {
    if (!presaleContract || presaleInfo?.owner !== account || !canPresaleBeFinalized) {
      return
    }
    try {
      setIsLoading(true)
      setIsLoadingButton({
        type: LoadingButtonTypes.Finalize,
        isClicked: true,
        error: '',
      })

      const result = await presaleContract.finalize()
      closeFinsaliseModal()
      await result.wait()

      setPresaleInfo((prevState) =>
        prevState
          ? {
              ...prevState,
              isClaimPhase: true,
            }
          : prevState
      )
      setIsLoading(false)
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        isClicked: false,
        error: '',
      })
    } catch (err) {
      closeFinsaliseModal()
      setIsLoading(false)
      setIsLoadingButton({
        type: LoadingButtonTypes.Finalize,
        isClicked: false,
        error: 'Finalizing Presale Failed.',
      })
      console.error(err)
    }
  }

  const presaleCancelHandler = async () => {
    if (!presaleContract || presaleInfo?.owner !== account) {
      return
    }
    try {
      setIsLoading(true)
      setIsLoadingButton({
        isClicked: true,
        type: LoadingButtonTypes.CancelPool,
        error: '',
      })
      const result = await presaleContract.cancelPresale()
      closeCancelModalHandler()
      await result.wait()

      setPresaleInfo((prevState) =>
        prevState ? { ...prevState, isPresaleCancelled: true, isClaimPhase: false } : prevState
      )
      setIsLoadingButton({
        isClicked: false,
        type: LoadingButtonTypes.NotSelected,
        error: '',
      })
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      closeCancelModalHandler()
      setIsLoadingButton({
        isClicked: false,
        type: LoadingButtonTypes.CancelPool,
        error: 'Cancelling Failed.',
      })
      console.error(err)
    }
  }
  const withdrawCancelledTokenHandler = async () => {
    if (presaleInfo?.owner !== account || !presaleContract) {
      return
    }
    try {
      setIsLoading(true)
      setIsLoadingButton({
        isClicked: true,
        type: LoadingButtonTypes.WithdrawCancelledTokens,
        error: '',
      })
      const result = await presaleContract.withdrawCancelledTokens()
      await result.wait()
      setPresaleInfo((prevState) => (prevState ? { ...prevState, isWithdrawCancelledTokens: true } : prevState))
      setIsLoadingButton({
        isClicked: false,
        type: LoadingButtonTypes.NotSelected,
        error: '',
      })
      setIsLoading(true)
    } catch (err) {
      setIsLoadingButton({
        isClicked: false,
        type: LoadingButtonTypes.WithdrawCancelledTokens,
        error: 'Withdrawal Failed.',
      })
      setIsLoading(false)
      console.error(err)
    }
  }

  const closeCancelModalHandler = () => closeCancelModal()
  const [openCancelModal, closeCancelModal] = useModal(
    <PresaleCancelModal presaleCancelHandler={presaleCancelHandler} onDismiss={closeCancelModalHandler} />
  )

  const closeFinsaliseModalHandler = () => closeFinsaliseModal()
  const [openFinalizeModal, closeFinsaliseModal] = useModal(
    <FinalizePresaleModal
      onDismiss={closeFinsaliseModalHandler}
      presaleFinalizeHandler={presaleFinalizeHandler}
      presaleInfo={presaleInfo}
      currency={currency}
      projectName={projectDetails?.projectName || ''}
      presaleToken={presaleToken}
      presaleAddress={presaleAddress}
      presaleFeeInfo={presaleFeeInfo}
    />
  )

  return (
    <Flex flexWrap="wrap" justifyContent="space-between">
      <ResponsiveBox1>
        <GridContainer>
          <StyledImage src={projectDetails?.logoUrl || ''} />
          <TagWrapper>
            <PresaleTags isAccountWhitelisted={isAccountWhitelisted} presaleInfo={presaleInfo} />
          </TagWrapper>
          <InfoWrapper>
            <StyledText marginTop="8px" fontSize="14px" color="textSubtle">
              {presaleToken?.name}
            </StyledText>
            <StyledText lineHeight={1} bold fontSize="24px">
              {projectDetails?.projectName}
            </StyledText>
            <Flex marginTop="4px" alignItems="center" marginBottom="16px">
              <StyledText marginRight="5px" fontSize="14px" color="primaryDark">
                {presaleAddress}
              </StyledText>
              <Box style={{ position: 'relative' }}>
                <CopyButton
                  color="linkColor"
                  text={presaleAddress}
                  tooltipMessage="Copied"
                  tooltipTop={-40}
                  tooltipRight={-30}
                  width="15px"
                />
              </Box>
            </Flex>
            {accountIsOwner && !(presaleInfo?.isClaimPhase || presaleInfo?.isPresaleCancelled) && (
              <Button
                disabled={
                  !canPresaleBeFinalized ||
                  !!isLoadingButton.error ||
                  presaleInfo?.isClaimPhase ||
                  isLoading ||
                  isLoadingButton.isClicked ||
                  presaleInfo?.isPresaleCancelled
                }
                endIcon={
                  isLoadingButton.isClicked &&
                  isLoadingButton.type === LoadingButtonTypes.Finalize && <AutoRenewIcon spin color="currentColor" />
                }
                onClick={openFinalizeModal}
                variant="awesome"
                scale="sm"
              >
                Finalize Presale
              </Button>
            )}
            <RowFixed marginTop="16px" marginBottom="32px">
              {projectDetails?.websiteUrl && (
                <Link href={projectDetails.telegramId} rel="noopener noreferrer" target="_blank">
                  <WebIcon color="currentColor" />
                </Link>
              )}
              {projectDetails?.telegramId && (
                <Link href={projectDetails.telegramId} rel="noopener noreferrer" target="_blank">
                  <TelegramIcon color="currentColor" />
                </Link>
              )}
              {projectDetails?.twitterId && (
                <Link href={projectDetails.twitterId} rel="noopener noreferrer" target="_blank">
                  <TwitterIcon color="currentColor" />
                </Link>
              )}
              {projectDetails?.discordId && (
                <Link href={projectDetails.discordId} rel="noopener noreferrer" target="_blank">
                  <DiscordIcon color="currentColor" />
                </Link>
              )}
              {projectDetails?.email && (
                <Link href={`mailTo:${projectDetails.email}`} rel="noopener noreferrer" target="_blank">
                  <EmailIcon color="currentColor" />
                </Link>
              )}
            </RowFixed>
          </InfoWrapper>
        </GridContainer>
        <Divider infoDivider />
        <StyledText marginBottom="16px" marginTop="24px" fontSize="20px" bold>
          Presale System
        </StyledText>
        {projectDetails?.description && (
          <Box marginBottom="24px">
            <StyledText marginBottom="2px" bold color={darkColors.primaryDark}>
              About Presale
            </StyledText>
            <Divider />
            <Flex marginTop="4px" justifyContent="space-between">
              <StyledText>{projectDetails?.description}</StyledText>
            </Flex>
          </Box>
        )}
        <TokenDetails presaleAddress={presaleAddress} />
        <Box marginTop="24px" />
        <PresaleDetails presaleAddress={presaleAddress} />
        <Box marginTop="24px" />
        <GoalSystem paymentDecimals={paymentToken?.decimals || 18} presaleInfo={presaleInfo} currency={currency} />
        <Box marginTop="24px" />
        <RouterDetails presaleInfo={presaleInfo} />
        {(isViewWhitelist || isViewContributors) && <Divider marginY="24px" infoDivider />}
        {isViewWhitelist && (
          <WhitelistSection
            setIsMainLoading={setIsLoading}
            presaleAddress={presaleAddress}
            isMainLoading={isLoading}
            whitelistAddresses={whitelistAddresses}
            presaleInfo={presaleInfo}
            setPresaleInfo={setPresaleInfo}
            setWhitelistAddresses={setWhitelistAddresses}
          />
        )}
        {isViewContributors && (
          <ContributorsSection
            paymentTokenDecimals={paymentToken?.decimals}
            currency={currency}
            presaleInfo={presaleInfo}
            presaleAddress={presaleAddress}
          />
        )}
      </ResponsiveBox1>
      <ResponsiveBox2>
        {selectSection()}
        <TimeDetails presaleInfo={presaleInfo} />
        <Status presaleAddress={presaleAddress} presaleInfo={presaleInfo} />
        {contributors.length > 0 && (
          <Button variant="tertiary" width="100%" scale="sm" onClick={() => setIsViewContributors((prev) => !prev)}>
            {isViewContributors ? 'Close' : 'View'} Contributors List {`(${contributors.length})`}
          </Button>
        )}
        {whitelistAddresses.length >= 0 && (
          <Button
            marginTop="8px"
            variant="secondary"
            width="100%"
            scale="sm"
            onClick={() => setIsViewWhitelist((prev) => !prev)}
          >
            {isViewWhitelist ? 'Close' : 'View'} Whitelist {`(${whitelistAddresses.length})`}
          </Button>
        )}
        {accountIsOwner &&
          !presaleInfo?.isClaimPhase &&
          (!presaleInfo?.isPresaleCancelled ? (
            <>
              <CancelButton
                onClick={openCancelModal}
                endIcon={
                  isLoadingButton.isClicked &&
                  isLoadingButton.type === LoadingButtonTypes.CancelPool && <AutoRenewIcon spin color="currentColor" />
                }
                disabled={isLoadingButton.isClicked || isLoading}
                marginTop="8px"
                width="100%"
                scale="sm"
                variant="danger"
              >
                Cancel Presale
              </CancelButton>
              {isLoadingButton.type === LoadingButtonTypes.CancelPool && isLoadingButton.error && (
                <StyledText color="failure" marginTop="4px" fontSize="10px">
                  {isLoadingButton.error}
                </StyledText>
              )}
            </>
          ) : (
            <>
              <CancelButton
                onClick={withdrawCancelledTokenHandler}
                endIcon={
                  isLoadingButton.isClicked &&
                  isLoadingButton.type === LoadingButtonTypes.WithdrawCancelledTokens && (
                    <AutoRenewIcon spin color="currentColor" />
                  )
                }
                disabled={isLoadingButton.isClicked || isLoading || presaleInfo.isWithdrawCancelledTokens}
                marginTop="8px"
                width="100%"
                scale="sm"
                variant="danger"
              >
                Withdraw Cancelled Tokens
              </CancelButton>
              {isLoadingButton.type === LoadingButtonTypes.WithdrawCancelledTokens && isLoadingButton.error && (
                <StyledText color="failure" marginTop="4px" fontSize="10px">
                  {isLoadingButton.error}
                </StyledText>
              )}
            </>
          ))}
      </ResponsiveBox2>
    </Flex>
  )
}

export default Presale
