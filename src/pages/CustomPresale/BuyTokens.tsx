import React, { useCallback } from 'react'
import { BigNumber } from 'ethers'
import styled from 'styled-components'
import { Pagination } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { TranslateString } from 'utils/translateTextHelpers'
import { Text, AutoRenewIcon, useWalletModal, Input, Progress, Box, Button, Flex } from '@koda-finance/summitswap-uikit'
import { Token } from '@koda-finance/summitswap-sdk'
import login from 'utils/login'
import { RowBetween } from '../../components/Row'
import CopyButton from '../../components/CopyButton'
import MessageDiv from '../../components/MessageDiv'
import Tag from '../../components/Tag'
import { PresaleInfo, FieldProps, PresalePhases, LoadingButtonTypes, LoadingForButton } from './types'
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from '../../constants/presale'

interface Props {
  token: Token | null | undefined
  isAccountTokensClaimed: boolean
  isLoading: boolean
  presalePhase: PresalePhases | ''
  presaleInfo: PresaleInfo | undefined
  youBought: BigNumber | undefined
  loadingForButton: LoadingForButton
  buyBnbAmount: FieldProps
  contributors: string[]
  whitelistAddresses: string[]
  buyBnbAmountChangeHandler: React.ChangeEventHandler<HTMLInputElement> | undefined
  onClaimHandler: () => Promise<void>
  onWithdrawBnbHandler: () => Promise<void>
  onBuyBnbHandler: () => Promise<void>
  formatUnits: (amount: BigNumber | undefined, decimals: number) => string
}

export const Card = styled.div`
  background: #011724;
  border-radius: 20px;
  padding: 25px 28px;
  width: 100%;
`

const Section = styled(Box)`
  background: #000f18;
  border-radius: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const InputBnb = styled(Input)`
  background: #011d2c;
  width: 45%;
  ${(props) => (props.isWarning ? '' : 'border: 0.557844px solid #00d5a5')};
  text-align: center;
  border-radius: 50px;
`

export const ProgressBox = styled(Box)<{ isProgressBnb?: boolean }>`
  & :first-child {
    height: 10px;
    background: #fff;
    box-shadow: 0px 0px 8.36765px rgba(255, 255, 255, 0.75);
    & :first-child {
      background: ${(props) => (props.isProgressBnb ? '#00d5a5' : '#7645d9')};
    }
  }
`
export const TextHeading = styled(Text)`
  font-weight: 700;
  font-size: 24px;
  @media (max-width: 480px) {
    font-size: 15px;
  }
`
export const TextSubHeading = styled(Text)`
  font-weight: 700;
  font-size: 17px;
  @media (max-width: 480px) {
    font-size: 10px;
  }
`

export const TextContributor = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  @media (max-width: 480px) {
    font-size: 10px;
  }
`

const PaginationTitleText = styled(Text)`
  font-size: 16px;
  width: 33%;
  @media (max-width: 550px) {
    font-size: 12px;
  }
  @media (max-width: 400px) {
    font-size: 5px;
  }
`

const PaginationFieldText = styled(Text)`
  font-size: 12px;
  @media (max-width: 967px) {
    font-size: 8px;
  }
  @media (max-width: 800px) {
    font-size: 12px;
  }
  @media (max-width: 550px) {
    font-size: 8px;
  }
  @media (max-width: 400px) {
    font-size: 6px;
  }
`

const BorderBottom = styled.div`
  border-bottom: 1px solid #fff;
  opacity: 0.4;
  width: 100%;
  margin-top: 5px;
`

const style = {
  '& .MuiPaginationItem-root ': {
    color: '#ffff',
  },
  '& .Mui-selected': {
    color: '#00D5A5',
  },
}

const WHITELIST_ADDRESSES_PER_PAGE = 10

export default function BuyTokens({
  token,
  loadingForButton,
  isLoading,
  presalePhase,
  isAccountTokensClaimed,
  youBought,
  buyBnbAmount,
  presaleInfo,
  contributors,
  whitelistAddresses,
  onBuyBnbHandler,
  onClaimHandler,
  onWithdrawBnbHandler,
  buyBnbAmountChangeHandler,
  formatUnits,
}: Props) {
  const { account, activate, deactivate } = useWeb3React()

  const [page, setPage] = React.useState(1)

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const startIndex = page * WHITELIST_ADDRESSES_PER_PAGE - WHITELIST_ADDRESSES_PER_PAGE
  const endIndex =
    startIndex + WHITELIST_ADDRESSES_PER_PAGE > whitelistAddresses.length
      ? whitelistAddresses.length
      : startIndex + WHITELIST_ADDRESSES_PER_PAGE
  const slicedWhitelistAddresses = whitelistAddresses.slice(startIndex, endIndex)

  return (
    <Card>
      <RowBetween>
        <TextHeading>{token?.name} Presale</TextHeading>
        <TextContributor>Contributors: {contributors.length}</TextContributor>
      </RowBetween>
      <Tag saleTypeTag>{presaleInfo?.isWhitelistEnabled ? 'WHITELIST' : 'PUBLIC'}</Tag>
      <Tag>{presalePhase !== '' ? presalePhase : 'LOADING PRESALE'}</Tag>
      <Box marginTop="30px" marginBottom="30px">
        <TextHeading marginBottom="5px">Total Progress:</TextHeading>
        <ProgressBox marginBottom={1} isProgressBnb>
          <Progress primaryStep={presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toNumber()} />
        </ProgressBox>
        <RowBetween>
          <TextSubHeading>{presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toString()}%</TextSubHeading>
          <TextSubHeading>
            {`${formatUnits(presaleInfo?.totalBought, 18)}/${formatUnits(presaleInfo?.hardcap, 18)} BNB`}
          </TextSubHeading>
        </RowBetween>
      </Box>

      <Section marginTop="30px" paddingX={20} paddingY="40px">
        <InputBnb
          value={buyBnbAmount.value}
          onChange={buyBnbAmountChangeHandler}
          isWarning={buyBnbAmount.error !== ''}
          type="number"
          placeholder="Enter BNB Amount"
        />
        <MessageDiv marginTop="15px" type={isLoading ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
          {buyBnbAmount.value && isLoading ? 'Buying Tokens' : buyBnbAmount.error}
        </MessageDiv>
        <TextSubHeading marginBottom="15px" marginTop="15px" textAlign="center">
          Your Progress
        </TextSubHeading>
        <ProgressBox marginBottom={1} width="100%">
          <Progress
            primaryStep={youBought && presaleInfo ? youBought.mul(100).div(presaleInfo.maxBuyBnb).toNumber() : 0}
          />
          {/* <Progress primaryStep={20} /> */}
        </ProgressBox>
        <RowBetween>
          <TextSubHeading>
            {youBought && presaleInfo ? youBought.mul(100).div(presaleInfo.maxBuyBnb).toNumber() : 0}%
          </TextSubHeading>
          <TextSubHeading>
            {`${youBought ? formatUnits(youBought, 18) : '0.0'}/${formatUnits(presaleInfo?.maxBuyBnb, 18)} BNB`}
          </TextSubHeading>
        </RowBetween>
        <Text marginBottom="15px" style={{ height: '17px' }} fontSize="17px">
          {presaleInfo && buyBnbAmount.value && !buyBnbAmount.error
            ? ` Estimated ${token?.symbol}: ${
                Number(formatUnits(presaleInfo.presaleRate, 18)) * Number(buyBnbAmount.value)
              }`
            : ''}
        </Text>
        {account ? (
          <Button
            endIcon={
              buyBnbAmount.value &&
              isLoading &&
              !loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
            }
            disabled={buyBnbAmount.error !== '' || isLoading || loadingForButton.isClicked || !buyBnbAmount.value}
            marginTop="15px"
            onClick={onBuyBnbHandler}
          >
            Buy With BNB
          </Button>
        ) : (
          <Button marginTop="15px" onClick={onPresentConnectModal}>
            {TranslateString(292, 'CONNECT WALLET')}
          </Button>
        )}
      </Section>

      <Section marginTop="30px" paddingX={20} paddingY="40px">
        <TextSubHeading>
          {token?.name}:{' '}
          {presaleInfo && youBought ? formatUnits(presaleInfo.presaleRate.mul(youBought), 36).toString() : '0.0'}
        </TextSubHeading>
        {isAccountTokensClaimed ? (
          <MessageDiv marginBottom="15px" type={MESSAGE_SUCCESS}>
            Tokens Alredy Claimed.
          </MessageDiv>
        ) : (
          <MessageDiv marginBottom="15px" type={loadingForButton.error !== '' ? MESSAGE_ERROR : MESSAGE_SUCCESS}>
            {loadingForButton.type === LoadingButtonTypes.Claim ||
            loadingForButton.type === LoadingButtonTypes.Withdraw ||
            loadingForButton.type === LoadingButtonTypes.EmergencyWithdraw
              ? loadingForButton.isClicked
                ? loadingForButton.type === LoadingButtonTypes.Claim
                  ? 'Claiming Tokens'
                  : 'Withdrawing Bnb'
                : loadingForButton.error
              : ''}
          </MessageDiv>
        )}
        {youBought?.gt(0) && !presaleInfo?.isClaimPhase ? (
          <Button
            endIcon={
              (loadingForButton.type === LoadingButtonTypes.Withdraw ||
                loadingForButton.type === LoadingButtonTypes.EmergencyWithdraw) &&
              loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
            }
            disabled={
              presaleInfo?.isClaimPhase ||
              isAccountTokensClaimed ||
              youBought?.eq(0) ||
              loadingForButton?.error !== '' ||
              isLoading ||
              loadingForButton?.isClicked
            }
            onClick={onWithdrawBnbHandler}
          >
            {presaleInfo?.isPresaleCancelled ? 'Withdraw Bnb' : 'Emergency Withdraw'}
          </Button>
        ) : (
          <Button
            endIcon={
              loadingForButton.type === LoadingButtonTypes.Claim &&
              loadingForButton.isClicked && <AutoRenewIcon spin color="currentColor" />
            }
            disabled={
              youBought?.eq(0) ||
              !presaleInfo?.isClaimPhase ||
              isLoading ||
              loadingForButton.isClicked ||
              isAccountTokensClaimed
            }
            onClick={onClaimHandler}
          >
            Claim Your Tokens
          </Button>
        )}
      </Section>

      {presaleInfo?.isWhitelistEnabled && whitelistAddresses.length && (
        <Section marginTop="30px" paddingX={20} paddingY="30px">
          <TextSubHeading style={{ width: '100%' }} marginBottom="15px" textAlign="center">
            Whitelist Users
          </TextSubHeading>
          <Flex marginBottom="5px" width="100%" justifyContent="space-between">
            <PaginationTitleText textAlign="left">No.</PaginationTitleText>
            <PaginationTitleText textAlign="center">Address({whitelistAddresses.length})</PaginationTitleText>
            <PaginationTitleText textAlign="right">Copy</PaginationTitleText>
          </Flex>
          <BorderBottom />
          {slicedWhitelistAddresses.map((address, i) => (
            <>
              <Flex marginTop="5px" width="100%" justifyContent="space-between">
                <PaginationFieldText>{i + 1}.</PaginationFieldText>
                <PaginationFieldText>{address}</PaginationFieldText>
                <CopyButton color="#00D5A5" text={address} tooltipMessage="Copied" tooltipTop={1} width="12px" />
              </Flex>

              <BorderBottom />
            </>
          ))}
          <Pagination
            sx={style}
            count={Math.ceil(whitelistAddresses.length / WHITELIST_ADDRESSES_PER_PAGE)}
            page={page}
            onChange={handleChange}
          />
        </Section>
      )}
    </Card>
  )
}
