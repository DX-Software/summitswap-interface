import { TransactionResponse } from '@ethersproject/providers'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Box,
  Breadcrumbs,
  Button,
  Flex,
  Heading,
  Input,
  Skeleton,
  Text,
  useModal,
  WalletIcon,
  lightColors,
} from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useKickstarterContributorStore } from 'api/useKickstarterApi'
import AccountIcon from 'components/AccountIcon'
import TransactionConfirmationModal, { TransactionErrorContent } from 'components/TransactionConfirmationModal'
import { getTokenImageBySymbol } from 'connectors'
import { NULL_ADDRESS } from 'constants/index'
import { format } from 'date-fns'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useKickstarterContract, useTokenContract } from 'hooks/useContract'
import { useKickstarterContext } from 'pages/KickStarter/contexts/kickstarter'
import { useToken } from 'hooks/Tokens'
import React, { useCallback, useEffect, useState } from 'react'
import { UseQueryResult } from 'react-query'
import { useTransactionAdder } from 'state/transactions/hooks'
import styled from 'styled-components'
import { BackedKickstarter, Kickstarter } from 'types/kickstarter'
import { shortenAddress } from 'utils'
import { ImgCurrency } from '../shared'
import FundingInput from '../shared/FundingInput'
import MobilePayment from './MobilePayment'
import PaymentModal from './PaymentModal'

type Props = {
  previousPage: string
  backedKickstarter: UseQueryResult<BackedKickstarter | undefined, unknown>
  kickstarterQueryResult: UseQueryResult<Kickstarter | undefined, unknown>
  handleKickstarterId: (value: string) => void
  handleIsPayment: (value: boolean) => void
}

const MobileBanner = styled(Flex)<{ image: string }>`
  width: 100%;
  height: 120px;
  border-radius: 8px;
  display: none;

  background: ${(props) => `url(${props.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;

  @media (max-width: 900px) {
    display: block;
  }
`

const DesktopBanner = styled.div<{ image: string }>`
  background: gray;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  flex-shrink: 0;

  background: ${(props) => `url(${props.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;

  @media (max-width: 900px) {
    display: none;
  }
`

const Name = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-transform: uppercase;
  margin-bottom: 8px;
`

const Title = styled(Text)`
  font-weight: bold;
  margin-bottom: 32px;
`

const Divider = styled.div`
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.colors.inputColor};
  margin: 24px 0px;
`

const SideItems = styled(Grid)`
  @media (max-width: 900px) {
    display: none;
  }
`

const DesktopPaymentWrapper = styled(Grid)<{ isVisibleOnMobile: boolean }>`
  @media (max-width: 900px) {
    display: ${({ isVisibleOnMobile }) => (isVisibleOnMobile ? 'block!important' : 'none!important')};
  }
`

const SideWrapper = styled(Flex)`
  flex-direction: column;
  border-radius: 8px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.menuItemBackground};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.backgroundDisabled};
`

const OnlineDot = styled(Box)<{ isOnline: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${({ isOnline, theme }) => (isOnline ? theme.colors.linkColor : theme.colors.textDisabled)};
`

const ButtonContinue = styled(Button)`
  display: none;
  @media (max-width: 900px) {
    display: flex;
  }
`

function ProjectPayment({
  previousPage,
  backedKickstarter,
  kickstarterQueryResult,
  handleKickstarterId,
  handleIsPayment,
}: Props) {
  const { account, accountBalance, onPresentConnectModal } = useKickstarterContext()

  const { data: kickstarter } = kickstarterQueryResult

  const addTransaction = useTransactionAdder()
  const kickstarterContract = useKickstarterContract(kickstarter?.id)
  const kickstarterContributorStore = useKickstarterContributorStore()

  const [email, setEmail] = useState('')
  const [backedAmount, setBackedAmount] = useState('')
  const [paymentTokenBalance, setPaymentTokenBalance] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [pendingText, setPendingText] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const paymentTokenContract = useTokenContract(
    kickstarter?.paymentToken !== NULL_ADDRESS ? kickstarter?.paymentToken : undefined
  )
  const paymentToken = useToken(kickstarter?.paymentToken !== NULL_ADDRESS ? kickstarter?.paymentToken : undefined)

  useEffect(() => {
    async function fetchTokenBalance() {
      const decimals = await paymentTokenContract?.decimals()
      const balance = await paymentTokenContract?.balanceOf(account)
      setPaymentTokenBalance(Number(formatUnits(balance, decimals)).toPrecision(6))
    }
    if (account && paymentTokenContract) fetchTokenBalance()
  }, [account, paymentTokenContract, kickstarter])

  const handleEmailChanged = (e) => {
    setEmail(e.target.value)
  }

  const onDismiss = () => {
    setHash(undefined)
    setPendingText('')
    setErrorMessage('')
    setAttemptingTxn(false)
    setIsOpen(false)
  }

  const transactionSubmitted = useCallback(
    (response: TransactionResponse, summary: string) => {
      setIsOpen(true)
      setAttemptingTxn(false)
      setHash(response.hash)
      addTransaction(response, {
        summary,
      })
    },
    [addTransaction]
  )

  const transactionFailed = useCallback((messFromError: string) => {
    setIsOpen(true)
    setAttemptingTxn(false)
    setHash(undefined)
    setErrorMessage(messFromError)
  }, [])

  const handlePayment = useCallback(async () => {
    try {
      if (!kickstarterContract || !account || !backedAmount || !kickstarter) {
        return
      }
      const transactionValue = parseUnits(backedAmount, paymentToken?.decimals).toString()
      const receipt = await kickstarterContract.contribute(transactionValue, {
        value: kickstarter.paymentToken === NULL_ADDRESS ? transactionValue : 0,
      })
      transactionSubmitted(receipt, 'The contribution has been submitted successfully')

      await kickstarterContributorStore.mutateAsync({
        kickstarterAddress: kickstarter.id,
        walletAddress: account,
        currencyAddress: kickstarter.paymentToken || '',
        currencySymbol: kickstarter.tokenSymbol || '',
        email,
        contributionAmount: backedAmount,
      })

      await receipt.wait()
      await kickstarterQueryResult.refetch()
      await backedKickstarter.refetch()
    } catch (err) {
      const callError = err as any
      const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
      transactionFailed(callErrorMessage)
    }
  }, [
    kickstarterQueryResult,
    backedKickstarter,
    kickstarterContributorStore,
    kickstarterContract,
    account,
    backedAmount,
    kickstarter,
    transactionSubmitted,
    transactionFailed,
    email,
    paymentToken,
  ])

  const [showPayment] = useModal(
    <PaymentModal
      account={account}
      paymentTokenBalance={paymentTokenBalance}
      accountBalance={accountBalance}
      totalPayment={backedAmount}
      kickstarter={kickstarter}
      handlePayment={handlePayment}
    />
  )
  const [isMobilePaymentPage, setIsMobilePaymentPage] = useState(false)

  const bigMinContribution = parseUnits(kickstarter?.minContribution?.toString() || '0', paymentToken?.decimals)
  const isGreaterThanMinContribution = parseUnits(backedAmount || '0', paymentToken?.decimals).gte(bigMinContribution)

  const handleBackedAmountChanged = useCallback((value: string) => {
    if (value !== '' && value.match('^[0-9]{0,9}(\\.[0-9]{0,18})?$') == null) return
    setBackedAmount(value)
  }, [])

  return (
    <Flex flexDirection="column">
      <Flex flex={1} borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="12px" marginBottom="32px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={() => handleKickstarterId('')}>
            {previousPage}
          </Text>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={() => handleIsPayment(false)}>
            Project Details
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            Payment
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} marginBottom="32px" onClick={() => handleIsPayment(false)}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: 'underline' }}>
          back to Project Details
        </Text>
      </Flex>
      <DesktopPaymentWrapper container spacing={2} isVisibleOnMobile={!isMobilePaymentPage}>
        <Grid item xs={12} md={7}>
          <Heading size="lg" marginBottom="8px">
            Back Project
          </Heading>
          <MobileBanner image={kickstarter?.imageUrl || ''} marginBottom="16px" />
          <Flex style={{ columnGap: '16px' }}>
            <DesktopBanner image={kickstarter?.imageUrl || ''} />
            <Flex flexDirection="column">
              <Name>{kickstarter?.creator}</Name>
              <Title>{kickstarter?.title}</Title>
              <Flex style={{ columnGap: '8px' }} alignItems="center">
                <ImgCurrency image={getTokenImageBySymbol(kickstarter?.tokenSymbol)} />
                <Text fontSize="24px" color="textSubtle">
                  <b style={{ color: 'white' }}>{kickstarter?.totalContribution?.toString()}</b> /{' '}
                  {`${kickstarter?.projectGoals?.toString()} ${kickstarter?.tokenSymbol}`}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Divider />
          <Text color="textSubtle" marginBottom="4px">
            Project Reward
          </Text>
          <Text marginBottom="16px" style={{ whiteSpace: 'break-spaces' }}>{kickstarter?.rewardDescription}</Text>
          <Text color="textSubtle" marginBottom="4px">
            Reward Distribution
          </Text>
          <Text>
            {format(new Date((kickstarter?.rewardDistributionTimestamp?.toNumber() || 0) * 1000), 'LLLL do, yyyy')}
          </Text>
        </Grid>
        <SideItems item xs={12} md={5}>
          <SideWrapper marginBottom="16px">
            <Heading size="md" marginBottom="8px">
              Backing Project
            </Heading>
            <Text color="textSubtle" marginBottom="16px">
              You have to back with minimum amount of{' '}
              <b style={{ color: lightColors.linkColor }}>{`${kickstarter?.minContribution?.toString()} ${
                kickstarter?.tokenSymbol
              }`}</b>{' '}
              to participate in this project
            </Text>
            <FundingInput
              label="Enter Backing Amount"
              value={backedAmount}
              tokenSymbol={kickstarter?.tokenSymbol}
              onChange={handleBackedAmountChanged}
            />
            <br />
            <Text fontSize="14px">Enter E-mail Address</Text>
            <Input placeholder="e.g. summitswap@domain.com" value={email} onChange={handleEmailChanged} />
            <Text fontSize="12px" color="textSubtle">
              We will keep you updated for this project by e-mail
            </Text>
            {!account && (
              <Button
                variant="tertiary"
                startIcon={<WalletIcon />}
                style={{ fontFamily: 'Poppins', marginTop: '32px' }}
                onClick={onPresentConnectModal}
              >
                Connect Your Wallet
              </Button>
            )}
            {account && (
              <Button
                variant="awesome"
                endIcon={<ArrowForwardIcon color="text" />}
                style={{ fontFamily: 'Poppins', marginTop: '32px' }}
                onClick={showPayment}
                disabled={!Number(backedAmount) || !isGreaterThanMinContribution || !email.trim()}
              >
                Proceed
              </Button>
            )}
          </SideWrapper>
          <SideWrapper>
            <Flex alignItems="center" marginBottom="8px" style={{ columnGap: '8px' }}>
              <OnlineDot isOnline={!!account} />
              <Text fontSize="12px">Connected Wallet</Text>
            </Flex>
            {!account && <Text color="textDisabled">No wallet connected.</Text>}
            {account && (
              <Flex alignItems="center" style={{ columnGap: '8px' }}>
                <AccountIcon account={account} size={32} />
                <Flex flexDirection="column" marginRight="auto">
                  <Text fontSize="16px" color="textDisabled">
                    {shortenAddress(account)}
                  </Text>
                </Flex>
                {!accountBalance || !(kickstarter?.paymentToken === NULL_ADDRESS || paymentTokenBalance) ? (
                  <Skeleton width={100} height={28} />
                ) : (
                  <Text fontWeight="bold">
                    {`${kickstarter?.paymentToken === NULL_ADDRESS ? accountBalance : paymentTokenBalance} ${
                      kickstarter?.tokenSymbol
                    }`}
                  </Text>
                )}
              </Flex>
            )}
          </SideWrapper>
        </SideItems>
      </DesktopPaymentWrapper>
      {isMobilePaymentPage && (
        <MobilePayment
          email={email}
          paymentTokenBalance={paymentTokenBalance}
          handleEmailChanged={handleEmailChanged}
          showPayment={showPayment}
          totalPayment={backedAmount}
          handleBackedAmountChanged={handleBackedAmountChanged}
          kickstarter={kickstarter}
        />
      )}
      {!isMobilePaymentPage && (
        <ButtonContinue
          endIcon={<ArrowForwardIcon color="text" />}
          style={{ fontFamily: 'Poppins', marginTop: '32px' }}
          onClick={() => setIsMobilePaymentPage(true)}
        >
          Continue
        </ButtonContinue>
      )}
      <TransactionConfirmationModal
        isOpen={isOpen}
        onDismiss={onDismiss}
        attemptingTxn={attemptingTxn}
        hash={hash}
        pendingText={pendingText}
        content={() =>
          errorMessage ? <TransactionErrorContent onDismiss={onDismiss} message={errorMessage || ''} /> : null
        }
      />
    </Flex>
  )
}

export default React.memo(ProjectPayment)
