import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Flex, Text, Box, Button, useWalletModal } from '@summitswap-uikit'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import _ from 'lodash'
import { injected, walletconnect } from 'connectors'
import ReferralTransactionRow from 'components/PageHeader/ReferralTransactionRow'
import { useAllSwapList } from 'state/transactions/hooks'
import { TranslateString } from 'utils/translateTextHelpers'
import QuestionHelper from 'components/QuestionHelper'
import AppBody from '../AppBody'
import RewardedTokens from './RewardedTokens'

interface IProps {
  isLanding?: boolean
  match?: any
}

const Content = styled(Box)<any>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition: 0.3s;
  pointer-events: ${({ open }) => (open ? 'initial' : 'none')};
  > div {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.sidebarBackground} !important;
    min-width: 200px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: 0.3s;
    &:hover {
      color: lightgrey;
    }
  }
`

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'block' : 'none')};
  position: absolute;
  bottom: 36px;
  right: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  background-color: ${({ theme }) => theme.colors.sidebarBackground} !important;
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  width: fit-content;
  padding: 10px;
`

const LinkBox = styled(Box)`
  position: relative;
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
  display: flex;
  align-items: center;
  > div:first-of-type {
    flex: 1;
    overflow: hidden;
    > div {
      overflow: hidden;
      max-width: calc(100% - 20px);
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }
  > div:nth-of-type(2) {
    cursor: pointer;
    position: relative;
  }
`

const Referral: React.FC<IProps> = () => {
  const { account, chainId, deactivate, activate } = useWeb3React()
  const [hashValue] = useState<string>()
  const [referralURL, setReferralURL] = useState('')
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)
  const [optionOpen, setOptionOpen] = useState(false)
  const [allSwapList, setAllSwapList] = useState([])
  const swapListTemp = useAllSwapList()
  const location = useLocation()

  const getAllSwapList = async () => {
    const tmp: any = await swapListTemp
    setAllSwapList(tmp)
  }

  const handleLogin = (connectorId: string) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  useEffect(() => {
    getAllSwapList()
  })

  useEffect(() => {
    const handleSettingLinkUrl = async () => {
      setReferralURL(`http://${document.location.hostname}:${document.location.port}/#/swap?ref=${account}`)
    }
    handleSettingLinkUrl()
  }, [location, account, hashValue])

  return (
    <>
      <AppBody>
        <Box mt={5} minHeight="300px">
          {account && (
            <>
              {/* <GenerateReferral setHashValue={setHashValue} /> */}
              <Text mt={3} mb="8px" bold>
                My Referral link
              </Text>
              <LinkBox mb={4}>
                <Box>
                  <Text>{referralURL}</Text>
                </Box>
                <Box onClick={() => setOptionOpen(!optionOpen)} position="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="22px" height="22px">
                    <path d="M 18 2 A 3 3 0 0 0 15 5 A 3 3 0 0 0 15.054688 5.5605469 L 7.9394531 9.7109375 A 3 3 0 0 0 6 9 A 3 3 0 0 0 3 12 A 3 3 0 0 0 6 15 A 3 3 0 0 0 7.9355469 14.287109 L 15.054688 18.439453 A 3 3 0 0 0 15 19 A 3 3 0 0 0 18 22 A 3 3 0 0 0 21 19 A 3 3 0 0 0 18 16 A 3 3 0 0 0 16.0625 16.712891 L 8.9453125 12.560547 A 3 3 0 0 0 9 12 A 3 3 0 0 0 8.9453125 11.439453 L 16.060547 7.2890625 A 3 3 0 0 0 18 8 A 3 3 0 0 0 21 5 A 3 3 0 0 0 18 2 z" />
                  </svg>
                  <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
                </Box>
                <Content open={optionOpen}>
                  <Box onClick={() => setOptionOpen(false)}>
                    <Box>Twitter</Box>
                    <QuestionHelper
                      text="Please follow my referral link for SummitSwap, if you trade with a participating pair u will get a discount from projects fees on your first trade. Then set up your link & earn commission when
                                            someone uses SummitSwap. Approve the referral after clicking"
                    />
                  </Box>
                  {/* <Box onClick={() => setOptionOpen(false)}>Facebook</Box>
                                    <Box onClick={() => setOptionOpen(false)}>Whatsapp</Box>
                                    <Box onClick={() => setOptionOpen(false)}>Instagram</Box>
                                    <Box onClick={() => setOptionOpen(false)}>Telegram</Box> */}
                  <Box onClick={() => setOptionOpen(false)}>Email</Box>
                  <Box
                    onClick={() => {
                      setOptionOpen(false)
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(referralURL)
                        setIsTooltipDisplayed(true)
                        setTimeout(() => {
                          setIsTooltipDisplayed(false)
                        }, 1000)
                      }
                    }}
                  >
                    <Box>Copy URL</Box>
                    <QuestionHelper text="Please follow my referral link for SummitSwap, if you trade with a participating pair you will get a discount from the projects fees on your first trade. You can also set up your own referral link and earn a commission every time someone uses SummitSwap after you referred them. Just approve the referral after clicking the link" />
                  </Box>
                </Content>
              </LinkBox>
            </>
          )}
          {/* {account && <BalanceCard />} */}
          {account && allSwapList && allSwapList.length <= 0 && <Text>No recent transactions</Text>}
          {account && chainId && allSwapList && allSwapList.length > 0 && (
            <Box mb={2}>
              {_.map(allSwapList, (x: any) => (
                <ReferralTransactionRow {...x} />
              ))}
            </Box>
          )}
          {account && (
            <>
              <Text bold mb={3}>
                Rewarded Tokens
              </Text>
              <RewardedTokens />
            </>
          )}
          {!account && (
            <Flex mb={3} justifyContent="center">
              <Button style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
                {TranslateString(292, 'CONNECT WALLET')}
              </Button>
            </Flex>
          )}
        </Box>
      </AppBody>
    </>
  )
}

export default Referral
