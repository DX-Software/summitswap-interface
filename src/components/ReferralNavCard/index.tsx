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
      /* background-color: #08c708; */
      /* width: 300px; */
      overflow: auto;
      white-space: nowrap;
      /* overflow: hidden; */
    }

    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    /* > button {
      @media (max-width: 680px) {
        height: 30px;
        font-size: 10px !important;
      }
      @media (max-width: 570px) {
        padding: 2;
      }
      @media (max-width: 480px) {
        height: 25px;
      } */
    }
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
