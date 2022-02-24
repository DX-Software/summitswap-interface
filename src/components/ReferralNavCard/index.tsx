import React from 'react'
import { ButtonMenu, ButtonMenuItem } from '@summitswap-uikit'
import styled from 'styled-components';
import { ReferralSements } from '../../constants/ReferralSegmentInitial';

interface ReferralNavCardProps {
    selectedController: number;
    setSegmentControllerIndex: (index: number) => void;
    segments: ReferralSements
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

const ReferralNavCard: React.FC<ReferralNavCardProps> = ({selectedController, setSegmentControllerIndex, segments}) => {

	const getButtons = () => {
		return Object.keys(segments)
			.filter(key => segments[key].isActive)
			.map((key, index) => {
				return <ButtonMenuItem as="button" onClickCapture={() => setSegmentControllerIndex(index)} key={key}>
					{segments[key].title}
				</ButtonMenuItem>
			})
	}

	return (
			<CenterDiv>
				<ButtonMenu activeIndex={selectedController} variant="awesome">
					{getButtons
					()}
				</ButtonMenu>
			</CenterDiv>
	)
}

export default ReferralNavCard