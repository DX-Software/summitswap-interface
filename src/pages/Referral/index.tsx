import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Token } from '@summitswap-libs'
import { Text, Box, Button, useWalletModal, Flex } from '@summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import _ from 'lodash'
import { Event } from 'ethers'

import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { TranslateString } from 'utils/translateTextHelpers'
import { useAllTokens } from 'hooks/Tokens'
import { useReferralContract } from 'hooks/useContract'
import ReferalLinkImage from '../../img/referral-link.png'
import InviteImage from '../../img/invite.png'
import CoinStackImage from '../../img/coinstack.png'
import copyText from '../../utils/copyText'
import login from '../../utils/login'

import './style.css'
import ReferralNavCard from '../../components/ReferralNavCard'
import { MAX_QUERYING_BLOCK_AMOUNT, REFERRAL_DEPLOYMENT_BLOCKNUMBER } from '../../constants'
import ReferralSegmentInitial from '../../constants/ReferralSegmentInitial'
import ReferralSegment from './Segments/ReferralSegment'
import CoinManagerSegment from './Segments/CoinManagerSegment'
import HistorySegment from './Segments/HistorySegment'
import SubInfluencer from './Segments/SubInfluencer'
import LeadInfluencer from './Segments/LeadInfluencer'
import { Influencer } from './types'

interface IProps {
  isLanding?: boolean
  match?: any
}

const Referral: React.FC<IProps> = () => {
  const { account, chainId, deactivate, activate, library} = useWeb3React()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOutputCoin, setSelectedOutputCoin] = useState<Token | undefined>()
  const [allTokens, setAllTokens] = useState<Array<Token>>([])
  const [referralURL, setReferralURL] = useState('')
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)
  const allTokensTemp = useAllTokens()
  const location = useLocation()
  const refContract = useReferralContract(true)
  const [segmentControllerIndex, setSegmentControllerIndex] = useState(0)
  const [enabledSegments, setEnabledSegments] = useState(ReferralSegmentInitial)
  const [leadInfluencers, setLeadInfluencers] = useState<Influencer[]>([])

  useEffect(() => {
    setAllTokens(Object.values(allTokensTemp))
  }, [allTokensTemp])

  useEffect(() => {
    if (!selectedOutputCoin) {
      setSelectedOutputCoin(allTokens.find((token) => token.symbol === 'KODA'))
    }
  }, [selectedOutputCoin, allTokens])

  const handleLogin = (connectorId: string) => {
    login(connectorId, activate)
  }

  useEffect(() => {
    setEnabledSegments(prevState => {
      const segmentOptions = {...prevState}
      segmentOptions.coinManager.isActive = false
      return segmentOptions
    })
    async function checkIfManager() {
      if (!account || !refContract || !selectedOutputCoin) return
      const isManager = await refContract.isManager(selectedOutputCoin.address, account)
      if (isManager) {
        setEnabledSegments(prevState => {
          const segmentOptions = {...prevState}
          segmentOptions.coinManager.isActive = true
          return segmentOptions
        })
        setSegmentControllerIndex(0)
      }
    }
    checkIfManager()
  }, [account, selectedOutputCoin, refContract])

  useEffect(() => {
    setEnabledSegments(prevState => {
      const segmentOptions = {...prevState}
      segmentOptions.leadInfluencer.isActive = false
      return segmentOptions
    })

    async function fetchReferralData() {
      if (!account || !refContract) return
      
      const referrals = refContract.filters.ReferralRecorded(null, account, selectedOutputCoin?.address)

      const latestBlocknumber = await library.getBlockNumber()

      let referrerEvents = [] as Event[]

      const queries: [start: number, end: number][] = []

      for (
        let blockNumber = REFERRAL_DEPLOYMENT_BLOCKNUMBER;
        blockNumber < latestBlocknumber;
        blockNumber += MAX_QUERYING_BLOCK_AMOUNT
      ) {
        queries.push([blockNumber, Math.min(latestBlocknumber, blockNumber + MAX_QUERYING_BLOCK_AMOUNT - 1)])
      }

      await Promise.all(queries.map(async (query) => {
        const referrerResults = await refContract?.queryFilter(referrals, query[0], query[1])

        referrerEvents = [...referrerEvents, ...referrerResults]
      }))

      const influencers = referrerEvents.map(event => event.args) as unknown as Influencer[]

      if (influencers.length !== 0) {
        setEnabledSegments(prevState => {
          const segmentOptions = {...prevState}
          segmentOptions.leadInfluencer.isActive = true
          return segmentOptions
        })
      }

      setSegmentControllerIndex(0)
      setLeadInfluencers(influencers)
    }
    fetchReferralData()
  }, [refContract, account, selectedOutputCoin, library])

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  useEffect(() => {
    setReferralURL(
      `${document.location.protocol}//${document.location.hostname}${
        document.location.port ? `:${document.location.port}` : ''
      }/#/swap?output=${selectedOutputCoin && selectedOutputCoin.address}&ref=${account}`
    )
  }, [location, account, selectedOutputCoin])

  const handleTokenSelect = useCallback((inputCurrency) => {
    setSelectedOutputCoin(inputCurrency)
  }, [])

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const displayCopiedTooltip = useCallback(() => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }, [])

  const copyReferralLink = useCallback(() => {
    copyText(referralURL, displayCopiedTooltip)
  }, [referralURL, displayCopiedTooltip])

  const isCopySupported = useMemo(() => {
    if ((navigator.clipboard && navigator.permissions) || document.queryCommandSupported('copy')) {
      return true
    }
    return false
  }, [])

  const getViewForSegment = () => {
    const segmentKey = Object.keys(enabledSegments).filter(key => {
      return enabledSegments[key].isActive
    })[segmentControllerIndex]

    // TODO: add caching for segments
    switch (segmentKey) {
      case 'userDashboard':
        return (
          <ReferralSegment 
            copyReferralLink={copyReferralLink} 
            isCopySupported={isCopySupported} 
            isTooltipDisplayed={isTooltipDisplayed} 
            referralURL={referralURL}
            setModalOpen={setModalOpen} 
            selectedOutputCoin={selectedOutputCoin} />
        )
      case 'coinManager':
        return (<CoinManagerSegment selectedCoin={selectedOutputCoin}/>)
      case 'leadInfluencer':
        return <LeadInfluencer influencers={leadInfluencers}/>
      case 'subInfluencer':
        return (<SubInfluencer />)
      case 'history':
        return (<HistorySegment />)
      default:
        return <p>Segment Index out of range</p>
    }

  }

  return (
    <div className="main-content">
      {account && <ReferralNavCard selectedController={segmentControllerIndex} 
          segments={enabledSegments}
          setSegmentControllerIndex={(value: number) => {
            setSegmentControllerIndex(value)
        }} />
      }
      <Box>
        {!account && (
          <Flex mb={3} justifyContent="center">
            <Button style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
              {TranslateString(292, 'CONNECT WALLET')}
            </Button>
          </Flex>
        )}
        {account && getViewForSegment()}
      </Box>

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
          B) Convert it to KAPEX without fee <br />
          C) Convert it to BNB or BUSD (10% - 15% fees respectively)
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
        The project can either fund the rewards with KAPEX our native utility token, or they can feed their own token to
        the reward pool. This means the referrer can earn either KAPEX or TOKEN-EG.
      </p>

      <p className="paragraph">
        The project may choose to remove fees from the reward pool contract so that rewards are paid in full to thier
        loyal community. Although our native investment token KODA and our utility token KAPEX does this, please note
        that every project will have their own set up and may choose to keep the transactions with fees included. You can
        find out this information on their whitelisting project profile through SummitCheck.
      </p>
      <CurrencySearchModal
        isOpen={modalOpen}
        onDismiss={handleDismissSearch}
        onCurrencySelect={handleTokenSelect}
        selectedCurrency={selectedOutputCoin}
        otherSelectedCurrency={null}
        showETH={false}
        showUnknownTokens={false}
        tokens={allTokens.filter((token) => token.referralEnabled)}
      />
    </div>
  )
}

export default Referral