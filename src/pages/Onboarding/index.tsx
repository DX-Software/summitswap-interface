import React, { useCallback, useEffect, useState } from 'react'
import TokenDropdown from 'components/TokenDropdown'
import { Token, WETH } from '@koda-finance/summitswap-sdk'
import { Link } from 'react-router-dom'
import { Button } from '@koda-finance/summitswap-uikit'
import { useFactoryContract } from 'hooks/useContract'
import { CHAIN_ID } from '../../constants'

// TODO fix searching for uknown token
export default function CrossChainSwap() {
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [pair, setPair] = useState<string>()

  const factory = useFactoryContract()

  useEffect(() => {
    async function fetchPair() {
      if (!selectedToken || !factory) {
        setPair(undefined)
        return
      }

      const fetchedPair = await factory.getPair(WETH[CHAIN_ID].address, selectedToken.address)

      setPair(fetchedPair)
    }

    fetchPair()
  }, [selectedToken, factory])

  const handleTokenSelect = useCallback((inputCurrency) => {
    setSelectedToken(inputCurrency)
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
      <p className="paragraph">2. Lock that liquidity for minimum 12 months, send us locking transaction</p>
      {/* {pair} */}
      <p className="paragraph">
        3. Some END tokens sent to the referral contract as rewards,
        <br />
        Referral contract - 0x7c63e26049FA5620FB3555e2f5B53b3b756B5919
        <br />
        (Up to you how much but each time you load it you can use as a bit of a PR stunt to the community- Note: these
        tokens are unrecoverable other than through referral scheme)
      </p>
      <p className="paragraph">
        4. Remove from fee our referral contract and price levelling bot.
        <br />
        Referral contract - 0x7c63e26049FA5620FB3555e2f5B53b3b756B5919
        <br />
        Price Bot - 0x709bF4aC7ED6Bb2F9d60b1215d983496AB68efbc (Temporary, will nee to be changed at some point as we
        are upgrading it)
      </p>
      <p className="paragraph">
        5.
        <ul>
          <li>How much % do you want the referrers to earn?</li>
          <li>How much % do you want the referees to earn on their first buy?</li>
        </ul>
      </p>
      <p className="paragraph">
        Once set up we will announce to our community that you are listed and that you are offering X referral scheme
        through our own referral link. Future actions, ⦁ Set up influencers as required. (Further explanation will be
        required after you have successfully launched on SummitSwap).
      </p>
    </div>
  )
}
