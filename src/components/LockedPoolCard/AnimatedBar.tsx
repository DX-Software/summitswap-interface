import React from 'react'
import Styled,{keyframes} from 'styled-components'
import {darkColors, lightColors} from '@koda-finance/summitswap-uikit';

const slide = keyframes`
  from {
    background-position-x: -1000px;
  }
  to {
    background-position-x: 1000px;
  }
`

const Container = Styled.div`
  height: 12px;
  border-radius: 4px;
  background-color: ${darkColors.background};
  display: flex;
  justify-content: center;
  overflow: hidden;
`
const Bar = Styled.div`
  height: 12px;
  width: 1800px;
  border-radius: 4px;
  box-shadow: 0px 10px 13px -6px rgba(44, 62, 80, 1);
  background-color: ${darkColors.background};
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 20px,
    ${lightColors.primaryDark} 20px,
    ${lightColors.primaryDark} 40px
  );
  animation: ${slide} 30s linear infinite;
  will-change: background-position;
}
`

export default function AnimatedBar() {
  return <Container><Bar/></Container>
}
