import React from 'react'
import { ButtonMenu, ButtonMenuItem } from '@summitswap-uikit'
import styled from 'styled-components';

interface ReferralNavCardProps {
    selectedController: number;
}

const CenterDiv = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 24px;
    >div {
        >button {
            @media (max-width: 680px) {
                height: 30px;
                font-size: 10px !important;
            }
            @media (max-width: 570px) {
                font-size: 8px !important;
                padding: 2;
            }
            @media (max-width: 480px) {
                height: 25px;
                font-size: 7px !important;
            }
        }
    }
`

const ReferralNavCard: React.FC<ReferralNavCardProps> = ({selectedController}) => {
  return (
    <CenterDiv>
      <ButtonMenu activeIndex={selectedController} variant="awesome">
        <ButtonMenuItem as="button">
            User Dashboard
        </ButtonMenuItem>
        <ButtonMenuItem as="button">
            Coin Manager Dashboard
        </ButtonMenuItem>
        <ButtonMenuItem as="button">
            Lead Influencer Dashboard
        </ButtonMenuItem>
        <ButtonMenuItem as="button">
            Sub Influencer Dashboard
        </ButtonMenuItem>
        <ButtonMenuItem as="button">
            Transaction History
        </ButtonMenuItem>
      </ButtonMenu>
    </CenterDiv>
  )
}

export default ReferralNavCard