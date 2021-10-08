import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@summitswap-uikit'
import TranslatedText from '../TranslatedText'

const StyledNav = styled.div`
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
  >div {
    width: 100%;
    border-radius: 25px;
    >a {
      flex: 1;
      border-radius: inherit;
      font-size: 16px;
      font-weight: 800;
      box-shadow: none;
      @media (max-width: 300px) {
        height: 30px;
        font-size: 10px !important;
      }
      @media (max-width: 480px) {
        padding: 0;
        font-size: 12px;
      }
    }
  }
`

const Nav = ({ activeIndex = 0 }: { activeIndex?: number }) => (
  <StyledNav>
    <ButtonMenu activeIndex={activeIndex} variant="awesome">
      <ButtonMenuItem id="swap-nav-link" to="/swap" as={Link}>
        <TranslatedText translationId={8}>EXCHANGE</TranslatedText>
      </ButtonMenuItem>
      <ButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
        <TranslatedText translationId={262}>LIQUIDITY</TranslatedText>
      </ButtonMenuItem>
      <ButtonMenuItem
        id="pool-nav-link"
        as={Link}
        to="/summitcheck"
      >
        SUMMITCHECK
      </ButtonMenuItem>
    </ButtonMenu>
  </StyledNav>
)

export default Nav
