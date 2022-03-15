import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TokenDropdown from 'components/TokenDropdown'
import { Token, WETH } from '@koda-finance/summitswap-sdk'
import { Link } from 'react-router-dom'
import { Button, Flex, Input, useWalletModal } from '@koda-finance/summitswap-uikit'
import { useFactoryContract, useLockerContract, useTokenContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import axios from 'axios'
import { TranslateString } from 'utils/translateTextHelpers'
import login from 'utils/login'
import {
  CHAIN_ID,
  LOCKER_ADDRESS,
  MAX_UINT256,
  MINIMUM_BNB_FOR_ONBOARDING,
  NULL_ADDRESS,
  ONBOARDING_API,
  REFERRAL_ADDRESS,
} from '../../constants'

// TODO add date picker for locking
// TODO add token as a path parameter
// TODO check if enough liquidity is locked
// TODO fix input negative values
export default function CrossChainSwap() {
  const { account, library, activate, deactivate } = useWeb3React()
  const [tokenAddress, setSelectedToken] = useState<Token>()
  const [pairAddress, setPairAddress] = useState<string>()

  const [isEnoughBnbInPool, setIsEnoughBnbInPool] = useState(false)
  const [isLiquidityApproved, setIsLiquidityApproved] = useState(false)
  const [isLiquidityLocked, setIsLiquidityLocked] = useState(false)
  const [isTokensInReferral, setIsTokensInReferral] = useState(false)

  const [referralRewardAmount, setReferralRewardAmount] = useState<string>()
  const [referrerPercentage, setReferrerPercentage] = useState<string>()
  const [firstBuyPercentage, setFirstBuyPercentage] = useState<string>()

  const factoryContract = useFactoryContract()
  const lockerContract = useLockerContract(true)
  const lpContract = useTokenContract(pairAddress)
  const tokenContract = useTokenContract(tokenAddress?.address, true)

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  useEffect(() => {
    async function fetchIfReferralHasSomeBalance() {
      if (!tokenContract) return

      const referralBalance = (await tokenContract.balanceOf(REFERRAL_ADDRESS)) as BigNumber

      setIsTokensInReferral(!referralBalance.isZero())
    }

    fetchIfReferralHasSomeBalance()
  }, [tokenContract])

  useEffect(() => {
    async function fetchUserLocked() {
      if (!tokenContract) return
      if (!lockerContract) return
      if (!account) return
      if (!pairAddress) return

      const userLocksLength = (await lockerContract.userLocksLength(account).then((o) => o.toNumber())) as number

      const totalAmountOfLpLocked = (await Promise.all(
        [...Array(userLocksLength).keys()].map(async (userLockId) => {
          const lockId = await lockerContract.userLockAt(account, userLockId)
          const lock = await lockerContract.tokenLocks(lockId)

          return lock.lpToken === pairAddress ? lock : undefined
        })
      )
        .then((locks) => locks.filter(Boolean))
        .then((locks) => locks.reduce((acc, cur) => acc.add(cur.tokenAmount), BigNumber.from(0)))) as BigNumber

      setIsLiquidityLocked(!totalAmountOfLpLocked.isZero())
    }

    fetchUserLocked()
  }, [tokenContract, lockerContract, account, pairAddress])

  useEffect(() => {
    async function fetchUserApproved() {
      if (!lpContract) return

      const userBalance = (await lpContract.balanceOf(account)) as BigNumber

      const userApprovedAlready = (await lpContract.allowance(account, LOCKER_ADDRESS)) as BigNumber

      setIsLiquidityApproved(userApprovedAlready.gte(userBalance))
    }

    fetchUserApproved()
  }, [account, lpContract])

  useEffect(() => {
    async function fetchBnbBalance() {
      if (!pairAddress) return
      if (!tokenContract) return
      if (!library) return

      const bnbBalance = (await library.getBalance(pairAddress)) as BigNumber

      setIsEnoughBnbInPool(bnbBalance.gte(ethers.utils.parseUnits(`${MINIMUM_BNB_FOR_ONBOARDING}`)))
    }

    fetchBnbBalance()
  }, [library, pairAddress, tokenContract])

  useEffect(() => {
    async function fetchPair() {
      if (!tokenAddress || !factoryContract) {
        setPairAddress(undefined)
        return
      }

      const fetchedPair = (await factoryContract.getPair(WETH[CHAIN_ID].address, tokenAddress.address)) as string

      if (fetchedPair === NULL_ADDRESS) {
        setPairAddress(undefined)
      } else {
        setPairAddress(fetchedPair)
      }
    }

    fetchPair()
  }, [tokenAddress, factoryContract])

  const handleTokenSelect = useCallback((inputCurrency) => {
    setSelectedToken(inputCurrency)
  }, [])

  const lockLiquidity = useCallback(() => {
    async function lock() {
      if (!lpContract) return
      if (!account) return
      if (!lockerContract) return

      const lpBalance = (await lpContract.balanceOf(account).then((o) => o.toString())) as string

      const unlockDate = new Date()

      unlockDate.setFullYear(unlockDate.getFullYear() + 1)

      await lockerContract.lockTokens(
        lpContract.address,
        lpBalance,
        Math.floor(unlockDate.valueOf() / 1000),
        account,
        '2'
      )

      setIsLiquidityLocked(true)
    }

    lock()
  }, [lpContract, account, lockerContract])

  const approveLiquidity = useCallback(() => {
    async function approve() {
      if (!lpContract) return
      if (!account) return
      if (!lockerContract) return

      await lpContract.approve(lockerContract.address, MAX_UINT256)

      setIsLiquidityApproved(true)
    }

    approve()
  }, [lpContract, account, lockerContract])

  const sendTokensToReferralContract = useCallback(() => {
    async function send() {
      if (!tokenContract) return
      if (!referralRewardAmount) return

      await tokenContract.transfer(REFERRAL_ADDRESS, ethers.utils.parseEther(referralRewardAmount))

      setIsTokensInReferral(true)
    }

    send()
  }, [tokenContract, referralRewardAmount])

  const submit = useCallback(() => {
    async function submitToken() {
      if (!firstBuyPercentage) return
      if (!referrerPercentage) return
      if (!tokenContract) return

      await axios.post(ONBOARDING_API, {
        message: `
          ✅%0AToken: ${tokenContract?.address}.%0AReferrer Fee: ${referrerPercentage}.%0AFirst Buy Fee: ${firstBuyPercentage}`,
      })
    }

    submitToken()
  }, [firstBuyPercentage, referrerPercentage, tokenContract])

  return (
    <div className="main-content">
      {!account && (
        <Flex mb={3} justifyContent="center">
          <Button style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
            {TranslateString(292, 'CONNECT WALLET')}
          </Button>
        </Flex>
      )}
      {account && (
        <>
          <p className="paragraph">Select your token</p>
          <TokenDropdown
            onCurrencySelect={handleTokenSelect}
            selectedCurrency={tokenAddress}
            showETH={false}
            showOnlyUnknownTokens
          />
        </>
      )}
      <h3>Requirements:</h3>
      <p className="paragraph">
        1. Add liquidity on <b>BNB/{tokenAddress?.symbol ?? 'YOUR COIN'}</b>. Suggest minimum <b>75 BNB</b>. This will
        be used to pair with the native token
      </p>
      {tokenAddress ? (
        <>
          <Button as={Link} to={`/add/ETH/${tokenAddress?.address}`}>
            Add Liquidity
          </Button>
          <p className="paragraph">
            {!lpContract && <p className="paragraph">❌ Pair not found, please add liquidity first</p>}
            {!isEnoughBnbInPool && lpContract && <p className="paragraph">❌ Not enough liquidity, please add more</p>}
            {isEnoughBnbInPool && <p className="paragraph">✅ There are enough liquidity</p>}
          </p>
        </>
      ) : (
        <></>
      )}
      <p className="paragraph">2. Lock your liquidity for 1 year</p>
      {tokenAddress ? (
        <>
          {!isLiquidityApproved && (
            <>
              <Button disabled={!isEnoughBnbInPool} onClick={approveLiquidity}>
                Approve Liquidity
              </Button>
              &nbsp;
            </>
          )}
          <Button disabled={!isEnoughBnbInPool} onClick={lockLiquidity}>
            Lock Liquidity
          </Button>
          {isLiquidityLocked && <p className="paragraph">✅ Liquidity is locked already</p>}
        </>
      ) : (
        <></>
      )}
      <p className="paragraph">
        3. Send some of <b>{tokenAddress?.symbol ?? 'YOUR TOKEN'}</b> to the referral contract for referral rewards
        <br />
        (Up to you how much but each time you load it you can use as a bit of a PR stunt to the community - Note: these
        tokens are unrecoverable other than through referral scheme)
        {tokenAddress ? (
          <>
            <Input
              disabled={!isLiquidityLocked}
              type="number"
              placeholder="Enter token amount"
              onChange={(o) => setReferralRewardAmount(o.target.value)}
              style={{ marginTop: '10px', marginBottom: '10px' }}
            />
            <Button disabled={!isLiquidityLocked} onClick={sendTokensToReferralContract}>
              Transfer
            </Button>
            {isLiquidityLocked && isTokensInReferral && (
              <p className="paragraph">✅ Reward tokens are in referral contract</p>
            )}
          </>
        ) : (
          <></>
        )}
      </p>
      <p className="paragraph">
        4. Specify details
        <ul>
          <li>
            How much % do you want the referrers to earn?
            {tokenAddress ? (
              <Input
                disabled={!isTokensInReferral}
                type="number"
                placeholder="Referrer %"
                onChange={(o) => setReferrerPercentage(o.target.value)}
                style={{ marginTop: '10px', marginBottom: '10px' }}
              />
            ) : (
              <></>
            )}
          </li>
          <li>
            How much % do you want the referees to earn on their first buy?
            {tokenAddress ? (
              <Input
                disabled={!isTokensInReferral}
                type="number"
                placeholder="First buy referree %"
                onChange={(o) => setFirstBuyPercentage(o.target.value)}
                style={{ marginTop: '10px', marginBottom: '10px' }}
              />
            ) : (
              <></>
            )}
          </li>
        </ul>
      </p>
      <p className="paragraph">
        5. If your token has fees remove referral contract from them
        <br />
        <b>Referral contract - {REFERRAL_ADDRESS}</b>
      </p>
      {tokenAddress ? (
        <Button disabled={!isTokensInReferral || !referralRewardAmount || !referrerPercentage} onClick={submit}>
          Submit
        </Button>
      ) : (
        <></>
      )}

      <p className="paragraph">
        Once set up we will announce to our community that you are listed and that you are offering X referral scheme
        through our own referral link. Future actions, ⦁ Set up influencers as required. (Further explanation will be
        required after you have successfully launched on SummitSwap).
      </p>
    </div>
  )
}
