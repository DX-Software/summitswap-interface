import React from 'react'
import { Text, Box } from '@summitswap-uikit'
import styled from 'styled-components'
import { Token } from '@summitswap-libs'

import LinkBox from 'components/LinkBox'
import RewardedTokens from '../RewardedTokens'
import CurrencySelector from '../CurrencySelector'
import SwapList from '../SwapList'

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

interface ReferralSegmentProps {
	copyReferralLink: () => void;
	isTooltipDisplayed: boolean;
	isCopySupported: boolean;
	referralURL: string;
}

const ReferralSegment: React.FC<ReferralSegmentProps> = ({
	isCopySupported, 
	referralURL, 
	copyReferralLink, 
	isTooltipDisplayed
}) => {
  return (
    <>
      <Text mb="8px" bold>
        My Referral link
      </Text>
      <LinkBox mb={3}>
        <Box>
          <Text style={{ whiteSpace: isCopySupported ? 'nowrap' : 'normal' }}>{referralURL}</Text>
        </Box>
        <Box style={{ display: isCopySupported ? 'block' : 'none' }} onClick={copyReferralLink}>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none">
            <path
              d="M13 0L2 0C0.9 0 0 0.9 0 2L0 15C0 15.55 0.45 16 1 16C1.55 16 2 15.55 2 15L2 3C2 2.45 2.45 2 3 2L13 2C13.55 2 14 1.55 14 1C14 0.45 13.55 0 13 0ZM17 4L6 4C4.9 4 4 4.9 4 6L4 20C4 21.1 4.9 22 6 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4ZM16 20H7C6.45 20 6 19.55 6 19L6 7C6 6.45 6.45 6 7 6L16 6C16.55 6 17 6.45 17 7V19C17 19.55 16.55 20 16 20Z"
              fill="white"
            />
          </svg>
          <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
        </Box>
      </LinkBox>
      {/* TODO: Display swaplist using lambda x blockchain events */}
      <RewardedTokens />
    </>
  )
}

export default ReferralSegment
