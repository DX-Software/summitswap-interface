import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TokenDropdown from 'components/TokenDropdown'
import { Token, WETH } from '@koda-finance/summitswap-sdk'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Button, Checkbox, Flex, Input, Text, useModal, useWalletModal } from '@koda-finance/summitswap-uikit'
import { useFactoryContract, useLockerContract, useTokenContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import axios from 'axios'
import { TranslateString } from 'utils/translateTextHelpers'
import login from 'utils/login'
import DatePicker from '@mui/lab/DatePicker'
import { addYears, subDays } from 'date-fns/esm'
import { useToken } from 'hooks/Tokens'
import {
  CHAIN_ID,
  KODA,
  LOCKER_ADDRESS,
  MAX_UINT256,
  NULL_ADDRESS,
  ONBOARDING_API,
  REFERRAL_ADDRESS,
} from '../../constants'
import SuccessModal from './SuccessModal'
import './styles.css'
import AddLiquidity from './AddLiquidity'
import SwapToKoda from './SwapToKoda'
import LockLiquidity from './LockLiquidity'
import SendReferralRewards from './SendReferralRewards'
import SetFeeInfo from './SetFeeInfo'
import RemoveFees from './RemoveFees'
import Submit from './Submit'

interface LpLock {
  lock: any
  lockId: number
}

export default function Onboarding() {
  const { account, activate, deactivate, library } = useWeb3React()
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [pairAddress, setPairAddress] = useState<string>()

  const [isLoading, setIsLoading] = useState(false)

  const [isEnoughLiquidity, setIsEnoughLiquidity] = useState(false)
  const [isLiquidityLocked, setIsLiquidityLocked] = useState(false)
  const [isTokensSentToReferral, setIsTokensSentToReferral] = useState(false)
  const [isReferralContractRemovedFromFees, setIsReferralContractRemovedFromFees] = useState(false)

  const [referrerPercentage, setReferrerPercentage] = useState<string>()
  const [firstBuyPercentage, setFirstBuyPercentage] = useState<string>()
  const [devPercentage, setDevPercentage] = useState<string>()

  const factoryContract = useFactoryContract()
  const tokenContract = useTokenContract(selectedToken?.address, true)
  const kodaContract = useTokenContract(KODA.address, true)
  const lockerContract = useLockerContract(true)

  const location = useLocation()
  const history = useHistory()
  const tokenFromUrl = useToken(new URLSearchParams(location.search).get('token') || '')

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const handleTokenSelect = useCallback((inputCurrency) => {
    setSelectedToken(inputCurrency)
  }, [])

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  useEffect(() => {
    const onboardingTokenAddress = new URLSearchParams(location.search).get('token')

    if (onboardingTokenAddress && !account) {
      onPresentConnectModal()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, location])

  useEffect(() => {
    if (selectedToken) {
      history.push({ search: `?token=${selectedToken.address}` })
    }
  }, [history, selectedToken])

  useEffect(() => {
    if (tokenFromUrl && selectedToken?.address !== tokenFromUrl.address) {
      setSelectedToken(tokenFromUrl)
    }
  }, [selectedToken, tokenFromUrl])

  useEffect(() => {
    async function fetchPair() {
      if (!selectedToken || !factoryContract) {
        setPairAddress(undefined)
        return
      }

      setIsLoading(true)
      const fetchedPairAddress = (await factoryContract.getPair(KODA.address, selectedToken.address)) as string
      setIsLoading(false)

      if (fetchedPairAddress === NULL_ADDRESS) {
        setPairAddress(undefined)
      } else {
        setPairAddress(fetchedPairAddress)
      }
    }

    fetchPair()
  }, [selectedToken, factoryContract])

  useEffect(() => {
    async function fetchLiquidity() {
      if (!tokenContract || !kodaContract || !pairAddress) {
        setIsEnoughLiquidity(false)
        return
      }

      setIsLoading(true)
      const kodaBalanceOfPair = (await kodaContract.balanceOf(pairAddress)) as BigNumber
      setIsLoading(false)

      setIsEnoughLiquidity(!kodaBalanceOfPair.isZero())
    }

    fetchLiquidity()
  }, [pairAddress, tokenContract, kodaContract])

  useEffect(() => {
    async function fetchIfReferralHasSomeBalance() {
      if (!tokenContract) return

      setIsLoading(true)
      const referralBalance = (await tokenContract.balanceOf(REFERRAL_ADDRESS)) as BigNumber
      setIsLoading(false)

      setIsTokensSentToReferral(!referralBalance.isZero())
    }

    fetchIfReferralHasSomeBalance()
  }, [tokenContract])

  const fetchUserLocked = useCallback(async () => {
    if (!tokenContract || !lockerContract || !account || !pairAddress) {
      setIsLiquidityLocked(false)
      return { lpLockfetchedLpLockss: undefined, totalAmountOfLpLocked: undefined }
    }

    setIsLoading(true)

    const userLocksLength = (await lockerContract.userLocksLength(account).then((o) => o.toNumber())) as number

    const fetchedLpLocks = (await Promise.all(
      [...Array(userLocksLength).keys()].map(async (userLockId) => {
        const lockId = await lockerContract.userLockAt(account, userLockId)
        const lock = await lockerContract.tokenLocks(lockId)

        return lock.lpToken === pairAddress ? { lock, lockId } : undefined
      })
    ).then((locks) => locks.filter(Boolean))) as LpLock[]

    const totalAmountOfLpLocked = fetchedLpLocks.reduce(
      (acc, cur) => acc.add(cur.lock.tokenAmount),
      BigNumber.from(0)
    ) as BigNumber

    setIsLoading(false)
    setIsLiquidityLocked(!totalAmountOfLpLocked.isZero())

    return { fetchedLpLocks, totalAmountOfLpLocked }
  }, [tokenContract, lockerContract, account, pairAddress])

  useEffect(() => {
    fetchUserLocked()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenContract, lockerContract, account, pairAddress, isLiquidityLocked])

  return (
    <div className="main-content onboarding-page">
      {!account && (
        <Flex mb={3} justifyContent="center">
          <Button style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
            {TranslateString(292, 'CONNECT WALLET')}
          </Button>
        </Flex>
      )}

      {account && (
        <>
          <p className="paragraph">Select onboarding token</p>
          <TokenDropdown
            onCurrencySelect={handleTokenSelect}
            selectedCurrency={selectedToken}
            showETH={false}
            showOnlyUnknownTokens
            disabled={isLoading}
          />
        </>
      )}
      <h3>Steps:</h3>
      <SwapToKoda token={selectedToken} isLoading={isLoading} />
      <AddLiquidity token={selectedToken} isLoading={isLoading} isEnoughLiquidity={isEnoughLiquidity} />
      <LockLiquidity
        token={selectedToken}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isEnoughLiquidity={isEnoughLiquidity}
        pairAddress={pairAddress}
        setIsLiquidityLocked={setIsLiquidityLocked}
      />
      <SendReferralRewards
        token={selectedToken}
        tokenContract={tokenContract}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setIsTokensSentToReferral={setIsTokensSentToReferral}
        isLiquidityLocked={isLiquidityLocked}
      />
      <SetFeeInfo
        token={selectedToken}
        isLoading={isLoading}
        isLiquidityLocked={isLiquidityLocked}
        isTokensSentToReferral={isTokensSentToReferral}
        referrerPercentage={referrerPercentage}
        setReferrerPercentage={setReferrerPercentage}
        firstBuyPercentage={firstBuyPercentage}
        setFirstBuyPercentage={setFirstBuyPercentage}
        devPercentage={devPercentage}
        setDevPercentage={setDevPercentage}
      />
      <RemoveFees
        token={selectedToken}
        isTokensSentToReferral={isTokensSentToReferral}
        firstBuyPercentage={firstBuyPercentage}
        referrerPercentage={referrerPercentage}
        isLoading={isLoading}
        setIsReferralContractRemovedFromFees={setIsReferralContractRemovedFromFees}
        pairAddress={pairAddress}
      />
      <Submit
        token={selectedToken}
        isTokensSentToReferral={isTokensSentToReferral}
        firstBuyPercentage={firstBuyPercentage}
        referrerPercentage={referrerPercentage}
        devPercentage={devPercentage}
        isReferralContractRemovedFromFees={isReferralContractRemovedFromFees}
        isLoading={isLoading}
        pairAddress={pairAddress}
        fetchUserLocked={fetchUserLocked}
        setIsLoading={setIsLoading}
      />
    </div>
  )
}
