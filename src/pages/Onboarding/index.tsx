import TokenDropdown from 'components/TokenDropdown'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import AppBody from '../AppBody'
// import AddLiquidity from '../AddLiquidity'

export default function CrossChainSwap() {
  return (
    <div className="main-content">
      <p className="paragraph">Select your token</p>
      {/* <TokenDropdown/> */}
      <h3>Requirements:</h3>
      <p className="paragraph">
        1. BNB to buy the liquidity. Suggest minimum £25k. This will be used to pair with the native token. (You can
        always add extra liquidity in the future).
      </p>
      {/* <AddLiquidity/> */}
      <p className="paragraph">
        2. You lock that liquidity for minimum 12 months, send us locking transaction. - I can help or do this for you
        if you don&apos;t know how.
      </p>
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
