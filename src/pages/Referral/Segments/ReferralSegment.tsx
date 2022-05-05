import React from 'react'
import { Text, Box } from '@koda-finance/summitswap-uikit'
import qrCode from 'img/qrCode.svg'
import LinkBox from 'components/LinkBox'
import CopyButton from 'components/CopyButton'
import useReferralLinkQrModal from '../useReferralLinkQrModal'

interface ReferralSegmentProps {
  isCopySupported: boolean
  referralURL: string
}

const ReferralSegment: React.FC<ReferralSegmentProps> = ({ isCopySupported, referralURL }) => {
  const [openReferralLinkQrModal] = useReferralLinkQrModal(referralURL)

  return (
    <>
      <Text mb="8px" bold>
        My Referral Link
      </Text>
      <LinkBox mb={3}>
        <Box>
          <Text style={{ whiteSpace: isCopySupported ? 'nowrap' : 'normal' }}>{referralURL}</Text>
        </Box>
        <Box onClick={openReferralLinkQrModal} mr="10px" style={{ cursor: 'pointer' }}>
          <img src={qrCode} alt="" width={22} height={22} />
        </Box>
        <Box style={{ display: isCopySupported ? 'block' : 'none' }}>
          <CopyButton
            color="#fff"
            text={referralURL}
            tooltipMessage="Copied"
            tooltipTop={-40}
            tooltipRight={-25}
            width="24px"
          />
        </Box>
      </LinkBox>
    </>
  )
}

export default ReferralSegment