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

// TODO check if enough liquidity is locked
// TODO check shared tokendropdown
export default function CrossChainSwap() {
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

  const factoryContract = useFactoryContract()
  const tokenContract = useTokenContract(selectedToken?.address, true)
  const kodaConctract = useTokenContract(KODA.address, true)
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
    } else {
      history.push({ search: `` })
    }
  }, [history, selectedToken])

  useEffect(() => {
    if (tokenFromUrl) {
      setSelectedToken(tokenFromUrl)
    }
  }, [tokenFromUrl])

  useEffect(() => {
    async function fetchPair() {
      if (!selectedToken || !factoryContract) {
        await Promise.resolve()
        setPairAddress(undefined)
        return
      }

      const fetchedPairAddress = (await factoryContract.getPair(KODA.address, selectedToken.address)) as string

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
      if (!tokenContract || !kodaConctract || !pairAddress) {
        await Promise.resolve()
        setIsEnoughLiquidity(false)
        return
      }

      const kodaBalanceOfPair = (await kodaConctract.balanceOf(pairAddress)) as BigNumber

      setIsEnoughLiquidity(!kodaBalanceOfPair.isZero())
    }

    fetchLiquidity()
  }, [pairAddress, tokenContract, kodaConctract])

  // useEffect(() => {
  //   async function fetchIfReferralHasSomeBalance() {
  //     if (!tokenContract) return

  //     const referralBalance = (await tokenContract.balanceOf(REFERRAL_ADDRESS)) as BigNumber

  //     setIsTokensInReferral(!referralBalance.isZero())
  //   }

  //   fetchIfReferralHasSomeBalance()
  // }, [tokenContract])

  // useEffect(() => {
  //   fetchUserLocked()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tokenContract, lockerContract, account, pairAddress, isLiquidityLocked])

  // useEffect(() => {
  //   async function fetchUserApproved() {
  //     if (!lpContract || !account) return

  //     const userBalance = (await lpContract.balanceOf(account)) as BigNumber

  //     const userApprovedAlready = (await lpContract.allowance(account, LOCKER_ADDRESS)) as BigNumber

  //     setIsLiquidityApproved(userApprovedAlready.gte(userBalance))
  //   }

  //   fetchUserApproved()
  // }, [account, lpContract])

  const fetchUserLocked = useCallback(async () => {
    if (!tokenContract || !lockerContract || !account || !pairAddress) {
      setIsLiquidityLocked(false)
      return { lpLockfetchedLpLockss: undefined, totalAmountOfLpLocked: undefined }
    }

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

    setIsLiquidityLocked(!totalAmountOfLpLocked.isZero())

    return { fetchedLpLocks, totalAmountOfLpLocked }
  }, [tokenContract, lockerContract, account, pairAddress])

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
        isReferralContractRemovedFromFees={isReferralContractRemovedFromFees}
        isLoading={isLoading}
        pairAddress={pairAddress}
        fetchUserLocked={fetchUserLocked}
        setIsLoading={setIsLoading}
      />
    </div>
  )
}
