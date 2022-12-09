import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import React from 'react'
import { ReferralSements } from '../../constants/ReferralSegmentInitial'

interface ReferralNavCardProps {
  selectedController: number
  setSegmentControllerIndex: (index: number) => void
  segments: ReferralSements
  isEnabled: boolean
}

const ReferralNavCard: React.FC<ReferralNavCardProps> = ({
  selectedController,
  setSegmentControllerIndex,
  segments,
  isEnabled = false,
}) => {
  const getButtons = () => {
    return Object.keys(segments)
      .filter((key) => segments[key].isActive)
      .map((key, index) => {
        return (
          <ButtonMenuItem
            as="button"
            disabled={isEnabled}
            onClickCapture={() => setSegmentControllerIndex(index)}
            key={key}
          >
            {segments[key].title}
          </ButtonMenuItem>
        )
      })
  }

  return (
    <Box marginBottom="24px">
      <ButtonMenu activeIndex={selectedController} variant="awesome">
        {getButtons()}
      </ButtonMenu>
    </Box>
  )
}

export default ReferralNavCard
