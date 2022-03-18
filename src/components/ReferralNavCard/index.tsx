import React from 'react'
import { ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { ReferralSements } from '../../constants/ReferralSegmentInitial'

interface ReferralNavCardProps {
  selectedController: number
  setSegmentControllerIndex: (index: number) => void
  segments: ReferralSements
  isEnabled: boolean
}

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 24px;
  > div {

    @media (max-width: 600px) {
      margin: 4px, 4px;
      padding: 4px;
      overflow: auto;
      white-space: nowrap;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`

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
						key={key} >
            {segments[key].title}
          </ButtonMenuItem>
        )
      })
  }

  return (
    <CenterDiv>
      <ButtonMenu activeIndex={selectedController} variant="awesome">
        {getButtons()}
      </ButtonMenu>
    </CenterDiv>
  )
}

export default ReferralNavCard
