import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'

const StyledNav = styled.div`
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
  > div {
    width: 100%;
    border-radius: 25px;
    > a {
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

export default function NavBar({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} variant="awesome">
        <ButtonMenuItem id="swap-nav-link" to="/staking/deposit" as={Link}>
          DEPOSIT
        </ButtonMenuItem>
        <ButtonMenuItem id="swap-nav-link" to="/staking/claim" as={Link}>
          CLAIM
        </ButtonMenuItem>
        <ButtonMenuItem id="pool-nav-link" to="/staking/withdraw" as={Link}>
          WITHDRAW
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  )
}
