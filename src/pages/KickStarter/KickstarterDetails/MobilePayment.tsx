import {
  ArrowForwardIcon,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Skeleton,
  Text,
  WalletIcon,
  lightColors,
} from '@koda-finance/summitswap-uikit'
import AccountIcon from 'components/AccountIcon'
import { getTokenImageBySymbol } from 'connectors'
import { parseUnits } from 'ethers/lib/utils'
import { NULL_ADDRESS } from 'constants/index'
import { useKickstarterContext } from 'pages/KickStarter/contexts/kickstarter'
import React from 'react'
import { useToken } from 'hooks/Tokens'
import styled from 'styled-components'
import { Kickstarter } from 'types/kickstarter'
import { shortenAddress } from 'utils'
import { formatNumber } from 'utils/formatInfoNumbers'
import { ImgCurrency } from '../shared'
import FundingInput from '../shared/FundingInput'

type Props = {
  paymentTokenBalance: string
  email: string
  handleEmailChanged: (e) => void
  showPayment: () => void
  totalPayment: string
  kickstarter: Kickstarter | undefined
  handleBackedAmountChanged: (value: string) => void
}

const Banner = styled.div<{ image: string }>`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: ${(props) => `url(${props.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;
`

const Name = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-transform: uppercase;
`

const Title = styled(Text)`
  font-weight: bold;
  margin-bottom: 4px;
`

const Divider = styled.div`
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.colors.inputColor};
  margin: 24px 0px;
`

const ConnectionWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.menuItemBackground};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.backgroundDisabled};
  border-radius: 8px;
  flex-direction: column;
  padding: 12px 16px;
  margin-top: 8px;
  row-gap: 8px;
`

const OnlineDot = styled(Box)<{ isOnline: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${({ isOnline, theme }) => (isOnline ? theme.colors.linkColor : theme.colors.textDisabled)};
`

function MobilePayment({
  email,
  handleEmailChanged,
  showPayment,
  totalPayment,
  kickstarter,
  paymentTokenBalance,
  handleBackedAmountChanged,
}: Props) {
  const { account, accountBalance, onPresentConnectModal } = useKickstarterContext()

  const paymentToken = useToken(kickstarter?.paymentToken !== NULL_ADDRESS ? kickstarter?.paymentToken : undefined)

  const bigMinContribution = parseUnits(kickstarter?.minContribution?.toString() || '0', paymentToken?.decimals)
  const isGreaterThanMinContribution = parseUnits(totalPayment || '0', paymentToken?.decimals).gte(bigMinContribution)

  return (
    <Flex flexDirection="column">
      <Heading size="lg" marginBottom="8px">
        Back Project
      </Heading>
      <Flex style={{ columnGap: '16px' }}>
        <Banner image={kickstarter?.imageUrl || ''} />
        <Flex flexDirection="column">
          <Name>{kickstarter?.creator}</Name>
          <Title>{kickstarter?.title}</Title>
          <Flex style={{ columnGap: '8px' }}>
            <ImgCurrency image={getTokenImageBySymbol(kickstarter?.tokenSymbol)} />
            <Text color="textSubtle">
              <b style={{ color: 'white' }}>{formatNumber(kickstarter?.totalContribution?.toString())}</b> /{' '}
              {formatNumber(kickstarter?.projectGoals?.toString())} {kickstarter?.tokenSymbol}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Divider />
      <Heading size="lg" marginBottom="8px">
        Backing Project
      </Heading>
      <Text color="textSubtle" style={{ marginBottom: '24px' }}>
        You have to back with minimum amount of{' '}
        <b style={{ color: lightColors.linkColor }}>
          {formatNumber(kickstarter?.minContribution?.toString())} {kickstarter?.tokenSymbol}
        </b>{' '}
        to participate in this project
      </Text>
      <FundingInput
        label="Enter Backing Amount"
        tokenSymbol={kickstarter?.tokenSymbol}
        value={totalPayment}
        onChange={handleBackedAmountChanged}
      />
      <br />
      <ConnectionWrapper>
        <Flex alignItems="center" style={{ columnGap: '8px' }}>
          <OnlineDot isOnline={!!account} />
          <Text fontSize="12px">Connected Wallet</Text>
        </Flex>
        {!account && <Text color="textDisabled">No wallet connected.</Text>}
        {account && (
          <Flex alignItems="center" style={{ columnGap: '8px' }}>
            <AccountIcon account={account} size={32} />
            <Flex flexDirection="column" marginRight="auto">
              <Text fontSize="12px" color="textDisabled">
                {shortenAddress(account)}
              </Text>
            </Flex>
            {!accountBalance || !paymentTokenBalance ? (
              <Skeleton width={100} height={28} />
            ) : (
              <Text fontWeight="bold" color="primaryDark">
                {`${kickstarter?.paymentToken === NULL_ADDRESS ? accountBalance : paymentTokenBalance} ${
                  kickstarter?.tokenSymbol
                }`}
              </Text>
            )}
          </Flex>
        )}
      </ConnectionWrapper>
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
          disabled={!Number(totalPayment) || !isGreaterThanMinContribution || !email}
        >
          Continue
        </Button>
      )}
    </Flex>
  )
}

export default React.memo(MobilePayment)
