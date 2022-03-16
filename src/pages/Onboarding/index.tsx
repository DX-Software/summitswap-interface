import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TokenDropdown from 'components/TokenDropdown'
import { Token, WETH } from '@koda-finance/summitswap-sdk'
import { Link } from 'react-router-dom'
import { Button, Checkbox, Flex, Input, Text, useModal, useWalletModal } from '@koda-finance/summitswap-uikit'
import { useFactoryContract, useLockerContract, useTokenContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import axios from 'axios'
import { TranslateString } from 'utils/translateTextHelpers'
import login from 'utils/login'
import DatePicker from '@mui/lab/DatePicker'
import { TextField } from '@mui/material'
import { addYears, subDays } from 'date-fns/esm'
import {
  CHAIN_ID,
  LOCKER_ADDRESS,
  MAX_UINT256,
  MINIMUM_BNB_FOR_ONBOARDING,
  NULL_ADDRESS,
  ONBOARDING_API,
  REFERRAL_ADDRESS,
} from '../../constants'
import SuccessModal from './SuccessModal'
import './styles.css'

const minimumUnlockDate = subDays(addYears(Date.now(), 1), 1)

interface ILpLock {
  lock: any
  lockId: number
}

// TODO add token as a path parameter
// TODO check if enough liquidity is locked
export default function CrossChainSwap() {
  const { account, activate, deactivate, library } = useWeb3React()
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [pairAddress, setPairAddress] = useState<string>()

  const [isLoading, setIsLoading] = useState(false)

  const [isEnoughBnbInPool, setIsEnoughBnbInPool] = useState(false)
  const [isLiquidityApproved, setIsLiquidityApproved] = useState(false)
  const [isLiquidityLocked, setIsLiquidityLocked] = useState(false)
  const [isTokensInReferral, setIsTokensInReferral] = useState(false)
  const [isReferralContractRemovedFromFees, setIsReferralContractRemovedFromFees] = useState(false)

  const [selectedUnlockDate, setSelectedUnlockDate] = useState<Date | null>(addYears(Date.now(), 1))
  const [referralRewardAmount, setReferralRewardAmount] = useState<string>()
  const [referrerPercentage, setReferrerPercentage] = useState<string>()
  const [firstBuyPercentage, setFirstBuyPercentage] = useState<string>()

  const factoryContract = useFactoryContract()
  const lockerContract = useLockerContract(true)
  const lpContract = useTokenContract(pairAddress)
  const tokenContract = useTokenContract(selectedToken?.address, true)
  const wbnbContract = useTokenContract(WETH[CHAIN_ID].address)

  const isSelectedDateGood = useMemo(() => {
    if (!selectedUnlockDate) return false

    return selectedUnlockDate > minimumUnlockDate
  }, [selectedUnlockDate])

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const [displaySucessModal] = useModal(<SuccessModal title="Success" />)

  useEffect(() => {
    async function fetchIfReferralHasSomeBalance() {
      if (!tokenContract) return

      const referralBalance = (await tokenContract.balanceOf(REFERRAL_ADDRESS)) as BigNumber

      setIsTokensInReferral(!referralBalance.isZero())
    }

    fetchIfReferralHasSomeBalance()
  }, [tokenContract])

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
    ).then((locks) => locks.filter(Boolean))) as ILpLock[]

    const totalAmountOfLpLocked = fetchedLpLocks.reduce(
      (acc, cur) => acc.add(cur.lock.tokenAmount),
      BigNumber.from(0)
    ) as BigNumber

    setIsLiquidityLocked(!totalAmountOfLpLocked.isZero())

    return { fetchedLpLocks, totalAmountOfLpLocked }
  }, [tokenContract, lockerContract, account, pairAddress])

  useEffect(() => {
    fetchUserLocked()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenContract, lockerContract, account, pairAddress, isLiquidityLocked])

  useEffect(() => {
    async function fetchUserApproved() {
      if (!lpContract || !account) return

      const userBalance = (await lpContract.balanceOf(account)) as BigNumber

      const userApprovedAlready = (await lpContract.allowance(account, LOCKER_ADDRESS)) as BigNumber

      setIsLiquidityApproved(userApprovedAlready.gte(userBalance))
    }

    fetchUserApproved()
  }, [account, lpContract])

  useEffect(() => {
    async function fetchBnbBalance() {
      if (!tokenContract || !wbnbContract || !pairAddress) {
        setIsEnoughBnbInPool(false)
        return
      }

      const wbnbBalance = (await wbnbContract.balanceOf(pairAddress)) as BigNumber

      setIsEnoughBnbInPool(wbnbBalance.gte(ethers.utils.parseUnits(`${MINIMUM_BNB_FOR_ONBOARDING}`)))
    }

    fetchBnbBalance()
  }, [pairAddress, tokenContract, wbnbContract])

  useEffect(() => {
    async function fetchPair() {
      if (!selectedToken || !factoryContract) {
        setPairAddress(undefined)
        return
      }

      const fetchedPair = (await factoryContract.getPair(WETH[CHAIN_ID].address, selectedToken.address)) as string

      if (fetchedPair === NULL_ADDRESS) {
        setPairAddress(undefined)
      } else {
        setPairAddress(fetchedPair)
      }
    }

    fetchPair()
  }, [selectedToken, factoryContract])

  const handleTokenSelect = useCallback((inputCurrency) => {
    setSelectedToken(inputCurrency)
  }, [])

  const lockLiquidity = useCallback(() => {
    async function lock() {
      if (!lpContract || !account || !lockerContract || !library || !selectedUnlockDate) {
        setIsLiquidityLocked(false)
        return
      }

      const lpBalance = (await lpContract.balanceOf(account).then((o) => o.toString())) as string

      const receipt = await lockerContract.lockTokens(
        lpContract.address,
        lpBalance,
        Math.floor(selectedUnlockDate.valueOf() / 1000),
        account,
        '2' // Fee type
      )

      setIsLoading(true)
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)

      setIsLiquidityLocked(true)
    }

    lock()
  }, [lpContract, account, lockerContract, library, selectedUnlockDate])

  const approveLiquidity = useCallback(() => {
    async function approve() {
      if (!lpContract || !account || !lockerContract || !library) {
        setIsLiquidityApproved(false)
        return
      }

      const receipt = await lpContract.approve(lockerContract.address, MAX_UINT256)

      setIsLoading(true)
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)

      setIsLiquidityApproved(true)
    }

    approve()
  }, [lpContract, account, lockerContract, library])

  const sendTokensToReferralContract = useCallback(() => {
    async function send() {
      if (!tokenContract || !referralRewardAmount || !library) {
        setIsTokensInReferral(false)
        return
      }

      if (parseInt(referralRewardAmount) <= 0) {
        return
      }

      const receipt = await tokenContract.transfer(REFERRAL_ADDRESS, ethers.utils.parseEther(referralRewardAmount))

      setIsLoading(true)
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)

      setIsTokensInReferral(true)
    }

    send()
  }, [tokenContract, referralRewardAmount, library])

  const submit = useCallback(() => {
    async function submitToken() {
      if (!firstBuyPercentage || !referrerPercentage || !selectedToken || !pairAddress || !account) {
        return
      }

      const { fetchedLpLocks, totalAmountOfLpLocked } = await fetchUserLocked()

      await axios.post(ONBOARDING_API, {
        message: `
          Token: ${selectedToken.address}
          %0AUser: ${account}
          %0APair: ${pairAddress}
          %0ALockIds: ${fetchedLpLocks?.map((o) => o.lockId)}
          %0ATotalLocked: ${totalAmountOfLpLocked}
          %0AReferrer Fee: ${referrerPercentage}
          %0AFirst Buy Fee: ${firstBuyPercentage}`,
      })

      displaySucessModal()
    }

    submitToken()
  }, [firstBuyPercentage, referrerPercentage, selectedToken, pairAddress, fetchUserLocked, account, displaySucessModal])

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
          <p className="paragraph">Select your token</p>
          <TokenDropdown
            onCurrencySelect={handleTokenSelect}
            selectedCurrency={selectedToken}
            showETH={false}
            showOnlyUnknownTokens
          />
        </>
      )}
      <h3>Requirements:</h3>
      <p className="paragraph">
        1. Add liquidity on <b>BNB/{selectedToken?.symbol ?? 'YOUR COIN'}</b>. Suggest minimum{' '}
        <b>{MINIMUM_BNB_FOR_ONBOARDING} BNB</b>. This will be used to pair with the native token
      </p>
      {selectedToken && account ? (
        <>
          <Button as={Link} to={`/add/ETH/${selectedToken?.address}`} disabled={isLoading}>
            Add Liquidity
          </Button>
          <p className="paragraph">
            {!lpContract && <Text color="red">❌ Pair not found, please add liquidity first</Text>}
            {!isEnoughBnbInPool && lpContract && <Text color="red">❌ Not enough liquidity, please add more</Text>}
            {isEnoughBnbInPool && <Text color="primary">✅ There are enough liquidity</Text>}
          </p>
        </>
      ) : (
        <></>
      )}
      <p className="paragraph">2. Lock your liquidity for 1 year</p>
      {selectedToken && account ? (
        <>
          <DatePicker
            label="Unlock date"
            disabled={!isEnoughBnbInPool || isLoading}
            value={selectedUnlockDate}
            onChange={(newValue: Date | null) => {
              setSelectedUnlockDate(newValue)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          &nbsp;
          {!isLiquidityApproved && (
            <>
              <Button disabled={!isEnoughBnbInPool || isLoading} onClick={approveLiquidity}>
                Approve Liquidity
              </Button>
              &nbsp;
            </>
          )}
          <Button
            disabled={!isEnoughBnbInPool || !isLiquidityApproved || !isSelectedDateGood || isLoading}
            onClick={lockLiquidity}
          >
            Lock Liquidity
          </Button>
          {!isSelectedDateGood && <Text color="red">❌ Please select unlock date minimum 1 year from now</Text>}
          {isLiquidityLocked && <Text color="primary">✅ Liquidity is locked already</Text>}
        </>
      ) : (
        <></>
      )}
      <p className="paragraph">
        3. Send some of <b>{selectedToken?.symbol ?? 'YOUR TOKEN'}</b> to the referral contract for referral rewards
        <br />
        (Up to you how much but each time you load it you can use as a bit of a PR stunt to the community - Note: these
        tokens are unrecoverable other than through referral scheme)
        {selectedToken && account ? (
          <>
            <Input
              disabled={!isLiquidityLocked || isLoading}
              type="number"
              placeholder="Enter token amount"
              onChange={(o) => setReferralRewardAmount(o.target.value)}
              style={{ marginTop: '10px', marginBottom: '10px' }}
            />
            <Button
              disabled={!isLiquidityLocked || isLoading || (parseInt(referralRewardAmount ?? '') || 0) <= 0}
              onClick={sendTokensToReferralContract}
            >
              Transfer
            </Button>
            <p className="paragraph">
              {!(parseInt(referralRewardAmount ?? '') > 0) && isLiquidityLocked && (
                <Text color="red">❌ Please enter positive number</Text>
              )}
              {isLiquidityLocked && isTokensInReferral && (
                <Text color="primary">✅ Reward tokens are in referral contract</Text>
              )}
            </p>
          </>
        ) : (
          <></>
        )}
      </p>
      <p className="paragraph">
        4. Specify details
        <p className="paragraph">
          How much % do you want the referrers to earn?
          {selectedToken && account ? (
            <>
              <Input
                disabled={!isTokensInReferral || isLoading}
                type="number"
                placeholder="Referrer %"
                onChange={(o) => setReferrerPercentage(o.target.value)}
                style={{ marginTop: '10px', marginBottom: '10px' }}
              />
              {!(parseInt(referrerPercentage ?? '') > 0) && isTokensInReferral && (
                <Text color="red">❌ Please enter positive number</Text>
              )}
            </>
          ) : (
            <></>
          )}
        </p>
        <p className="paragraph">
          How much % do you want the referees to earn on their first buy?
          {selectedToken && account ? (
            <>
              <Input
                disabled={!isTokensInReferral || isLoading}
                type="number"
                placeholder="First buy referree %"
                onChange={(o) => setFirstBuyPercentage(o.target.value)}
                style={{ marginTop: '10px', marginBottom: '10px' }}
              />
              {!(+(firstBuyPercentage ?? '') > 0) && isTokensInReferral && (
                <Text color="red">❌ Please enter positive number</Text>
              )}
            </>
          ) : (
            <></>
          )}
        </p>
      </p>
      <p className="paragraph">
        5. If your token has fees remove referral contract from them
        <br />
        <b>Referral contract - {REFERRAL_ADDRESS}</b>
        {selectedToken && account && (
          <p className="paragraph">
            <Checkbox
              id="agree"
              scale="sm"
              disabled={!isTokensInReferral || !firstBuyPercentage || !referrerPercentage || isLoading}
              defaultChecked={isReferralContractRemovedFromFees}
              onChange={(o) => setIsReferralContractRemovedFromFees(o.target.checked)}
            />
            &nbsp; If token transfer fees exist, I confirm that referral contract is excluded
          </p>
        )}
      </p>
      {selectedToken && account ? (
        <Button
          disabled={
            !isTokensInReferral ||
            !firstBuyPercentage ||
            !referrerPercentage ||
            !isReferralContractRemovedFromFees ||
            isLoading ||
            +(firstBuyPercentage ?? '') <= 0 ||
            +(referrerPercentage ?? '') <= 0
          }
          onClick={submit}
        >
          Submit
        </Button>
      ) : (
        <></>
      )}

      <p className="paragraph">
        Once set up we will announce to our community that you are listed and that you are offering X referral scheme
        through our own referral link.
      </p>
      <p className="paragraph">
        <b>Future actions:</b>
        <p className="paragraph">
          ⦁ Set up influencers as required. (Further explanation will be required after you have successfully launched
          on SummitSwap).
        </p>
      </p>
    </div>
  )
}
