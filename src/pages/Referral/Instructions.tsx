import React from 'react'

import './style.css'

interface InstructionsProps {
	referalLinkImage: string;
	inviteImage: string;
	coinStackImage: string;
}

const Instructions: React.FC<InstructionsProps> = ({ referalLinkImage: ReferalLinkImage, inviteImage: InviteImage, coinStackImage: CoinStackImage }) => {

	return <>
		<div className="invite-friends-area">
			<h2 className="float-title">How to invite friends</h2>

			<div className="clear" />

			<div className="friends-box">
				<span className="number-circle">1</span>

				<div className="align-center">
					<img src={ReferalLinkImage} alt="Referral Link" />
				</div>

				<h3>Get Referral Link</h3>

				<p className="max-width-90">Connect your wallet to generate your referral link above</p>
			</div>

			<div className="friends-box">
				<span className="number-circle">2</span>

				<div className="align-center">
					<img src={InviteImage} alt="Invite" />
				</div>

				<h3>Invite</h3>

				<p>Share referral link of your favourite projects to your community, friends and family.</p>
			</div>

			<div className="friends-box no-margin-right">
				<span className="number-circle">3</span>

				<div className="align-center">
					<img src={CoinStackImage} alt="Earn Crypto" />
				</div>

				<h3>Earn Crypto</h3>

				<p>Earn Tokens Get rewards for every one of your friends buys forever.*</p>
			</div>

			<div className="clear" />
		</div>

		<div className="reward-section font-15">
			<p>Reward options - Receive your rewards in:</p>
			<p>
				<br />
				A) The projects tokens <br />
				B) Convert it to BNB or BUSD (10% - 15% fees respectively)
			</p>
		</div>

		<p className="paragraph">
			Known as the trusted swap site, SummitSwap offers its user base many advantages over alternatives. One of these
			features is a unique referral system that allows tokens to reward their communities whilst growing their
			projects.
		</p>

		<p className="paragraph">
			<u>How does it work from a user perspective?</u>
		</p>

		<p className="paragraph">All you need to do is send the referral link above to a future user.</p>

		<p className="paragraph">
			*Our referrals are FOREVER referrals, this means that if you have already been referred to us by someone, they
			will earn commissions forever, providing the project pairing continues to support it.
		</p>

		<p className="paragraph">Please note: The referral fees are only applicable to projects that have this set up.</p>

		<p className="paragraph">
			<u>How does it work from a Team/Project/Token Perspective?</u>
		</p>

		<p className="paragraph">
			Step 1: A project must be whitelisted with SummitSwap. This means they submit their token details for a manual
			check, to prove they are trustworthy and allow SummitSwap to show this information as part of our SummitCheck
			whitelisting system.
		</p>

		<p className="paragraph">The token will then have the logo shown and you can search for it by name.</p>

		<p className="paragraph">
			Step 2: Project decides that they will run a referral promotion. The project can reward their users any
			percentage on just buys of their token when they purchase through SummitSwap on specific pairings. For example,
			TOKEN-EG / BNB pairing. They then set the percentage, for example 1%.
		</p>

		<p className="paragraph">
      The project can either fund the rewards with KODA our native token, or they can feed their own token to the reward pool.
      This means the referrer can earn either KODA or TOKEN-EG.
		</p>

		<p className="paragraph">
      The project may choose to remove fees from the reward pool contract so that rewards are paid in full to thier loyal community.
      Although our native investment token KODA does this, please note that every project will have their own set up and may choose to keep the transactions with fees included.
      You can find out this information on their whitelisting project profile through SummitCheck.
		</p>
	</>
}

export default Instructions
