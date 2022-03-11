import React, { useCallback, useEffect, useState } from 'react'
import TokenDropdown from 'components/TokenDropdown'
import { Token, WETH } from '@koda-finance/summitswap-sdk'
import { Link } from 'react-router-dom'
import { Button, Input } from '@koda-finance/summitswap-uikit'
import { useFactoryContract, useLockerContract, useReferralContract, useTokenContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { CHAIN_ID, MAX_UINT256, REFERRAL_ADDRESS } from '../../constants'

// TODO fix searching for uknown token
// TODO add date picker for locking
export default function CrossChainSwap() {
  const { account } = useWeb3React()
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [pairAddress, setPairAddress] = useState<string>()
  const [referralRewardAmount, setReferralRewardAmount] = useState<string>()
  const [referrerPercentage, setReferrerPercentage] = useState<string>()
  const [firstBuyPercentage, setFirstBuyPercentage] = useState<string>()

  const factoryContract = useFactoryContract()
  const lockerContract = useLockerContract(true)
  const lpContract = useTokenContract(pairAddress)
  const tokenContract = useTokenContract(selectedToken?.address)

  useEffect(() => {
    async function fetchPair() {
      if (!selectedToken || !factoryContract) {
        setPairAddress(undefined)
        return
      }

      const fetchedPair = await factoryContract.getPair(WETH[CHAIN_ID].address, selectedToken.address)

      setPairAddress(fetchedPair)
    }

    fetchPair()
  }, [selectedToken, factoryContract])

  const handleTokenSelect = useCallback((inputCurrency) => {
    setSelectedToken(inputCurrency)
  }, [])

  const lockLiquidity = useCallback(() => {
    async function lock() {
      if (!lpContract) return
      if (!account) return
      if (!lockerContract) return

      const lpBalance = (await lpContract.balanceOf(account).then((o) => o.toString())) as string

      await lockerContract.lockTokens(lpContract.address, lpBalance, '1646997906', account, '2')
    }

    lock()
  }, [lpContract, account, lockerContract])

  const approveLiquidity = useCallback(() => {
    async function approve() {
      if (!lpContract) return
      if (!account) return
      if (!lockerContract) return

      await lpContract.approve(lockerContract.address, MAX_UINT256)
    }

    approve()
  }, [lpContract, account, lockerContract])

  const sendTokensToReferralContract = useCallback(() => {
    async function send() {
      if (!tokenContract) return
      if (!referralRewardAmount) return

      await tokenContract.transfer(REFERRAL_ADDRESS, ethers.utils.parseEther(referralRewardAmount))
    }

    send()
  }, [tokenContract, referralRewardAmount])

  const submit = useCallback(() => {
    console.log('a')
  }, [])

  return (
    <div className="main-content">
      <p className="paragraph">Select your token</p>
      <TokenDropdown
        onCurrencySelect={handleTokenSelect}
        selectedCurrency={selectedToken}
        showETH={false}
        showUnknownTokens={false}
        showOnlyUnknownTokens
      />
      <h3>Requirements:</h3>
      <p className="paragraph">
        1. Add liquidity on <b>BNB/{selectedToken?.symbol ?? 'YOUR COIN'}</b>. Suggest minimum £25k. This will be used
        to pair with the native token
      </p>
      {selectedToken ? (
        <Button as={Link} to={`/add/ETH/${selectedToken?.address}`}>
          Add Liquidity
        </Button>
      ) : (
        <></>
      )}
      <p className="paragraph">2. Lock your liquidity for minimum 12 months</p>
      {selectedToken ? (
        pairAddress ? (
          <>
            <Button onClick={approveLiquidity}>Approve Liquidity</Button>
            <Button onClick={lockLiquidity}>Lock Liquidity</Button>
          </>
        ) : (
          <p>Pair not found, please add liquidity first</p>
        )
      ) : (
        <></>
      )}
      <p className="paragraph">
        3. Send some of <b>{selectedToken?.symbol ?? 'YOUR TOKEN'}</b> to the referral contract for referral rewards
        <br />
        (Up to you how much but each time you load it you can use as a bit of a PR stunt to the community - Note: these
        tokens are unrecoverable other than through referral scheme)
        {selectedToken ? (
          <>
            <Input
              type="number"
              placeholder="Enter token amount"
              onChange={(o) => setReferralRewardAmount(o.target.value)}
              style={{ marginTop: '10px', marginBottom: '10px' }}
            />
            <Button onClick={sendTokensToReferralContract}>Transfer</Button>
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
            {selectedToken ? (
              <Input
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
            {selectedToken ? (
              <Input
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
      {selectedToken ? (<Button onClick={submit}>Submit</Button>) : (<></>)}
      
      <p className="paragraph">
        Once set up we will announce to our community that you are listed and that you are offering X referral scheme
        through our own referral link. Future actions, ⦁ Set up influencers as required. (Further explanation will be
        required after you have successfully launched on SummitSwap).
      </p>
    </div>
  )
}
