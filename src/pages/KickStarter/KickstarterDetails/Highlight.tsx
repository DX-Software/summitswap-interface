/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Button,
  FacebookIcon,
  Flex,
  Progress,
  ShareIcon,
  Skeleton,
  Text,
  TwitterIcon,
  WalletIcon,
  useModal,
  Modal,
  InjectedModalProps,
} from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { formatUnits } from 'ethers/lib/utils'
import Tooltip from 'components/Tooltip'
import TransactionConfirmationModal, { TransactionErrorContent } from 'components/TransactionConfirmationModal'
import { NULL_ADDRESS } from 'constants/index'
import { getTokenImageBySymbol } from 'connectors'
import { useKickstarterContract, useTokenContract } from 'hooks/useContract'
import ImgCornerIllustration from 'img/corner-illustration.svg'
import React, { useMemo, useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { BackedKickstarter, Kickstarter, KickstarterProgressStatus } from 'types/kickstarter'
import copyText from 'utils/copyText'
import { getKickstarterStatus, getKickstarterStatusLabel } from 'utils/kickstarter'
import { ImgCurrency } from '../shared'
import ProgressBox from '../shared/ProgressBox'
import StatusLabel from '../shared/StatusLabel'
import WithdrawFundsModal from './WithdrawFundsModal'

type Props = {
  kickstarter?: Kickstarter
  backedKickstarter?: BackedKickstarter
  isLoading?: boolean
  handleIsPayment: (value: boolean) => void
}

const WhiteDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: white;
`

const ImgKickstarterDesktop = styled(Flex)<{ image: string }>`
  width: 240px;
  height: 230px;
  border-radius: 8px;
  flex-shrink: 0;

  background: ${(props) => `url(${props.image}) gray`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;

  @media (max-width: 768px) {
    display: none;
  }
`

const ImgKickstarterMobile = styled(Flex)<{ image: string }>`
  width: 100%;
  height: 230px;
  border-radius: 8px;
  flex-shrink: 0;
  display: none;

  background: ${(props) => `url(${props.image}) gray`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;

  @media (max-width: 768px) {
    display: block;
  }
`

const BackedAmountWrapper = styled(Flex)`
  position: relative;
  padding: 12px 0;
  padding-left: 54px;
  padding-right: 16px;
  background-color: ${({ theme }) => theme.colors.info};
  border-radius: 8px;
  overflow: hidden;
`

const ImgIllustration = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
`

const SocialMedia = styled.a`
  display: flex;
  height: fit-content;
  padding: 12px 18px;
  background-color: white;
  border-radius: 20px;
`

const HighlightContainer = styled(Flex)`
  column-gap: 32px;
  row-gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const SuccessModal = ({ onDismiss }: InjectedModalProps) => {
  return (
    <Modal title="Withdrawal Successfull" onDismiss={onDismiss} bodyPadding="0 30px" hideSeparator>
      <Text color="linkColor" marginBottom="24px">
        You have successfully withdrawn your funds.
      </Text>
    </Modal>
  )
}

const Highlight = ({ kickstarter, backedKickstarter, handleIsPayment, isLoading = true }: Props) => {
  const { account } = useWeb3React()

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [contractHasEnoughFunds, setContractHasEnoughtFunds] = useState<boolean>()
  const progressStatus = getKickstarterStatus(kickstarter?.endTimestamp?.toNumber() || 0, kickstarter?.approvalStatus)
  const kickstarterContract = useKickstarterContract(kickstarter?.id)
  const paymentTokenContract = useTokenContract(
    kickstarter?.paymentToken !== NULL_ADDRESS ? kickstarter?.paymentToken : undefined
  )

  const fundedPercentage = useMemo(() => {
    if (
      !kickstarter ||
      !kickstarter.totalContribution ||
      !kickstarter.projectGoals ||
      kickstarter.totalContribution.eq(0) ||
      kickstarter.projectGoals.eq(0)
    ) {
      return 0
    }
    return kickstarter?.totalContribution?.div(kickstarter.projectGoals).times(100).toNumber()
  }, [kickstarter])

  const currentPageLink = window.location.href

  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  useEffect(() => {
    async function checkContractFunds() {
      if (!kickstarter || !kickstarterContract) return

      let withdrawalAmount = ''
      if (kickstarter?.paymentToken !== NULL_ADDRESS) {
        withdrawalAmount = formatUnits(
          await paymentTokenContract?.balanceOf(kickstarter.id),
          await paymentTokenContract?.decimals()
        )
      } else {
        withdrawalAmount = formatUnits(await kickstarterContract?.provider?.getBalance(kickstarter.id))
      }

      setContractHasEnoughtFunds(
        kickstarter.percentageFeeAmount
          ?.times(kickstarter.totalContribution || 0)
          .div(10000)
          .plus(kickstarter.fixFeeAmount || 0)
          .lt(withdrawalAmount)
      )
    }
    if (kickstarter && kickstarterContract) checkContractFunds()
  }, [kickstarter, kickstarterContract, paymentTokenContract])

  const displayTooltip = () => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }
  const onDismiss = () => {
    setHash(undefined)
    setErrorMessage('')
    setAttemptingTxn(false)
    setIsErrorModalOpen(false)
  }

  const transactionFailed = useCallback((messFromError: string) => {
    setIsErrorModalOpen(true)
    setAttemptingTxn(false)
    setHash(undefined)
    setErrorMessage(messFromError)
  }, [])

  const [openSuccesModal] = useModal(<SuccessModal />)

  const handleWithdrawFunds = async () => {
    if (!kickstarterContract || !kickstarter || !(account?.toLowerCase() === kickstarter?.owner?.id)) return
    try {
      let withdrawalAmount = (await kickstarterContract?.provider?.getBalance(kickstarter.id)).toString()
      if (kickstarter?.paymentToken !== NULL_ADDRESS) {
        withdrawalAmount = (await paymentTokenContract?.balanceOf(kickstarter.id)).toString()
      }
      setAttemptingTxn(true)
      const receipt = await kickstarterContract.withdraw(withdrawalAmount, account)
      closeWithdrawModal()
      await receipt.wait()
      setAttemptingTxn(false)
      setContractHasEnoughtFunds(false)
      openSuccesModal()
    } catch (err) {
      const callError = err as any
      closeWithdrawModal()
      const callErrorMessage = callError.reason ?? callError.data?.message ?? callError.message
      transactionFailed(callErrorMessage)
    }
  }

  const [openWithdrawModal, closeWithdrawModal] = useModal(
    <WithdrawFundsModal
      attemptingTxn={attemptingTxn}
      handleWithdrawFunds={handleWithdrawFunds}
      kickstarter={kickstarter}
    />
  )

  return (
    <HighlightContainer>
      {isLoading ? (
        <Skeleton width={240} height={230} />
      ) : (
        <ImgKickstarterDesktop image={kickstarter?.imageUrl || ''} />
      )}
      <Flex flexDirection="column">
        {isLoading ? (
          <Flex style={{ columnGap: '8px' }} marginBottom="8px">
            <Skeleton height={26} width={74} />
            <Skeleton height={26} width={74} />
            <Skeleton height={26} width={74} />
          </Flex>
        ) : (
          <Flex style={{ columnGap: '8px' }} marginBottom="8px">
            {backedKickstarter && (
              <StatusLabel>
                <b>BACKED</b>
              </StatusLabel>
            )}
            <StatusLabel status={progressStatus}>
              {getKickstarterStatusLabel(kickstarter?.endTimestamp?.toNumber() || 0, kickstarter?.approvalStatus)}
            </StatusLabel>
          </Flex>
        )}
        {isLoading ? (
          <Skeleton height={36} width={300} marginBottom="24px" />
        ) : (
          <Text fontSize="40px" marginBottom="24px">
            {kickstarter?.title}
          </Text>
        )}
        {kickstarter && <ImgKickstarterMobile image={kickstarter.imageUrl || ''} marginBottom="24px" />}
        <Flex style={{ columnGap: '8px', alignItems: 'center', marginBottom: '4px' }}>
          {isLoading ? (
            <Skeleton height={28} width={28} />
          ) : (
            <ImgCurrency image={getTokenImageBySymbol(kickstarter?.tokenSymbol)} />
          )}
          {isLoading ? (
            <Skeleton height={28} width={42} />
          ) : (
            <Text fontWeight="bold" fontSize="24px">
              {kickstarter?.totalContribution?.toString()}
            </Text>
          )}
        </Flex>
        {isLoading ? (
          <Skeleton height={24} width={240} marginBottom="16px" />
        ) : (
          <Text color="textSubtle" marginBottom="16px">
            backed of {kickstarter?.projectGoals?.toString() || 0} {kickstarter?.tokenSymbol} goal
          </Text>
        )}
        {!isLoading && (
          <ProgressBox maxWidth="400px" marginBottom="8px">
            <Progress primaryStep={fundedPercentage} />
          </ProgressBox>
        )}
        <Flex style={{ columnGap: '8px' }} alignItems="center" marginBottom="16px">
          {isLoading ? (
            <Skeleton width={200} />
          ) : (
            <>
              {progressStatus !== KickstarterProgressStatus.COMPLETED && (
                <>
                  <Text fontWeight="bold">
                    {getKickstarterStatusLabel(
                      kickstarter?.endTimestamp?.toNumber() || 0,
                      kickstarter?.approvalStatus,
                      true
                    )}
                  </Text>
                  <WhiteDot />
                </>
              )}
              <Text>{kickstarter?.totalContributor?.toString() || '0'} backers</Text>
            </>
          )}
        </Flex>
        {backedKickstarter && (
          <BackedAmountWrapper flexDirection="column" marginBottom="16px">
            <ImgIllustration src={ImgCornerIllustration} />
            <Text fontWeight="bold" marginBottom="4px">
              You have backed this project
            </Text>
            <Text>
              Backed amount&nbsp;&nbsp;&nbsp;&nbsp;{backedKickstarter.amount?.toString()} {kickstarter?.tokenSymbol}
            </Text>
          </BackedAmountWrapper>
        )}

        <Flex style={{ columnGap: '8px', rowGap: '8px' }} alignItems="center" flexWrap="wrap">
          {isLoading && <Skeleton width={162} height={38} />}
          {!isLoading && (
            <Flex style={{ columnGap: '8px' }}>
              {account && kickstarter && account.toLowerCase() === kickstarter?.owner?.id && (
                <Button
                  startIcon={<WalletIcon color="currentColor" />}
                  variant="secondary"
                  isLoading={attemptingTxn}
                  onClick={openWithdrawModal}
                  disabled={!contractHasEnoughFunds}
                >
                  Withdraw Fund
                </Button>
              )}
              {progressStatus !== KickstarterProgressStatus.COMPLETED && (
                <Button isLoading={attemptingTxn} onClick={() => handleIsPayment(true)}>
                  Back this project
                </Button>
              )}
            </Flex>
          )}
          <Flex style={{ columnGap: '8px' }}>
            {isLoading ? (
              <Skeleton width={50} height={38} />
            ) : (
              <Tooltip placement="top" text="Copied" show={isTooltipDisplayed}>
                <SocialMedia
                  type="button"
                  style={{ cursor: 'pointer' }}
                  onClick={() => copyText(currentPageLink, displayTooltip)}
                >
                  <ShareIcon width="14px" />
                </SocialMedia>
              </Tooltip>
            )}
            {isLoading ? (
              <Skeleton width={50} height={38} />
            ) : (
              <SocialMedia
                style={{ cursor: 'pointer' }}
                href={`https://twitter.com/intent/tweet?text=Let's ontribute to "${kickstarter?.title}" Kickstarter ${currentPageLink}`}
                target="_blank"
              >
                <TwitterIcon width="14px" />
              </SocialMedia>
            )}
            {isLoading ? (
              <Skeleton width={50} height={38} />
            ) : (
              <SocialMedia
                style={{ cursor: 'pointer' }}
                href={`https://www.facebook.com/sharer/sharer.php?u=${currentPageLink}`}
                target="_blank"
              >
                <FacebookIcon width="14px" />
              </SocialMedia>
            )}
          </Flex>
        </Flex>
      </Flex>
      <TransactionConfirmationModal
        isOpen={isErrorModalOpen}
        onDismiss={onDismiss}
        attemptingTxn={attemptingTxn}
        hash={hash}
        pendingText=""
        content={() =>
          errorMessage ? <TransactionErrorContent onDismiss={onDismiss} message={errorMessage || ''} /> : null
        }
      />
    </HighlightContainer>
  )
}

export default Highlight
