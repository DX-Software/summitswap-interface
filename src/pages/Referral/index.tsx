import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Token } from '@koda-finance/summitswap-sdk'
import { Box, Button, useWalletModal, Flex } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { TransactionResponse } from '@ethersproject/providers'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { TranslateString } from 'utils/translateTextHelpers'
import { useAllTokens } from 'hooks/Tokens'
import { useReferralContract } from 'hooks/useContract'
import TransactionConfirmationModal, { TransactionErrorContent } from 'components/TransactionConfirmationModal';
import { useTransactionAdder } from 'state/transactions/hooks'
import ReferalLinkImage from '../../img/referral-link.png'
import InviteImage from '../../img/invite.png'
import CoinStackImage from '../../img/coinstack.png'
import copyText from '../../utils/copyText'
import login from '../../utils/login'

import ReferralNavCard from '../../components/ReferralNavCard'
import ReferralSegmentInitial from '../../constants/ReferralSegmentInitial'
import ReferralSegment from './Segments/ReferralSegment'
import CoinManagerSegment from './Segments/CoinManagerSegment'
import SubInfluencer from './Segments/SubInfluencer'
import LeadInfluencer from './Segments/LeadInfluencer'
import { InfInfo } from './types'
import CurrencySelector from './CurrencySelector'
import SwapList from './SwapList'
import Instructions from './Instructions'

interface IProps {
  isLanding?: boolean
  match?: any
}

const Referral: React.FC<IProps> = () => {
  const addTransaction = useTransactionAdder()
  const { account, deactivate, activate } = useWeb3React()
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
  const [myLeadInfluencerAddress, setMyLeadInfluencerAddress] = useState<string | undefined>()
  const [isSegmentDisabled, setIsSegmentDisabled] = useState({
    checkManager: false,
    checkLeadOrSub: false,
  })

  const [isOpen, setIsOpen] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [pendingText, setPendingText] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const onDismiss = () => {
    setHash(undefined)
    setPendingText('')
    setErrorMessage('')
    setAttemptingTxn(false)
    setIsOpen(false)
  }

  const openModel = useCallback((pendingMess: string) => {
    setIsOpen(true)
    setPendingText(pendingMess)
    setAttemptingTxn(true)
  }, [])

  const transactionSubmitted = useCallback((response: TransactionResponse, summary: string) => {
    setIsOpen(true)
    setAttemptingTxn(false)
    setHash(response.hash)
    addTransaction(response, {
      summary
    })
  }, [addTransaction])

  const transactionFailed = useCallback((messFromError: string) => {
    setIsOpen(true)
    setAttemptingTxn(false)
    setHash(undefined)
    setErrorMessage(messFromError)
  }, [])

  const modelFunctions = {
    openModel,
    transactionSubmitted,
    transactionFailed,
    onDismiss
  }

  useEffect(() => {
    setAllTokens(Object.values(allTokensTemp))
  }, [allTokensTemp])

  useEffect(() => {
    setSegmentControllerIndex(0)
    setIsSegmentDisabled({
      checkLeadOrSub: false, 
      checkManager: false 
    })
  }, [enabledSegments])

  useEffect(() => {
    setEnabledSegments((prevState) => {
      const nextValue = { ...prevState }
      nextValue.leadInfluencer.isActive = false
      nextValue.subInfluencer.isActive = false
      return nextValue
    })
    setIsSegmentDisabled((prevState) => {
      const nextValue = {...prevState}
      nextValue.checkLeadOrSub = false
      return nextValue
    })
    const getIfLead = async () => {
      if (!account || !refContract || !selectedOutputCoin) return
      const influencerInfo = (await refContract.influencers(selectedOutputCoin.address, account)) as InfInfo
      setIsSegmentDisabled((prevState) => {
        const nextValue = {...prevState}
        nextValue.checkLeadOrSub = true
        return nextValue
      })
      setEnabledSegments((prevState) => {
        const nextValue = { ...prevState }
        nextValue.leadInfluencer.isActive = influencerInfo.isLead
        nextValue.subInfluencer.isActive = !influencerInfo.isLead
        if (!influencerInfo.isLead && influencerInfo.lead) {
          setMyLeadInfluencerAddress(influencerInfo.lead)
        }
        return nextValue
      })
    }
    getIfLead()
  }, [selectedOutputCoin, account, refContract])

  useEffect(() => {
    if (!selectedOutputCoin) {
      setSelectedOutputCoin(allTokens.find((token) => token.symbol === 'KODA'))
    }
  }, [selectedOutputCoin, allTokens])

  const handleLogin = (connectorId: string) => {
    login(connectorId, activate)
  }

  useEffect(() => {
    setEnabledSegments((prevState) => {
      const segmentOptions = { ...prevState }
      segmentOptions.coinManager.isActive = false
      return segmentOptions
    })
    setIsSegmentDisabled((prevState) => {
      const nextValue = {...prevState}
      nextValue.checkManager = false
      return nextValue
    })
    async function checkIfManager() {
      if (!account || !refContract || !selectedOutputCoin) return
      const isManager = await refContract.isManager(selectedOutputCoin.address, account)
      if (isManager) {
        setEnabledSegments((prevState) => {
          const segmentOptions = { ...prevState }
          segmentOptions.coinManager.isActive = true
          return segmentOptions
        })
        setIsSegmentDisabled((prevState) => {
          const nextValue = {...prevState}
          nextValue.checkManager = true
          return nextValue
        })
      }
    }
    checkIfManager()
  }, [account, selectedOutputCoin, refContract])

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
    const segmentKey = Object.keys(enabledSegments).filter((key) => {
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
          />
        )
      case 'coinManager':
        return <CoinManagerSegment outputToken={selectedOutputCoin} {...modelFunctions}/>
      case 'leadInfluencer':
        return <LeadInfluencer outputToken={selectedOutputCoin} {...modelFunctions} />
      case 'subInfluencer':
        return <SubInfluencer myLeadInfluencerAddress={myLeadInfluencerAddress} outputToken={selectedOutputCoin} {...modelFunctions} />
      case 'history':
        return <SwapList />
      default:
        return <p>Segment Index out of range</p>
    }
  }

  return (
    <div className="main-content">
      {account && (
        <>
          <CurrencySelector setModalOpen={setModalOpen} selectedOutputCoin={selectedOutputCoin} />
          <ReferralNavCard
            selectedController={segmentControllerIndex}
            segments={enabledSegments}
            isEnabled={isSegmentDisabled.checkLeadOrSub && isSegmentDisabled.checkManager}
            setSegmentControllerIndex={(value: number) => {
              setSegmentControllerIndex(value)
            }}
          />
        </>
      )}
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

      { segmentControllerIndex === 0 && <Instructions referalLinkImage={ReferalLinkImage} inviteImage={InviteImage} coinStackImage={CoinStackImage} /> }

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

      <TransactionConfirmationModal
        isOpen={isOpen}
        onDismiss={onDismiss}
        attemptingTxn={attemptingTxn}
        hash={hash}
        pendingText={pendingText}
        content={() => (errorMessage ? <TransactionErrorContent onDismiss={onDismiss} message={errorMessage || ''} /> : null) } />
    </div>
  )
}

export default Referral